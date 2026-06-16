import { Events } from '../core/events.js';
import { AppState } from './AppState.js';
import { esc, formatRupiah } from '../utils/format.js';
import { Printer } from '../utils/printer.js';
import { openModal, closeModal } from '../utils/modal.js';
import { UX } from '../utils/ux.js';

let _PaymentModal;
export function setPaymentModalRef(pm) { _PaymentModal = pm; }

let _Router;
export function setRouterRef(r) { _Router = r; }

let _currentTxId = null;

function receiptHTML(tx) {
    const ds     = new Date(tx.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    const method = _PaymentModal ? _PaymentModal.getPayLabel(tx.method) : tx.method;
    const txNo   = tx.no || ('#' + tx.id.slice(0, 8).toUpperCase());
    const rows   = tx.items.map(i =>
        `<div class="ritem">
            <div class="ritem__name">${esc(i.name)}</div>
            <div class="ritem__qty">${i.qty} × ${formatRupiah(i.price)}</div>
            <div class="ritem__sub">${formatRupiah(i.price * i.qty)}</div>
        </div>`
    ).join('');
    const footer = AppState.storeInfo.footer || 'Terima kasih atas kunjungan Anda ♥';
    return `
    <div class="receipt__head">
        <h3>${esc(AppState.storeInfo.name.toUpperCase())}</h3>
        ${AppState.storeInfo.address ? `<p>${esc(AppState.storeInfo.address)}</p>` : ''}
        ${AppState.storeInfo.phone   ? `<p>Telp: ${esc(AppState.storeInfo.phone)}</p>` : ''}
    </div>
    <div class="rule"></div>
    <div class="rline" style="font-size:11px"><span>No. Transaksi</span><span><b>${esc(txNo)}</b></span></div>
    <div class="rline" style="font-size:11px"><span>Waktu</span><span>${ds}</span></div>
    ${tx.cashier ? `<div class="rline" style="font-size:11px"><span>Kasir</span><span>${esc(tx.cashier)}</span></div>` : ''}
    ${tx.note    ? `<div class="rline" style="font-size:11px"><span>Catatan</span><span style="color:var(--accent-ink)">${esc(tx.note)}</span></div>` : ''}
    <div class="rule"></div>${rows}<div class="rule"></div>
    <div class="rline"><span>Subtotal</span><span>${formatRupiah(tx.subtotal)}</span></div>
    ${tx.discount ? `<div class="rline"><span>Diskon</span><span>-${formatRupiah(tx.discount)}</span></div>` : ''}
    <div class="rline rline--total"><span>TOTAL</span><span>${formatRupiah(tx.total)}</span></div>
    <div class="rule"></div>
    <div class="rline"><span>Metode</span><span>${method}</span></div>
    ${_PaymentModal && _PaymentModal.getPayType(tx.method) === 'cash' ? `
    <div class="rline"><span>Uang Diterima</span><span>${formatRupiah(tx.cash)}</span></div>
    <div class="rline"><span>Kembali</span><span>${formatRupiah(tx.change)}</span></div>` : ''}
    <div class="rule"></div>
    <p class="receipt__thanks">${esc(footer)}</p>`;
}

export const ReceiptModal = {
    mount() {
        Events.on('receipt:show', tx => {
            _currentTxId = tx.id;
            document.getElementById('receiptContent').innerHTML = receiptHTML(tx);
            openModal('receiptModal');
        });
        document.getElementById('printReceiptBtn').addEventListener('click', () => window.print());
        document.getElementById('receiptModal').addEventListener('click', e => {
            if (e.target.dataset.close) { closeModal('receiptModal'); _currentTxId = null; }
        });
        document.getElementById('printBtBtn').addEventListener('click', async () => {
            if (!_currentTxId) return;
            const tx = AppState.state.transactions.find(t => t.id === _currentTxId);
            if (!tx) return;
            try {
                await Printer.printReceipt(tx);
                UX.toast('Berhasil mengirim data ke printer');
            } catch (e) {
                UX.toast(e.message);
            }
        });
        document.getElementById('newTransactionBtn').addEventListener('click', () => {
            closeModal('receiptModal');
            if (_Router) _Router.switchView('pos');
        });
    },
    receiptHTML
};
