import { Events } from '../core/events.js';
import { AppState } from './AppState.js';
import { esc, formatRupiah } from '../utils/format.js';
import { PaymentModal } from './PaymentModal.js';

'use strict';

function render() {
    const ds = new Date().toISOString().slice(0, 10);
    const w = document.getElementById('reportDate');
    let date = ds;
    if (w) { w.value = w.value || ds; date = w.value; }
    
    // 1. Data for Selected Date
    const txs = AppState.state.transactions.filter(tx => tx.date.startsWith(date));
    const totalRev = txs.reduce((s, tx) => s + tx.total, 0);
    const totalTx = txs.length;
    const totalItems = txs.reduce((s, tx) => s + tx.items.reduce((sum, i) => sum + i.qty, 0), 0);
    const totalCost = txs.reduce((s, tx) => s + tx.items.reduce((sum, i) => sum + ((i.cost || 0) * i.qty), 0), 0);
    const profit = totalRev - totalCost;
    
    // 2. Payment Methods Donut Chart
    let methodsHTML = '';
    const mCount = {}; const mRev = {};
    txs.forEach(tx => {
        mCount[tx.method] = (mCount[tx.method] || 0) + 1;
        mRev[tx.method] = (mRev[tx.method] || 0) + tx.total;
    });
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];
    let gradientStops = []; let currentPct = 0; let chartHTML = '';
    const methodKeys = Object.keys(mCount).sort((a,b) => mRev[b] - mRev[a]);
    
    if (methodKeys.length) {
        methodsHTML = methodKeys.map((m, idx) => {
            const pct = totalRev > 0 ? (mRev[m] / totalRev) * 100 : 0;
            const color = colors[idx % colors.length];
            gradientStops.push(`${color} ${currentPct}% ${currentPct + pct}%`);
            currentPct += pct;
            return `
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font-size:13px">
                    <div style="display:flex;align-items:center;gap:8px">
                        <div style="width:12px;height:12px;border-radius:3px;background:${color}"></div>
                        <span style="font-weight:600;color:var(--ink)">${PaymentModal.getPayLabel(m)}</span>
                        <span style="color:var(--muted)">(${mCount[m]} tx)</span>
                    </div>
                    <span style="font-weight:700">${formatRupiah(mRev[m])}</span>
                </div>`
        }).join('');
        
        const conic = gradientStops.join(', ');
        chartHTML = `
                <div style="display:flex;justify-content:center;margin:20px 0 24px">
                    <div style="width:140px;height:140px;border-radius:50%;background:conic-gradient(${conic});position:relative;box-shadow:0 4px 12px rgba(0,0,0,0.05)">
                        <div style="position:absolute;top:24px;left:24px;right:24px;bottom:24px;background:var(--surface);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:inset 0 2px 8px rgba(0,0,0,0.05)">
                            <span style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;font-weight:600">Total</span>
                            <span style="font-size:12px;font-weight:800;color:var(--ink);margin-top:2px">${formatRupiah(totalRev).replace('Rp', '')}</span>
                        </div>
                    </div>
                </div>`;
    } else {
        methodsHTML = '<div style="color:var(--muted);font-size:14px;text-align:center;padding:12px 0">Belum ada data pembayaran hari ini</div>';
    }

    // 3. 7 Days Sales Chart
    const daysLabel = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const sevenDays = [];
    let maxDayRev = 0;
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().slice(0, 10);
        const dayRev = AppState.state.transactions.filter(t => t.date.startsWith(dStr)).reduce((s, t) => s + t.total, 0);
        if (dayRev > maxDayRev) maxDayRev = dayRev;
        sevenDays.push({ label: daysLabel[d.getDay()], rev: dayRev });
    }
    
    const barsHTML = sevenDays.map((d, index) => {
        const pct = maxDayRev > 0 ? (d.rev / maxDayRev) * 100 : 0;
        const isToday = index === 6;
        const fmt = d.rev > 1000 ? (d.rev / 1000) + 'k' : d.rev;
        return `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%">
                <span style="font-size:9px;color:var(--muted);margin-top:auto;white-space:nowrap">${d.rev > 0 ? fmt : ''}</span>
                <div style="width:100%;max-width:24px;height:${pct > 0 ? Math.max(pct, 5) : 2}%;background:${isToday ? 'var(--accent)' : 'var(--border)'};border-radius:4px 4px 0 0;"></div>
                <span style="font-size:10px;font-weight:${isToday ? '700' : '600'};color:${isToday ? 'var(--ink)' : 'var(--muted)'};white-space:nowrap">${isToday ? 'Hari ini' : d.label}</span>
            </div>`;
    }).join('');

    // 4. Top 5 Products (All Time or Last 7 Days)
    const pCount = {};
    AppState.state.transactions.forEach(tx => {
        tx.items.forEach(it => { pCount[it.name] = (pCount[it.name] || 0) + it.qty; });
    });
    const topProducts = Object.keys(pCount).map(k => ({ name: k, qty: pCount[k] }))
        .sort((a,b) => b.qty - a.qty).slice(0, 5);
        
    let topProdHTML = topProducts.length ? topProducts.map((p, i) => `
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;font-size:13px">
                <div style="width:24px;height:24px;border-radius:12px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;color:var(--muted)">${i+1}</div>
                <div style="flex:1;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.name)}</div>
                <div style="font-weight:700;color:var(--primary)">${p.qty} <span style="font-weight:normal;color:var(--muted);font-size:11px">terjual</span></div>
            </div>
        `).join('') : '<div style="color:var(--muted);font-size:13px;text-align:center">Belum ada data penjualan</div>';

    const statsHTML = `
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;background:var(--surface);padding:8px 12px;border-radius:12px;border:1px solid var(--border)">
                <span style="font-size:14px;font-weight:600;flex:1">Pilih Tanggal:</span>
                <input type="date" id="reportDate" value="${date}" class="field__input" style="width:auto;margin:0;padding:6px 12px" />
            </div>
            
            <div class="statcard" style="margin-bottom:12px">
                <div class="statcard__label">Pendapatan Kotor (Omset)</div>
                <div class="statcard__value" style="color:var(--ink)">${formatRupiah(totalRev)}</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
                <div class="statcard">
                    <div class="statcard__label">Total Modal</div>
                    <div class="statcard__value" style="color:var(--danger)">${formatRupiah(totalCost)}</div>
                </div>
                <div class="statcard">
                    <div class="statcard__label">Laba Bersih</div>
                    <div class="statcard__value" style="color:var(--success)">${formatRupiah(profit)}</div>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
                <div class="statcard">
                    <div class="statcard__label">Transaksi</div>
                    <div class="statcard__value">${totalTx}</div>
                </div>
                <div class="statcard">
                    <div class="statcard__label">Item Terjual</div>
                    <div class="statcard__value">${totalItems}</div>
                </div>
            </div>
            
            <div style="background:var(--surface);border-radius:16px;padding:16px;border:1px solid var(--border);margin-bottom:16px">
                <h4 style="margin:0 0 16px 0;font-size:14px;color:var(--ink)">Penjualan 7 Hari Terakhir</h4>
                <div style="display:flex;align-items:flex-end;gap:4px;height:120px;padding-top:10px;border-bottom:1px solid var(--border);padding-bottom:8px">
                    ${barsHTML}
                </div>
            </div>

            <div style="background:var(--surface);border-radius:16px;padding:16px;border:1px solid var(--border);margin-bottom:16px">
                <h4 style="margin:0 0 16px 0;font-size:14px;color:var(--ink)">5 Produk Terlaris</h4>
                ${topProdHTML}
            </div>

            <div style="background:var(--surface);border-radius:16px;padding:16px;border:1px solid var(--border);margin-bottom:32px">
                <h4 style="margin:0 0 12px 0;font-size:14px;color:var(--ink)">Komposisi Pembayaran</h4>
                ${chartHTML}
                ${methodsHTML}
            </div>
        `;
    
    const content = document.getElementById('reports');
    if (content) {
        content.innerHTML = statsHTML;
        document.getElementById('reportDate').addEventListener('change', render);
    }
}

export const ReportsView = {
    mount() {
        Events.on('reports:updated', render);
        render();
    },
    render
};
