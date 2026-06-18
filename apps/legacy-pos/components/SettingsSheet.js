'use strict';
const SettingsSheet = (() => {
    async function backupData() {
        const payload = { app: 'KasirKu', type: 'backup', version: 2, exportedAt: new Date().toISOString(), products: AppState.state.products, transactions: AppState.state.transactions, store: AppState.storeInfo, methods: PaymentModal.customMethods };
        const acc = Auth.getAccount();
        if (!acc) return UX.toast('Anda harus login terlebih dahulu');
        try {
            const b64 = await Crypto.encryptBackup(JSON.stringify(payload), acc.hash);
            const blob = new Blob([b64], { type: 'text/plain' });
            const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `kasirku-backup-${new Date().toISOString().slice(0, 10)}.kxb`;
            document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); Modal.closeModal('settingsSheet'); UX.toast('Backup terenkripsi berhasil diunduh');
        } catch (e) {
            UX.toast('Gagal mengenkripsi backup');
        }
    }
    function sanitize(arr) {
        return (Array.isArray(arr) ? arr : []).filter(p => p && p.name != null).map(p => ({ id: p.id || Format.uid(), name: String(p.name), price: Math.max(0, parseInt(p.price) || 0), category: String(p.category || 'Lainnya') || 'Lainnya', stock: Math.max(0, parseInt(p.stock) || 0) }));
    }
    function restoreData(file) {
        const r = new FileReader();
        r.onload = async () => {
            const acc = Auth.getAccount();
            if (!acc) return UX.toast('Anda harus login terlebih dahulu');
            let d; 
            try { 
                const jsonStr = await Crypto.decryptBackup(r.result, acc.hash);
                d = JSON.parse(jsonStr); 
            } catch (e) { 
                return UX.toast('Gagal memulihkan. File korup atau dari akun yang berbeda.'); 
            }
            const products = sanitize(d && d.products); if (!products.length) return UX.toast('Backup tidak berisi produk valid');
            const ok = await ConfirmDialog.show('Pulihkan data dari backup? Data saat ini akan diganti.', 'Pulihkan'); if (!ok) return;
            AppState.state.products = products; AppState.state.transactions = Array.isArray(d.transactions) ? d.transactions : [];
            if (d.store) { AppState.storeInfo.name = d.store.name || AppState.storeInfo.name; AppState.storeInfo.address = d.store.address || ''; AppState.storeInfo.phone = d.store.phone || ''; AppState.persistStore(); }
            if (Array.isArray(d.methods)) {
                const newMethods = d.methods.filter(m => m.id && m.label && !PaymentModal.BUILTIN_METHODS.find(b => b.id === m.id));
                PaymentModal.customMethods.length = 0; newMethods.forEach(m => PaymentModal.customMethods.push(m)); Storage.save(Storage.KEY.methods, PaymentModal.customMethods);
            }
            AppState.state.cart = []; AppState.state.discount = { type: 'Rp', value: 0 };
            document.getElementById('discountInput').value = 0; document.getElementById('searchInput').value = '';
            AppState.persist(); Events.emit('products:updated'); Events.emit('cart:updated'); Events.emit('history:updated'); Events.emit('reports:updated'); Modal.closeModal('settingsSheet'); UX.toast('Data berhasil dipulihkan');
        };
        r.onerror = () => UX.toast('Gagal membaca file'); r.readAsText(file);
    }
    return {
        mount() {
            document.getElementById('logoutBtn').addEventListener('click', async () => {
                const ok = await ConfirmDialog.show('Keluar dari akun ini?', 'Keluar', false);
                if (!ok) return; Modal.closeModal('settingsSheet'); Auth.logout();
            });
            document.getElementById('storeBtn').addEventListener('click', () => { Events.emit('store:open'); });
            document.getElementById('manageProductsBtn').addEventListener('click', () => { Events.emit('productsSheet:open'); Modal.closeModal('settingsSheet'); });
            document.getElementById('payMethodsBtn').addEventListener('click', () => { Events.emit('payMethods:open'); Modal.closeModal('settingsSheet'); });
            document.getElementById('backupBtn').addEventListener('click', backupData);
            document.getElementById('restoreBtn').addEventListener('click', () => { document.getElementById('restoreInput').click(); });
            document.getElementById('restoreInput').addEventListener('change', e => { const f = e.target.files[0]; if (f) restoreData(f); e.target.value = ''; });
        }
    };
})();

