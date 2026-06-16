import { Events } from '../core/events.js';
import { AppState } from './AppState.js';
import { esc, formatRupiah } from '../utils/format.js';
import { tile, emptyState } from '../utils/swatch.js';
import { openModal } from '../utils/modal.js';
import { UX } from '../utils/ux.js';

'use strict';

function render() {
    const list = AppState.state.products;
    const w = document.getElementById('productList');
    if (!list.length) {
        w.innerHTML = emptyState('Belum ada produk', 'Tambahkan produk pertama Anda');
        return;
    }
    w.innerHTML = list.map(p => {
        const hasVar = p.variants && p.variants.length > 0;
        const priceLabel = hasVar ? `dari ${formatRupiah(Math.min(p.price, ...p.variants.map(v => v.price ?? p.price)))}` : formatRupiah(p.price);
        return `<div class="pcard" style="display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:12px;cursor:pointer" data-edit="${p.id}">
                ${tile(p.name, p.category)}
                <div style="min-width:0">
                    <div style="font-weight:600;color:var(--text);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.name)}</div>
                    <div style="font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.category)} • Stok: ${p.stock}</div>
                </div>
                <div style="text-align:right;min-width:0">
                    <div style="font-weight:700;color:var(--text);font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${priceLabel}</div>
                    ${p.pinned ? `<div style="font-size:12px;color:var(--accent-ink)">📌 Dipin</div>` : ''}
                </div>
            </div>`;
    }).join('');
}

export const ProductsSheet = {
    mount() {
        Events.on('productsSheet:open', () => {
            render();
            openModal('productsSheet');
        });
        Events.on('productsSheet:refresh', render);
        document.getElementById('productList').addEventListener('click', e => {
            const card = e.target.closest('[data-edit]');
            if (card) {
                Events.emit('product:edit', card.dataset.edit);
            }
        });
        document.getElementById('addProductBtn').addEventListener('click', () => {
            Events.emit('product:add');
        });
    },
    render
};
