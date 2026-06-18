import { AppState } from './AppState.js';
import { Events } from '../core/events.js';
import { Crypto } from '../core/crypto.js';
import { UX } from '../utils/ux.js';
import { closeModal } from '../utils/modal.js';

// Configuration
// If hosted locally, the server is usually on port 3000 of the same host.
// You can change this to your hosted server URL.
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000/api/sync' : 'http://localhost:3000/api/sync';

async function handlePush() {
    const storeId = document.getElementById('syncStoreId').value.trim();
    const password = document.getElementById('syncPassword').value;

    if (!storeId || !password) return UX.toast('Store ID dan Password wajib diisi');

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
    const storeId = document.getElementById('syncStoreId').value.trim();
    const password = document.getElementById('syncPassword').value;

    if (!storeId || !password) return UX.toast('Store ID dan Password wajib diisi');

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
        const savedId = localStorage.getItem('kasirku.sync.storeid');
        if (savedId) {
            const input = document.getElementById('syncStoreId');
            if (input) input.value = savedId;
        }

        // Save storeId on change
        document.getElementById('syncStoreId').addEventListener('change', e => {
            localStorage.setItem('kasirku.sync.storeid', e.target.value.trim());
        });
    }
};
