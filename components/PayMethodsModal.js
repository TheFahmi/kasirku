'use strict';
const PayMethodsModal = (() => {
    function renderMethodList() {
        const methods = PaymentModal.getPayMethods();
        document.getElementById('methodList').innerHTML = `<div class="panel">${methods.map(m => `<div class="mmethod"><div class="mmethod__label">${Format.esc(m.label)}</div><span class="mmethod__type mmethod__type--${m.type}">${m.type === 'cash' ? 'Tunai' : 'Non-Tunai'}</span>${m.builtin ? '' : `<button class="mmethod__del" data-del-method="${m.id}" aria-label="Hapus">✕</button>` }</div>`).join('')}</div>`;
    }
    return {
        mount() {
            Events.on('payMethods:open', () => { renderMethodList(); document.getElementById('newMethodName').value = ''; Modal.openModal('payMethodsModal'); });
            document.getElementById('addMethodForm').addEventListener('submit', e => {
                e.preventDefault(); const name = document.getElementById('newMethodName').value.trim(); if (!name) return UX.toast('Nama metode wajib diisi');
                const type = document.querySelector('input[name="newMethodType"]:checked').value; const id = 'custom_' + Format.uid();
                PaymentModal.customMethods.push({ id, label: name, type }); Storage.save(Storage.KEY.methods, PaymentModal.customMethods);
                renderMethodList(); document.getElementById('newMethodName').value = ''; UX.toast('Metode ditambahkan');
            });
            document.getElementById('methodList').addEventListener('click', async e => {
                const btn = e.target.closest('[data-del-method]'); if (!btn) return;
                const ok = await ConfirmDialog.show('Hapus metode ini?', 'Hapus'); if (!ok) return;
                const idx = PaymentModal.customMethods.findIndex(m => m.id === btn.dataset.delMethod); if (idx !== -1) PaymentModal.customMethods.splice(idx, 1);
                Storage.save(Storage.KEY.methods, PaymentModal.customMethods); renderMethodList(); UX.toast('Metode dihapus');
            });
        }
    };
})();

