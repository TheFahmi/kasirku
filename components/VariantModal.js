'use strict';
const VariantModal = (() => {
    function show(p) {
        document.getElementById('variantModalTitle').textContent = p.name;
        document.getElementById('variantModalSub').textContent   = 'Pilih varian:';
        document.getElementById('variantList').innerHTML = p.variants.map(v =>
            `<button class="btn btn--ghost" style="justify-content:space-between;text-align:left" data-vid="${v.id}" data-pid="${p.id}">
                <span>${Format.esc(v.name)}</span>
                <span style="font-weight:700">${Format.formatRupiah(v.price ?? p.price)}</span>
            </button>`
        ).join('');
        Modal.openModal('variantModal');

        const list = document.getElementById('variantList');
        const clone = list.cloneNode(true);
        list.parentNode.replaceChild(clone, list);
        clone.addEventListener('click', e => {
            const btn = e.target.closest('[data-vid]');
            if (!btn) return;
            CartSheet.addToCart(btn.dataset.pid, btn.dataset.vid);
        });
    }

    return {
        mount() {
            Events.on('variant:pick', p => show(p));
        },
        show
    };
})();
