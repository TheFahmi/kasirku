import { Events } from '../core/events.js';
import { AppState } from './AppState.js';
import { Storage } from '../core/storage.js';
import { esc, formatRupiah, uid } from '../utils/format.js';
import { openModal, closeModal } from '../utils/modal.js';
import { UX } from '../utils/ux.js';
import { ConfirmDialog } from './ConfirmDialog.js';

'use strict';

let _editVariants = [];

function getCategories() { return ['Semua', ...Array.from(new Set(AppState.state.products.map(p => p.category)))]; }

function renderVariantRows() {
    document.getElementById('variantRows').innerHTML = _editVariants.map((v, i) =>
        `<div style="display:flex;gap:6px;margin-bottom:6px;align-items:center">
                <input class="field__input" style="flex:2" placeholder="Nama varian" value="${esc(v.name)}" data-vi="${i}" data-vf="name" />
                <input class="field__input" style="flex:1" type="number" placeholder="Jual" value="${v.price ?? ''}" data-vi="${i}" data-vf="price" inputmode="numeric" />
                <input class="field__input" style="flex:1" type="number" placeholder="Modal" value="${v.cost ?? ''}" data-vi="${i}" data-vf="cost" inputmode="numeric" />
                <button type="button" style="color:var(--danger);font-size:18px;padding:4px 8px" data-vdel="${i}">✕</button>
            </div>`
    ).join('');
}

function openProductForm(id) {
    const p = id ? AppState.state.products.find(x => x.id === id) : null;
    _editVariants = p && p.variants ? p.variants.map(v => ({ ...v })) : [];
    document.getElementById('productModalTitle').textContent = p ? 'Edit Produk' : 'Tambah Produk';
    document.getElementById('productId').value = p ? p.id : '';
    document.getElementById('productName').value = p ? p.name : '';
    document.getElementById('productSku').value = p && p.sku ? p.sku : '';
    document.getElementById('productPrice').value = p ? p.price : '';
    document.getElementById('productCost').value = p && p.cost ? p.cost : '';
    document.getElementById('productCategory').value = p ? p.category : '';
    document.getElementById('productStock').value = p ? p.stock : 0;
    document.getElementById('productPinned').checked = p ? !!p.pinned : false;
    document.getElementById('deleteProductBtn').hidden = !p;
    document.getElementById('categoryOptions').innerHTML = getCategories().filter(c => c !== 'Semua').map(c => `<option value="${esc(c)}">`).join('');
    renderVariantRows();
    openModal('productModal');
}

export const ProductModal = {
    mount() {
        Events.on('product:edit', id => openProductForm(id));
        Events.on('product:add', () => openProductForm());
        Events.on('products:manage', () => { Events.emit('productsSheet:open'); });
        document.getElementById('addVariantBtn').addEventListener('click', () => { _editVariants.push({ id: uid(), name: '', price: null, cost: null }); renderVariantRows(); });
        document.getElementById('variantRows').addEventListener('input', e => {
            const el = e.target; const i = parseInt(el.dataset.vi); if (isNaN(i)) return;
            if (el.dataset.vf === 'name') _editVariants[i].name = el.value;
            if (el.dataset.vf === 'price') _editVariants[i].price = el.value;
            if (el.dataset.vf === 'cost') _editVariants[i].cost = el.value;
        });
        document.getElementById('variantRows').addEventListener('click', e => {
            const btn = e.target.closest('[data-vdel]');
            if (btn) { _editVariants.splice(parseInt(btn.dataset.vdel), 1); renderVariantRows(); }
        });
        document.getElementById('productForm').addEventListener('submit', e => {
            e.preventDefault();
            const id = document.getElementById('productId').value;
            const data = {
                name: document.getElementById('productName').value.trim(), 
                sku: document.getElementById('productSku').value.trim(),
                price: Math.max(0, parseInt(document.getElementById('productPrice').value) || 0),
                cost: document.getElementById('productCost').value ? Math.max(0, parseInt(document.getElementById('productCost').value)) : 0,
                category: document.getElementById('productCategory').value.trim() || 'Lainnya', stock: Math.max(0, parseInt(document.getElementById('productStock').value) || 0),
                pinned: document.getElementById('productPinned').checked,
                variants: _editVariants.filter(v => v.name.trim()).map(v => ({ 
                    id: v.id || uid(), 
                    name: v.name.trim(), 
                    price: (v.price !== '' && v.price !== null && v.price !== undefined) ? Math.max(0, parseInt(v.price) || 0) : null,
                    cost: (v.cost !== '' && v.cost !== null && v.cost !== undefined) ? Math.max(0, parseInt(v.cost) || 0) : null
                }))
            };
            if (!data.name) return UX.toast('Nama produk wajib diisi');
            if (id) { Object.assign(AppState.state.products.find(x => x.id === id), data); UX.toast('Produk diperbarui'); }
            else { AppState.state.products.push({ id: uid(), ...data }); UX.toast('Produk ditambahkan'); }
            AppState.persist(); closeModal('productModal'); Events.emit('products:updated'); Events.emit('productsSheet:refresh');
        });
        document.getElementById('deleteProductBtn').addEventListener('click', async () => {
            const id = document.getElementById('productId').value; if (!id) return;
            const ok = await ConfirmDialog.show('Hapus produk ini?', 'Hapus'); if (!ok) return;
            AppState.state.products = AppState.state.products.filter(x => x.id !== id);
            AppState.state.cart = AppState.state.cart.filter(x => x.id !== id);
            AppState.persist(); closeModal('productModal'); Events.emit('products:updated'); Events.emit('productsSheet:refresh'); Events.emit('cart:updated'); UX.toast('Produk dihapus');
        });
    }
};
