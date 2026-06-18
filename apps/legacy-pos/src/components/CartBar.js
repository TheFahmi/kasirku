'use strict';
import { Events } from '../core/events.js';
import { AppState } from './AppState.js';
import { formatRupiah } from '../utils/format.js';

const render = () => {
    const n = AppState.cartCount();
    document.getElementById('cartBarCount').textContent = n;
    document.getElementById('cartBarTotal').textContent = formatRupiah(AppState.cartTotal());
    const cartBarEl = document.getElementById('cartBar');
    cartBarEl.hidden = false; // Selalu tampil
    cartBarEl.style.opacity = n ? '1' : '.6';

    const labelEl = document.querySelector('.cartbar__label');
    if (labelEl) labelEl.textContent = n ? 'Keranjang' : 'Keranjang Kosong';

    document.getElementById('cartBarCount').style.display = n ? 'flex' : 'none';
    document.getElementById('cartBarTotal').style.display = n ? 'block' : 'none';
};

export const CartBar = {
    mount() {
        document.getElementById('cartBar').addEventListener('click', () => { Events.emit('cart:open'); });
        Events.on('cart:updated', () => render());
    },
    render
};
