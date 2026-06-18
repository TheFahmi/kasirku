import { AppState } from './AppState.js';
import { Events } from '../core/events.js';
import { formatRupiah, esc } from '../utils/format.js';
import { emptyState } from '../utils/swatch.js';

function getNextStatus(current) {
    if (current === 'BARU') return 'CUCI';
    if (current === 'CUCI') return 'SETRIKA';
    if (current === 'SETRIKA') return 'SIAP';
    if (current === 'SIAP') return 'SELESAI';
    return 'SELESAI';
}

function getStatusLabel(status) {
    if (status === 'BARU') return 'Baru Diterima';
    if (status === 'CUCI') return 'Sedang Dicuci';
    if (status === 'SETRIKA') return 'Proses Setrika';
    if (status === 'SIAP') return 'Siap Diambil';
    return status;
}

function renderQueue() {
    const list = document.getElementById('queueList');
    if (!list) return;

    const mode = AppState.state.bizMode || 'retail';
    if (mode === 'retail') {
        list.innerHTML = emptyState('Antrean Dinonaktifkan', 'Mode Ritel tidak menggunakan antrean.');
        return;
    }

    const orders = AppState.state.orders.filter(o => o.status !== 'SELESAI');

    if (orders.length === 0) {
        list.innerHTML = emptyState('Antrean Kosong', 'Belum ada pesanan aktif.');
        return;
    }

    // Sort: High priority first, then oldest first
    orders.sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (a.priority !== 'high' && b.priority === 'high') return 1;
        return a.timestamp - b.timestamp;
    });

    list.innerHTML = orders.map(o => {
        const isService = mode === 'service';
        const stLabel = isService ? getStatusLabel(o.status) : 'Sedang Diproses';
        let actionBtnText = 'Tandai Selesai';
        if (isService) {
            if (o.status === 'BARU') actionBtnText = 'Mulai Cuci';
            else if (o.status === 'CUCI') actionBtnText = 'Mulai Setrika';
            else if (o.status === 'SETRIKA') actionBtnText = 'Selesai & Packing';
            else if (o.status === 'SIAP') actionBtnText = 'Serahkan (Selesai)';
        }

        let extraHTML = '';
        if (isService) {
            extraHTML = `
                <div style="background:rgba(0,0,0,0.03);padding:8px;border-radius:4px;font-size:12px;margin-bottom:12px;color:var(--muted)">
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                        <span>WA: ${esc(o.wa || '-')}</span>
                        <span>Estimasi: <strong>${esc(o.dueDate || '-')}</strong></span>
                    </div>
                    <div>Pengiriman: <strong>${esc(o.delivery || 'Ambil Sendiri')}</strong></div>
                </div>
            `;
        }

        return `
        <div class="card" style="margin-bottom:12px;border-left:4px solid ${o.priority === 'high' ? 'var(--danger)' : 'var(--warning)'}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
                <div>
                    <strong style="font-size:16px;display:flex;align-items:center;gap:6px">
                        ${esc(o.customerName || 'Pelanggan Umum')}
                        ${o.priority === 'high' ? '<span style="font-size:10px;background:var(--danger);color:#fff;padding:2px 6px;border-radius:4px;letter-spacing:1px">KILAT</span>' : ''}
                    </strong>
                    <span style="font-size:12px;color:var(--muted)">${new Date(o.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • ${o.id.split('-')[1]}</span>
                </div>
                ${!o.isPaid ? '<span style="font-size:11px;color:var(--danger);font-weight:700;background:rgba(239,68,68,0.1);padding:4px 8px;border-radius:4px">BELUM LUNAS</span>' : '<span style="font-size:11px;color:var(--success);font-weight:700;background:rgba(34,197,94,0.1);padding:4px 8px;border-radius:4px">LUNAS</span>'}
            </div>
            
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:12px;font-weight:700;color:var(--primary)">
                <span>Status: ${stLabel}</span>
            </div>

            ${extraHTML}

            <div style="background:var(--bg);border-radius:var(--r-sm);padding:8px;margin-bottom:12px">
                ${o.items.map(i => `
                    <div style="display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:4px;line-height:1.4">
                        <span style="font-weight:500">${i.qty}x ${esc(i.name)}</span>
                    </div>
                `).join('')}
            </div>
            <div style="display:flex;gap:8px">
                ${!o.isPaid ? `<button class="btn btn--outline" style="flex:1" data-pay="${o.id}">Lunasi Tagihan</button>` : ''}
                ${isService && o.status === 'SIAP' && o.wa ? `<a href="https://wa.me/${o.wa.replace(/^0/,'62')}?text=Halo Kak ${encodeURIComponent(o.customerName)}, cuciannya sudah siap diambil ya! Total tagihan: ${!o.isPaid ? 'Belum lunas ('+formatRupiah(o.total)+')' : 'Sudah lunas'}. Terima kasih!" target="_blank" class="btn" style="flex:1;background:#25D366;color:#fff;border:none">Kabari WA</a>` : ''}
                <button class="btn btn--primary" style="flex:1" data-finish="${o.id}" data-current-status="${o.status}">
                    ${actionBtnText}
                </button>
            </div>
        </div>
        `;
    }).join('');

    // Attach events
    list.querySelectorAll('button[data-finish]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.finish;
            const order = AppState.state.orders.find(x => x.id === id);
            if (order) {
                if (mode === 'service') {
                    order.status = getNextStatus(order.status);
                } else {
                    order.status = 'SELESAI';
                }
                AppState.persist();
                Events.emit('orders:updated');
            }
        });
    });

    list.querySelectorAll('button[data-pay]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.pay;
            const order = AppState.state.orders.find(x => x.id === id);
            const tx = AppState.state.transactions.find(x => x.id === id);
            if (order && tx) {
                if (confirm('Lunasi tagihan ini secara tunai?')) {
                    order.isPaid = true;
                    tx.method = 'cash';
                    tx.cash = tx.total;
                    tx.change = 0;
                    AppState.persist();
                    Events.emit('orders:updated');
                    Events.emit('history:updated');
                    alert('Pembayaran lunas tercatat.');
                }
            }
        });
    });
}

export const QueueView = {
    mount() {
        Events.on('orders:updated', () => {
            renderQueue();
        });
        Events.on('view:change', e => {
            if (e.view === 'queue') renderQueue();
        });
        renderQueue();
    }
};
