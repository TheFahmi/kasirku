'use strict';
const CategoryChips = (() => {
    const render = () => {
        const cats = ['Semua', ...Array.from(new Set(AppState.state.products.map(p => p.category)))];
        document.getElementById('categoryChips').innerHTML = cats.map(c =>
            `<button class="chip ${c === AppState.state.category ? 'chip--active' : ''}" data-cat="${Format.esc(c)}">${Format.esc(c)}</button>`
        ).join('');
    };
    return {
        mount() {
            document.getElementById('categoryChips').addEventListener('click', e => {
                const chip = e.target.closest('[data-cat]');
                if (!chip) return;
                AppState.state.category = chip.dataset.cat;
                render();
                Events.emit('products:filter');
            });
        },
        render
    };
})();
