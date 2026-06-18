import { Events } from '../core/events.js';
import { AppState } from './AppState.js';
import { Storage } from '../core/storage.js';
import { uid } from '../utils/format.js';
import { openModal, closeModal } from '../utils/modal.js';
import { UX } from '../utils/ux.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { Auth } from './Auth.js';
import { PaymentModal, BUILTIN_METHODS, customMethods } from './PaymentModal.js';
import { Crypto } from '../core/crypto.js';
import { CSV } from '../utils/csv.js';

let _PaymentModal = PaymentModal;
export function setPaymentModalRef(pm) { _PaymentModal = pm; }

'use strict';

async function backupData() {
    const payload = { app: 'KasirKu', type: 'backup', version: 2, exportedAt: new Date().toISOString(), products: AppState.state.products, transactions: AppState.state.transactions, store: AppState.storeInfo, methods: customMethods, opnameHistory: AppState.state.opnameHistory };
    const acc = Auth.getAccount();
    if (!acc) return UX.toast('Anda harus login terlebih dahulu');
    try {
        const b64 = await Crypto.encryptBackup(JSON.stringify(payload), acc.hash);
        const blob = new Blob([b64], { type: 'text/plain' });
        const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `kasirku-backup-${new Date().toISOString().slice(0, 10)}.kxb`;
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); closeModal('settingsSheet'); UX.toast('Backup terenkripsi berhasil diunduh');
    } catch (e) {
        UX.toast('Gagal mengenkripsi backup');
    }
}

function sanitize(arr) {
    return (Array.isArray(arr) ? arr : []).filter(p => p && p.name != null).map(p => ({ id: p.id || uid(), name: String(p.name), price: Math.max(0, parseInt(p.price) || 0), category: String(p.category || 'Lainnya') || 'Lainnya', stock: Math.max(0, parseInt(p.stock) || 0) }));
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
        AppState.state.products = products; 
        AppState.state.transactions = Array.isArray(d.transactions) ? d.transactions : [];
        AppState.state.opnameHistory = Array.isArray(d.opnameHistory) ? d.opnameHistory : [];
        if (d.store) { AppState.storeInfo.name = d.store.name || AppState.storeInfo.name; AppState.storeInfo.address = d.store.address || ''; AppState.storeInfo.phone = d.store.phone || ''; AppState.persistStore(); }
        if (Array.isArray(d.methods)) {
            const newMethods = d.methods.filter(m => m.id && m.label && !BUILTIN_METHODS.find(b => b.id === m.id));
            customMethods.length = 0; newMethods.forEach(m => customMethods.push(m)); Storage.save(Storage.KEY.methods, customMethods);
        }
        AppState.state.cart = []; AppState.state.discount = { type: 'Rp', value: 0 };
        document.getElementById('discountInput').value = 0; document.getElementById('searchInput').value = '';
        AppState.persist(); Events.emit('products:updated'); Events.emit('cart:updated'); Events.emit('history:updated'); Events.emit('reports:updated'); closeModal('settingsSheet'); UX.toast('Data berhasil dipulihkan');
    };
    r.onerror = () => UX.toast('Gagal membaca file'); r.readAsText(file);
}

export const SettingsSheet = {
    mount() {
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            const ok = await ConfirmDialog.show('Keluar dari akun ini?', 'Keluar', false);
            if (!ok) return; closeModal('settingsSheet'); Auth.logout();
        });
        document.getElementById('storeBtn').addEventListener('click', () => { Events.emit('store:open'); });
        document.getElementById('manageProductsBtn').addEventListener('click', () => { Events.emit('productsSheet:open'); closeModal('settingsSheet'); });
        document.getElementById('payMethodsBtn').addEventListener('click', () => { Events.emit('payMethods:open'); closeModal('settingsSheet'); });
        document.getElementById('syncBtn').addEventListener('click', () => { openModal('cloudSyncModal'); closeModal('settingsSheet'); });
        document.getElementById('backupBtn').addEventListener('click', backupData);
        document.getElementById('restoreBtn').addEventListener('click', () => { document.getElementById('restoreInput').click(); });
        document.getElementById('restoreInput').addEventListener('change', e => { const f = e.target.files[0]; if (f) restoreData(f); e.target.value = ''; });
        document.getElementById('exportCsvBtn').addEventListener('click', () => { CSV.exportData(AppState.state.products); closeModal('settingsSheet'); });
        document.getElementById('importCsvBtn').addEventListener('click', () => { document.getElementById('importCsvInput').click(); });
        document.getElementById('importCsvInput').addEventListener('change', e => { 
            const f = e.target.files[0]; 
            if (f) {
                CSV.importData(f, async (newProducts) => {
                    const ok = await ConfirmDialog.show(`Impor ${newProducts.length} produk dari CSV?`, 'Impor');
                    if (!ok) return;
                    
                    // Merge logic: update existing if ID matches, else add
                    for (const p of newProducts) {
                        if (p.id) {
                            const existing = AppState.state.products.find(x => x.id === p.id);
                            if (existing) Object.assign(existing, p);
                            else AppState.state.products.push(p);
                        } else {
                            p.id = uid();
                            AppState.state.products.push(p);
                        }
                    }
                    AppState.persist();
                    Events.emit('products:updated');
                    UX.toast('Produk berhasil diimpor');
                    closeModal('settingsSheet');
                }, err => UX.toast(err.message));
            }
            e.target.value = '';
        });
    }
};
