import { Events } from '../core/events.js';
import { AppState } from './AppState.js';
import { esc } from '../utils/format.js';
import { openModal, closeModal } from '../utils/modal.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { UX } from '../utils/ux.js';

let _opnameData = {}; // map of productId -> newStock

function renderList() {
    const listEl = document.getElementById('opnameList');
    const products = AppState.state.products.filter(p => typeof p.stock === 'number');
    
    if (products.length === 0) {
        listEl.innerHTML = '<div style="padding:32px;text-align:center;color:var(--muted)">Tidak ada produk dengan stok tercatat.</div>';
        return;
    }

    listEl.innerHTML = products.map(p => {
        const currentOpname = _opnameData[p.id] ?? p.stock;
        const diff = currentOpname - p.stock;
        let diffBadge = '';
        if (diff > 0) diffBadge = `<span style="color:var(--success);font-size:12px;font-weight:700">▲ +${diff}</span>`;
        else if (diff < 0) diffBadge = `<span style="color:var(--danger);font-size:12px;font-weight:700">▼ ${diff}</span>`;
        else diffBadge = `<span style="color:var(--muted);font-size:12px;font-weight:500">Klop</span>`;

        return `
        <div style="display:flex;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)">
            <div style="flex:1">
                <div style="font-weight:600;font-size:14px">${esc(p.name)}</div>
                <div style="font-size:12px;color:var(--muted)">Sistem: ${p.stock} &nbsp;&nbsp; ${diffBadge}</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
                <button class="iconbtn btn-minus" data-id="${p.id}" style="background:var(--surface-2);border-radius:4px">
                    <svg class="ico ico--sm" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>
                </button>
                <input type="number" class="opname-input" data-id="${p.id}" value="${currentOpname}" min="0" style="width:60px;text-align:center;padding:6px;border:1px solid var(--border);border-radius:6px;font-weight:700">
                <button class="iconbtn btn-plus" data-id="${p.id}" style="background:var(--surface-2);border-radius:4px">
                    <svg class="ico ico--sm" viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                </button>
            </div>
        </div>
        `;
    }).join('');
}

function updateStock(id, val) {
    if (val < 0) val = 0;
    _opnameData[id] = val;
    renderList();
}

function handleScanner(barcode) {
    const el = document.getElementById('stockOpnameSheet');
    if (!el || el.hidden) return; // Only process if opname is open
    
    // Find product with barcode
    const p = AppState.state.products.find(x => x.sku === barcode || x.barcode === barcode);
    if (!p) {
        UX.toast('Barcode tidak dikenali di Opname');
        return;
    }

    const currentOpname = _opnameData[p.id] ?? p.stock;
    updateStock(p.id, currentOpname + 1);
    UX.toast(`+1 ${p.name}`);
}

async function applyOpname() {
    const keys = Object.keys(_opnameData);
    if (keys.length === 0) {
        closeModal('stockOpnameSheet');
        return;
    }

    const ok = await ConfirmDialog.show(`Simpan perubahan untuk ${keys.length} produk?`, 'Simpan');
    if (!ok) return;

    let changes = 0;
    const historyRecord = {
        id: 'opn_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        timestamp: new Date().toISOString(),
        items: []
    };

    for (const id of keys) {
        const p = AppState.state.products.find(x => x.id === id);
        if (p && p.stock !== _opnameData[id]) {
            historyRecord.items.push({
                productId: p.id,
                productName: p.name,
                oldStock: p.stock,
                newStock: _opnameData[id],
                diff: _opnameData[id] - p.stock
            });
            p.stock = _opnameData[id];
            changes++;
        }
    }

    if (changes > 0) {
        if (!AppState.state.opnameHistory) AppState.state.opnameHistory = [];
        AppState.state.opnameHistory.unshift(historyRecord);
        AppState.persist();
        Events.emit('products:updated');
        Events.emit('opnameHistory:updated');
        UX.toast(`${changes} produk diperbarui`);
    } else {
        UX.toast('Tidak ada perubahan stok');
    }
    closeModal('stockOpnameSheet');
}

export const StockOpnameSheet = {
    mount() {
        document.getElementById('stockOpnameBtn').addEventListener('click', () => {
            Events.emit('stockOpname:open');
            closeModal('settingsSheet');
        });

        Events.on('stockOpname:open', () => {
            _opnameData = {}; // reset opname state
            openModal('stockOpnameSheet');
            renderList();
        });

        document.getElementById('opnameHistoryBtn').addEventListener('click', () => {
            Events.emit('opnameHistory:open');
        });

        Events.on('scanner:read', handleScanner);

        document.getElementById('applyOpnameBtn').addEventListener('click', applyOpname);

        const listEl = document.getElementById('opnameList');
        listEl.addEventListener('click', e => {
            const btn = e.target.closest('.iconbtn');
            if (!btn) return;
            const id = btn.dataset.id;
            const current = _opnameData[id] ?? AppState.state.products.find(p => p.id === id).stock;
            if (btn.classList.contains('btn-plus')) updateStock(id, current + 1);
            if (btn.classList.contains('btn-minus')) updateStock(id, current - 1);
        });

        listEl.addEventListener('change', e => {
            if (e.target.classList.contains('opname-input')) {
                const id = e.target.dataset.id;
                let val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 0) val = 0;
                updateStock(id, val);
            }
        });
    }
};
