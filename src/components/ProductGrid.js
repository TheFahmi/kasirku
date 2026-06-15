'use strict';
import { Events } from '../core/events.js';
import { AppState } from './AppState.js';
import { esc, formatRupiah, initials } from '../utils/format.js';
import { swatch, emptyState } from '../utils/swatch.js';
import { CartSheet } from './CartSheet.js';

let _CartSheet = CartSheet;
export function setCartSheetRef(cs) { _CartSheet = cs; }

function skeletonGrid(n = 6) {
    return Array.from({ length: n }, () =>
        `<div class="skeleton-card"><div class="skeleton-card__media"></div><div class="skeleton-card__body"><div class="skeleton-card__line skeleton-card__line--tall"></div><div class="skeleton-card__line skeleton-card__line--short"></div></div></div>`
    ).join('');
}
function renderStockAlert() {
    const low = AppState.state.products.filter(p => p.stock > 0 && p.stock <= 5);
    const out = AppState.state.products.filter(p => p.stock <= 0);
    const el = document.getElementById('stockAlertBanner');
    if (!el) return;
    if (!low.length && !out.length) { el.innerHTML = ''; return; }
    const parts = [];
    if (out.length) parts.push(`<b>${out.length} produk habis</b>`);
    if (low.length) parts.push(`${low.length} produk stok ≤ 5`);
    el.innerHTML = `<button class="stock-alert" id="stockAlertBtn">&#9888;&#65039; ${parts.join(', ')} — <u>Kelola produk</u></button>`;
    document.getElementById('stockAlertBtn').addEventListener('click', () => Events.emit('products:manage'));
}
function syncCardBadge(id) {
    const card = document.querySelector(`.pcard[data-add="${id}"]`);
    if (!card) return;
    const media = card.querySelector('.pcard__media');
    let b = media.querySelector('.pcard__badge');
    const q = AppState.cartQty(id);
    if (q > 0) {
        if (!b) { b = document.createElement('span'); b.className = 'pcard__badge'; media.appendChild(b); }
        b.textContent = q; card.classList.add('pcard--incart');
    } else {
        if (b) b.remove(); card.classList.remove('pcard--incart');
    }
}
const render = () => {
    const grid = document.getElementById('productGrid');
    const q = AppState.state.search.trim().toLowerCase();
    let list = AppState.state.products.filter(p =>
        (AppState.state.category === 'Semua' || p.category === AppState.state.category) &&
        (!q || p.name.toLowerCase().includes(q))
    );
    list = [...list.filter(p => p.pinned), ...list.filter(p => !p.pinned)];
    renderStockAlert();
    if (!list.length) {
        grid.innerHTML = `<div style="grid-column:1/-1">${emptyState('Tidak ditemukan', 'Coba kata kunci atau kategori lain')}</div>`;
        return;
    }
    grid.innerHTML = skeletonGrid(Math.min(list.length, 6));
    setTimeout(() => {
        grid.innerHTML = list.map(p => {
            const out = p.stock <= 0; const low = !out && p.stock <= 5; const inC = AppState.cartQty(p.id);
            const [bg, fg] = swatch(p.category);
            const sc = out ? 'pcard__stock--out' : (low ? 'pcard__stock--low' : '');
            const st = out ? 'Habis' : 'Stok ' + p.stock;
            const hasVar = p.variants && p.variants.length > 0;
            const priceLabel = hasVar ? `dari ${formatRupiah(Math.min(p.price, ...p.variants.map(v => v.price ?? p.price)))}` : formatRupiah(p.price);
            return `<button class="pcard ${out ? 'pcard--out' : ''} ${inC ? 'pcard--incart' : ''} ${p.pinned ? 'pcard--pinned' : ''}" data-add="${p.id}" ${out ? 'disabled' : ''}>
  <div class="pcard__media" style="--tile-bg:${bg};--tile-fg:${fg}">
    <span class="pcard__cat">${esc(p.category)}</span>${esc(initials(p.name))}
    ${inC ? `<span class="pcard__badge">${inC}</span>` : ''}
    ${out ? '' : `<span class="pcard__add"><svg class="ico" viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></svg></span>`}
  </div>
  <div class="pcard__body">
    <div class="pcard__name">${esc(p.name)}${hasVar ? ' <small style="color:var(--muted);font-size:10px">▾ varian</small>' : ''}</div>
    <div class="pcard__foot">
      <span class="pcard__price">${priceLabel}</span>
      <span class="pcard__stock ${sc}"><span class="pcard__dot"></span>${st}</span>
    </div>
  </div>
</button>`;
        }).join('');
    }, 150);
};

export const ProductGrid = {
    mount() {
        document.getElementById('productGrid').addEventListener('click', e => {
            const card = e.target.closest('[data-add]');
            if (card) CartSheet.addToCart(card.dataset.add);
        });
        document.getElementById('searchInput').addEventListener('input', e => {
            AppState.state.search = e.target.value; render();
        });
        Events.on('products:filter', () => render());
        Events.on('products:updated', () => render());
        Events.on('cart:updated', () => { AppState.state.products.forEach(p => syncCardBadge(p.id)); });
    },
    render, syncCardBadge
};
