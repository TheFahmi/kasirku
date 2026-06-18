import { Events } from '../core/events.js';
import { AppState } from './AppState.js';
import { formatRupiah, uid } from '../utils/format.js';
import { openModal, closeModal } from '../utils/modal.js';
import { UX } from '../utils/ux.js';

function render() {
    const active = AppState.getActiveShift();
    const c = document.getElementById('shiftContent');
    
    if (!active) {
        document.getElementById('shiftModalTitle').textContent = 'Buka Shift Kasir';
        c.innerHTML = `
            <div style="margin-bottom:16px;color:var(--muted);font-size:14px">
                Masukkan jumlah uang modal awal (uang fisik) yang ada di dalam laci kasir saat ini.
            </div>
            <label class="field"><span class="field__label">Modal Awal Laci (Rp)</span>
                <input type="number" id="shiftStartCash" class="field__input field__input--lg" inputmode="numeric" placeholder="Contoh: 100000" />
            </label>
            <button class="btn btn--primary btn--block btn--lg" id="openShiftBtn" style="margin-top:24px">Buka Shift</button>
        `;
    } else {
        document.getElementById('shiftModalTitle').textContent = 'Tutup Shift Kasir';
        
        // Calculate expected cash
        const txs = AppState.state.transactions.filter(t => t.shiftId === active.id);
        const cashSales = txs.filter(t => t.method === 'cash').reduce((s, t) => s + t.total, 0);
        const expectedCash = active.startCash + cashSales;
        
        c.innerHTML = `
            <div style="background:var(--accent-soft);color:var(--accent-ink);padding:12px;border-radius:8px;margin-bottom:16px;font-size:13px">
                Shift dimulai pada: <b>${new Date(active.startTime).toLocaleString('id-ID')}</b>
            </div>
            
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px">
                <span style="color:var(--muted)">Modal Awal</span>
                <strong style="color:var(--ink)">${formatRupiah(active.startCash)}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px">
                <span style="color:var(--muted)">Penjualan Tunai</span>
                <strong style="color:var(--ink)">+ ${formatRupiah(cashSales)}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:20px;font-size:15px;padding-top:8px;border-top:1px dashed var(--border)">
                <span style="font-weight:600;color:var(--ink)">Estimasi Uang di Laci</span>
                <strong style="color:var(--primary)">${formatRupiah(expectedCash)}</strong>
            </div>
            
            <label class="field"><span class="field__label">Hitung Uang Fisik Aktual (Rp)</span>
                <input type="number" id="shiftEndCash" class="field__input field__input--lg" inputmode="numeric" placeholder="Masukkan total uang fisik di laci" />
            </label>
            
            <button class="btn btn--danger btn--block btn--lg" id="closeShiftBtn" style="margin-top:24px" data-expected="${expectedCash}">Tutup Shift</button>
        `;
    }
}

export const ShiftModal = {
    mount() {
        Events.on('shift:open', () => {
            render();
            openModal('shiftModal');
        });
        
        Events.on('shift:updated', checkShiftReminder);
        setInterval(checkShiftReminder, 60000); // Check every minute
        checkShiftReminder(); // Initial check
        
        document.getElementById('shiftContent').addEventListener('click', e => {
            if (e.target.id === 'openShiftBtn') {
                const startCash = parseInt(document.getElementById('shiftStartCash').value) || 0;
                AppState.state.shifts.unshift({
                    id: uid(),
                    startTime: Date.now(),
                    startCash,
                    endTime: null,
                    endCash: null,
                    systemCash: null
                });
                AppState.persist();
                UX.toast('Shift kasir berhasil dibuka');
                closeModal('shiftModal');
                Events.emit('shift:updated');
            }
            
            if (e.target.id === 'closeShiftBtn') {
                const endCashInput = document.getElementById('shiftEndCash').value;
                if (!endCashInput) return UX.toast('Masukkan uang fisik aktual terlebih dahulu');
                
                const endCash = parseInt(endCashInput) || 0;
                const expectedCash = parseInt(e.target.dataset.expected) || 0;
                
                const active = AppState.getActiveShift();
                if (active) {
                    active.endTime = Date.now();
                    active.endCash = endCash;
                    active.systemCash = expectedCash;
                    AppState.persist();
                }
                
                const diff = endCash - expectedCash;
                let msg = 'Shift ditutup. ';
                if (diff === 0) msg += 'Uang laci pas (Balance).';
                else if (diff > 0) msg += `Uang laci lebih ${formatRupiah(diff)}.`;
                else msg += `Uang laci KURANG ${formatRupiah(Math.abs(diff))}!`;
                
                UX.toast(msg);
                closeModal('shiftModal');
                Events.emit('shift:updated');
            }
        });
    }
};

export function checkShiftReminder() {
    const blocker = document.getElementById('shiftBlocker');
    if (!blocker) return;
    
    const active = AppState.getActiveShift();
    
    // Auto-close shift if day changed
    if (active) {
        const startDate = new Date(active.startTime).toDateString();
        const today = new Date().toDateString();
        if (startDate !== today) {
            const txs = AppState.state.transactions.filter(t => t.shiftId === active.id);
            const cashSales = txs.filter(t => t.method === 'cash').reduce((s, t) => s + t.total, 0);
            const expectedCash = active.startCash + cashSales;
            
            active.endTime = Date.now();
            active.systemCash = expectedCash;
            active.endCash = expectedCash; // Dianggap balance
            active.autoClosed = true;
            AppState.persist();
            
            UX.toast('Shift kemarin telah ditutup otomatis');
            Events.emit('shift:updated'); // Re-trigger checkShiftReminder
            return;
        }
    }
    
    if (!active) {
        document.getElementById('shiftBlockerIcon').style.background = 'rgba(239,68,68,0.1)';
        document.getElementById('shiftBlockerIcon').style.color = 'var(--danger)';
        document.getElementById('shiftBlockerTitle').textContent = 'Shift Belum Dibuka';
        document.getElementById('shiftBlockerDesc').textContent = 'Anda harus membuka shift kasir terlebih dahulu sebelum dapat melakukan transaksi penjualan hari ini.';
        document.getElementById('shiftBlockerBtn').textContent = 'Buka Shift Sekarang';
        blocker.hidden = false;
        return;
    }
    
    const hours = (Date.now() - active.startTime) / (1000 * 60 * 60);
    if (hours > 12) {
        document.getElementById('shiftBlockerIcon').style.background = 'rgba(245,158,11,0.1)';
        document.getElementById('shiftBlockerIcon').style.color = 'var(--warning)';
        document.getElementById('shiftBlockerTitle').textContent = 'Shift Berjalan Terlalu Lama';
        document.getElementById('shiftBlockerDesc').textContent = 'Shift saat ini sudah berjalan lebih dari 12 jam. Jangan lupa untuk menutup shift sebelum pulang.';
        document.getElementById('shiftBlockerBtn').textContent = 'Tutup Shift Sekarang';
        blocker.hidden = false;
        return;
    }
    
    blocker.hidden = true;
}
