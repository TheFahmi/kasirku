'use strict';
const StoreModal = (() => {
    return {
        mount() {
            Events.on('store:open', () => {
                document.getElementById('storeName').value = AppState.storeInfo.name;
                document.getElementById('storeAddress').value = AppState.storeInfo.address;
                document.getElementById('storePhone').value = AppState.storeInfo.phone;
                document.getElementById('storeFooter').value = AppState.storeInfo.footer || '';
                Modal.openModal('storeModal');
            });
            document.getElementById('storeForm').addEventListener('submit', e => {
                e.preventDefault();
                AppState.storeInfo.name = document.getElementById('storeName').value.trim() || 'KasirKu';
                AppState.storeInfo.address = document.getElementById('storeAddress').value.trim();
                AppState.storeInfo.phone = document.getElementById('storePhone').value.trim();
                AppState.storeInfo.footer = document.getElementById('storeFooter').value.trim();
                AppState.persistStore(); Modal.closeModal('storeModal'); Modal.closeModal('settingsSheet'); UX.toast('Informasi toko diperbarui');
            });
        }
    };
})();

