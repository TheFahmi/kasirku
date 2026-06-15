'use strict';
import { Events } from '../core/events.js';
import { AppState } from './AppState.js';
import { esc, formatRupiah } from '../utils/format.js';
import { tile, emptyState } from '../utils/swatch.js';
import { Modal } from '../utils/modal.js';
import { UX } from '../utils/ux.js';
import { ConfirmDialog } from './ConfirmDialog.js';

// Break circular dependency: ProductGrid imports CartSheet, CartSheet imports ProductGrid.
// The caller (main.js) should call setProductGridRef(ProductGrid) after both are imported.
let ProductGrid;
export function setProductGridRef(pg) { ProductGrid = pg; }

function addToCart(id, variantId) {
    const p = AppState.state.products.find(x => x.id === id);
    if (!p) return;
    if (p.variants && p.variants.length > 0 && !variantId) {
        Events.emit('variant:pick', p);
        return;
    }
    const v       = variantId ? (p.variants || []).find(x => x.id === variantId) : null;
    const cartKey = variantId ? `${id}::${variantId}` : id;
    const price   = v ? (v.price ?? p.price) : p.price;
    const name    = v ? `${p.name} - ${v.name}` : p.name;
    const it      = AppState.state.cart.find(x => x.cartKey === cartKey);
    const totalQty = AppState.state.cart.filter(x => x.id === id).reduce((s, x) => s + x.qty, 0);
    if (totalQty >= p.stock) return UX.toast('Stok tidak mencukupi');
    if (it) it.qty++;
    else AppState.state.cart.push({ cartKey, id: p.id, variantId: variantId || null, name, price, category: p.category, qty: 1 });
    Modal.closeModal('variantModal');
    UX.haptic(15); UX.playSound('pop'); UX.popCartBar();
    UX.toast(name + ' ditambahkan');
    if (ProductGrid) ProductGrid.syncCardBadge(id);
    AppState.persist();
    Events.emit('cart:updated');
    render();
}

function changeQty(key, d) {
    const it = AppState.state.cart.find(x => (x.cartKey || x.id) === key);
    if (!it) return;
    const p = AppState.state.products.find(x => x.id === it.id);
    if (d > 0) {
        const totalQty = AppState.state.cart.filter(x => x.id === it.id).reduce((s, x) => s + x.qty, 0);
        if (p && totalQty >= p.stock) return UX.toast('Stok tidak mencukupi');
    }
    it.qty += d;
    if (it.qty <= 0) AppState.state.cart = AppState.state.cart.filter(x => (x.cartKey || x.id) !== key);
    if (d > 0) { UX.haptic(15); UX.playSound('pop'); UX.popCartBar(); } else UX.haptic(10);
    if (ProductGrid) ProductGrid.syncCardBadge(it.id);
    AppState.persist();
    Events.emit('cart:updated');
    render();
}

function render() {
    const w = document.getElementById('cartItems');
    if (!AppState.state.cart.length) {
        w.innerHTML = emptyState('Keranjang kosong', 'Pilih produk untuk mulai transaksi');
    } else {
        w.innerHTML = AppState.state.cart.map(i =>
            `<div class="citem">${tile(i.name, i.category)}
    <div class="citem__info">
        <div class="citem__name">${esc(i.name)}</div>
        <div class="citem__price">${formatRupiah(i.price)} × ${i.qty} = ${formatRupiah(i.price * i.qty)}</div>
    </div>
    <div class="qty">
        <button class="qty__btn" data-dec="${i.cartKey || i.id}">−</button>
        <span class="qty__num">${i.qty}</span>
        <button class="qty__btn" data-inc="${i.cartKey || i.id}">+</button>
    </div>
</div>`
        ).join('');
    }
    document.getElementById('cartSubtotal').textContent = formatRupiah(AppState.cartSubtotal());
    document.getElementById('cartTotal').textContent     = formatRupiah(AppState.cartTotal());
    document.getElementById('checkoutBtn').disabled      = !AppState.state.cart.length;
    Events.emit('cart:updated');
}

export const CartSheet = {
    mount() {
        Events.on('cart:open', () => {
            render();
            Modal.openModal('cartSheet');
        });
        document.getElementById('cartItems').addEventListener('click', e => {
            const inc = e.target.closest('[data-inc]');
            const dec = e.target.closest('[data-dec]');
            if (inc) changeQty(inc.dataset.inc, 1);
            if (dec) changeQty(dec.dataset.dec, -1);
        });
        document.getElementById('discountInput').addEventListener('input', e => {
            AppState.state.discount.value = Math.max(0, parseFloat(e.target.value) || 0);
            AppState.persist();
            render();
        });
        document.getElementById('discountType').addEventListener('change', e => {
            AppState.state.discount.type = e.target.value;
            AppState.persist();
            render();
        });
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            if (AppState.state.cart.length) Events.emit('payment:open');
        });
        document.getElementById('clearCartBtn').addEventListener('click', async () => {
            if (!AppState.state.cart.length) return;
            const ok = await ConfirmDialog.show('Kosongkan keranjang?', 'Kosongkan');
            if (!ok) return;
            const ids = AppState.state.cart.map(i => i.id);
            AppState.state.cart     = [];
            AppState.state.discount = { type: 'Rp', value: 0 };
            document.getElementById('discountInput').value = 0;
            document.getElementById('discountType').value  = 'Rp';
            if (ProductGrid) ids.forEach(ProductGrid.syncCardBadge);
            AppState.persist();
            UX.haptic([15, 50, 15]);
            Events.emit('cart:updated');
            render();
        });
    },
    render,
    addToCart
};
