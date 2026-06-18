import { AppState } from './AppState.js';
import { Events } from '../core/events.js';
import { Crypto } from '../core/crypto.js';
import { UX } from '../utils/ux.js';
import { closeModal } from '../utils/modal.js';

// Configuration
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000/api/sync' : 'http://localhost:3000/api/sync';

let syncTimeout = null;

function scheduleBackgroundPush() {
    const isAuto = localStorage.getItem('kasirku.sync.auto') === 'true';
    if (!isAuto) return;

    const storeId = localStorage.getItem('kasirku.sync.storeid');
    const password = localStorage.getItem('kasirku.sync.password');
    if (!storeId || !password) return;

    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(async () => {
        try {
            const bundle = { state: AppState.state, storeInfo: AppState.storeInfo };
            const jsonStr = JSON.stringify(bundle);
            const encryptedBlob = await Crypto.encryptBackup(jsonStr, password);

            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storeId, blob: encryptedBlob })
            });
            console.log('[CloudSync] Auto push success');
        } catch (e) {
            console.error('[CloudSync] Auto push failed:', e);
        }
    }, 5000); // 5 seconds debounce
}

async function handlePush() {
    const storeId = document.getElementById('syncMyStoreId').value.trim();
    const password = document.getElementById('syncPassword').value;

    if (!storeId || !password) return UX.toast('Password wajib diisi');

    try {
        const btn = document.getElementById('syncPushBtn');
        btn.textContent = 'Memproses...';
        btn.disabled = true;

        // Prepare data bundle
        const bundle = {
            state: AppState.state,
            storeInfo: AppState.storeInfo
        };

        const jsonStr = JSON.stringify(bundle);
        const encryptedBlob = await Crypto.encryptBackup(jsonStr, password);

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ storeId, blob: encryptedBlob })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Server error');

        UX.toast('Data berhasil diunggah ke Cloud!');
        closeModal('cloudSyncModal');
        
    } catch (e) {
        console.error(e);
        UX.toast('Gagal mengunggah: ' + e.message);
    } finally {
        const btn = document.getElementById('syncPushBtn');
        btn.textContent = 'Unggah (Push)';
        btn.disabled = false;
    }
}

async function handlePull() {
    const storeId = document.getElementById('syncTargetStoreId').value.trim();
    const password = document.getElementById('syncPassword').value;

    if (!storeId) return UX.toast('Silakan ketik ID Perangkat Lain yang ingin ditarik');
    if (!password) return UX.toast('Password wajib diisi');

    if (!confirm('Peringatan: Menarik data akan menimpa data yang ada di HP ini. Lanjutkan?')) return;

    try {
        const btn = document.getElementById('syncPullBtn');
        btn.textContent = 'Memproses...';
        btn.disabled = true;

        const res = await fetch(`${API_URL}/${storeId}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Server error');

        // Decrypt
        const jsonStr = await Crypto.decryptBackup(data.blob, password);
        const bundle = JSON.parse(jsonStr);

        if (!bundle || !bundle.state) throw new Error('Format data tidak valid');

        // Overwrite state
        Object.assign(AppState.state, bundle.state);
        Object.assign(AppState.storeInfo, bundle.storeInfo || {});
        
        AppState.persist();
        AppState.persistStore();

        UX.toast('Data berhasil ditarik dari Cloud!');
        
        // Reload to apply changes cleanly
        setTimeout(() => { window.location.reload(); }, 1500);

    } catch (e) {
        console.error(e);
        if (e.name === 'OperationError') {
            UX.toast('Gagal: Password Enkripsi SALAH!');
        } else {
            UX.toast('Gagal menarik data: ' + e.message);
        }
    } finally {
        const btn = document.getElementById('syncPullBtn');
        btn.textContent = 'Tarik Data (Pull)';
        btn.disabled = false;
    }
}

export const CloudSync = {
    mount() {
        document.getElementById('syncPushBtn').addEventListener('click', handlePush);
        document.getElementById('syncPullBtn').addEventListener('click', handlePull);
        
        // Load remembered storeId if any (from local storage)
        let savedId = localStorage.getItem('kasirku.sync.storeid');
        if (!savedId) {
            // Generate a 6-character random alphanumeric ID
            savedId = Math.random().toString(36).substring(2, 8).toUpperCase();
            localStorage.setItem('kasirku.sync.storeid', savedId);
        }
        
        const input = document.getElementById('syncMyStoreId');
        if (input) input.value = savedId;

        // Auto Upload Logic
        const autoCheckbox = document.getElementById('syncAutoUpload');
        const passInput = document.getElementById('syncPassword');

        const isAuto = localStorage.getItem('kasirku.sync.auto') === 'true';
        autoCheckbox.checked = isAuto;
        if (isAuto) {
            passInput.value = localStorage.getItem('kasirku.sync.password') || '';
        }

        autoCheckbox.addEventListener('change', e => {
            if (e.target.checked) {
                if (!passInput.value) {
                    e.target.checked = false;
                    UX.toast('Silakan isi Password Enkripsi terlebih dahulu');
                    return passInput.focus();
                }
                localStorage.setItem('kasirku.sync.auto', 'true');
                localStorage.setItem('kasirku.sync.password', passInput.value);
                UX.toast('Auto Upload diaktifkan');
                scheduleBackgroundPush();
            } else {
                localStorage.removeItem('kasirku.sync.auto');
                localStorage.removeItem('kasirku.sync.password');
                UX.toast('Auto Upload dinonaktifkan');
            }
        });

        passInput.addEventListener('change', e => {
            if (autoCheckbox.checked) {
                localStorage.setItem('kasirku.sync.password', e.target.value);
            }
        });

        // Hook into app events
        Events.on('products:updated', scheduleBackgroundPush);
        Events.on('tx:updated', scheduleBackgroundPush);
        Events.on('shift:updated', scheduleBackgroundPush);
        Events.on('expense:updated', scheduleBackgroundPush);
        Events.on('store:updated', scheduleBackgroundPush);
    }
};
