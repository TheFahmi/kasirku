import { Events } from '../core/events.js';
import { AppState } from './AppState.js';
import { esc, formatRupiah } from '../utils/format.js';
import { Swatch } from '../utils/swatch.js';
import { PaymentModal } from './PaymentModal.js';

function render() {
    const w = document.getElementById('historyList');
    if (!AppState.state.transactions.length) {
        w.innerHTML = Swatch.emptyState('Belum ada transaksi', 'Transaksi yang selesai akan muncul di sini');
        return;
    }
    const q = (document.getElementById('searchHistoryInput').value || '').trim().toLowerCase();
    let list = AppState.state.transactions;
    if (q) {
        list = list.filter(tx => 
            (tx.no || '').toLowerCase().includes(q) || 
            (tx.note || '').toLowerCase().includes(q) || 
            (tx.id || '').toLowerCase().includes(q)
        );
    }
    const fromDate = document.getElementById('historyFrom').value;
    const toDate   = document.getElementById('historyTo').value;
    if (fromDate) list = list.filter(tx => tx.date.slice(0, 10) >= fromDate);
    if (toDate)   list = list.filter(tx => tx.date.slice(0, 10) <= toDate);
    
    if (!list.length) {
        w.innerHTML = Swatch.emptyState('Tidak ditemukan', 'Coba kata kunci pencarian lain');
        return;
    }
    w.innerHTML = list.map(tx => {
        const ds = new Date(tx.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
        const txNo = tx.no || '#' + tx.id.slice(0, 8).toUpperCase();
        const method = PaymentModal.getPayLabel(tx.method);
        return `<button class="txcard" data-tx="${tx.id}">
                <div class="txcard__head">
                    <span class="txcard__no">${esc(txNo)}</span>
                    <span class="txcard__date">${ds}</span>
                </div>
                <div class="txcard__body">
                    <div class="txcard__info">
                        <div class="txcard__qty">${tx.items.length} item</div>
                        <div class="txcard__method">${method}</div>
                    </div>
                    <div class="txcard__total">${formatRupiah(tx.total)}</div>
                </div>
                ${tx.note ? `<div style="font-size:12px;color:var(--accent-ink);margin-top:8px">Catatan: ${esc(tx.note)}</div>` : ''}
            </button>`;
    }).join('');
}

const HistoryView = {
    mount() {
        Events.on('history:updated', render);
        document.getElementById('historyList').addEventListener('click', e => {
            const btn = e.target.closest('[data-tx]');
            if (!btn) return;
            const tx = AppState.state.transactions.find(x => x.id === btn.dataset.tx);
            if (tx) Events.emit('receipt:show', tx);
        });
        document.getElementById('searchHistoryInput').addEventListener('input', () => {
            if (!document.getElementById('view-history').hidden) render();
        });
        document.getElementById('historyFrom').addEventListener('change', render);
        document.getElementById('historyTo').addEventListener('change', render);
        document.getElementById('clearDateBtn').addEventListener('click', () => {
            document.getElementById('historyFrom').value = '';
            document.getElementById('historyTo').value = '';
            render();
        });
        render();
    },
    render
};

export { HistoryView };
