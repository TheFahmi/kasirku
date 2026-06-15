'use strict';
const ReceiptModal = (() => {
    function receiptHTML(tx) {
        const ds     = new Date(tx.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
        const method = PaymentModal.getPayLabel(tx.method);
        const txNo   = tx.no || ('#' + tx.id.slice(0, 8).toUpperCase());
        const rows   = tx.items.map(i =>
            `<div class="ritem">
                <div class="ritem__name">${Format.esc(i.name)}</div>
                <div class="ritem__qty">${i.qty} × ${Format.formatRupiah(i.price)}</div>
                <div class="ritem__sub">${Format.formatRupiah(i.price * i.qty)}</div>
            </div>`
        ).join('');
        const footer = AppState.storeInfo.footer || 'Terima kasih atas kunjungan Anda ♥';
        return `
        <div class="receipt__head">
            <h3>${Format.esc(AppState.storeInfo.name.toUpperCase())}</h3>
            ${AppState.storeInfo.address ? `<p>${Format.esc(AppState.storeInfo.address)}</p>` : ''}
            ${AppState.storeInfo.phone   ? `<p>Telp: ${Format.esc(AppState.storeInfo.phone)}</p>` : ''}
        </div>
        <div class="rule"></div>
        <div class="rline" style="font-size:11px"><span>No. Transaksi</span><span><b>${Format.esc(txNo)}</b></span></div>
        <div class="rline" style="font-size:11px"><span>Waktu</span><span>${ds}</span></div>
        ${tx.cashier ? `<div class="rline" style="font-size:11px"><span>Kasir</span><span>${Format.esc(tx.cashier)}</span></div>` : ''}
        ${tx.note    ? `<div class="rline" style="font-size:11px"><span>Catatan</span><span style="color:var(--accent-ink)">${Format.esc(tx.note)}</span></div>` : ''}
        <div class="rule"></div>${rows}<div class="rule"></div>
        <div class="rline"><span>Subtotal</span><span>${Format.formatRupiah(tx.subtotal)}</span></div>
        ${tx.discount ? `<div class="rline"><span>Diskon</span><span>-${Format.formatRupiah(tx.discount)}</span></div>` : ''}
        <div class="rline rline--total"><span>TOTAL</span><span>${Format.formatRupiah(tx.total)}</span></div>
        <div class="rule"></div>
        <div class="rline"><span>Metode</span><span>${method}</span></div>
        ${PaymentModal.getPayType(tx.method) === 'cash' ? `
        <div class="rline"><span>Uang Diterima</span><span>${Format.formatRupiah(tx.cash)}</span></div>
        <div class="rline"><span>Kembali</span><span>${Format.formatRupiah(tx.change)}</span></div>` : ''}
        <div class="rule"></div>
        <p class="receipt__thanks">${Format.esc(footer)}</p>`;
    }

    return {
        mount() {
            Events.on('receipt:show', tx => {
                document.getElementById('receiptContent').innerHTML = receiptHTML(tx);
                Modal.openModal('receiptModal');
            });

            document.getElementById('printReceiptBtn').addEventListener('click', () => window.print());
            document.getElementById('newTransactionBtn').addEventListener('click', () => {
                Modal.closeModal('receiptModal');
                Router.switchView('pos');
            });
        },
        receiptHTML
    };
})();
