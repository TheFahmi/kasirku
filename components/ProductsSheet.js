'use strict';
const ProductsSheet = (() => {
    function render() {
        const list = AppState.state.products;
        const w = document.getElementById('productList');
        if (!list.length) {
            w.innerHTML = Swatch.emptyState('Belum ada produk', 'Tambahkan produk pertama Anda');
            return;
        }
        w.innerHTML = list.map(p => {
            const hasVar = p.variants && p.variants.length > 0;
            const priceLabel = hasVar ? `dari ${Format.formatRupiah(Math.min(p.price, ...p.variants.map(v => v.price ?? p.price)))}` : Format.formatRupiah(p.price);
            return `<div class="pcard" style="flex-direction:row;align-items:center;padding:12px;cursor:pointer" data-edit="${p.id}">
                ${Swatch.tile(p.name, p.category)}
                <div style="flex:1;margin-left:12px">
                    <div style="font-weight:600;color:var(--text);margin-bottom:4px">${Format.esc(p.name)}</div>
                    <div style="font-size:13px;color:var(--muted)">${Format.esc(p.category)} • Stok: ${p.stock}</div>
                </div>
                <div style="text-align:right">
                    <div style="font-weight:700;color:var(--text)">${priceLabel}</div>
                    ${p.pinned ? `<div style="font-size:12px;color:var(--accent-ink)">📌 Dipin</div>` : ''}
                </div>
            </div>`;
        }).join('');
    }

    return {
        mount() {
            Events.on('productsSheet:open', () => {
                render();
                Modal.openModal('productsSheet');
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
})();
