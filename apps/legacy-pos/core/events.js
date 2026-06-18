// core/events.js
// EventBus — komunikasi antar komponen tanpa coupling

'use strict';

const Events = (() => {
    const listeners = {};

    return {
        on(event, fn) {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(fn);
        },
        off(event, fn) {
            if (!listeners[event]) return;
            listeners[event] = listeners[event].filter(f => f !== fn);
        },
        emit(event, data) {
            (listeners[event] || []).forEach(fn => fn(data));
        },
    };
})();

// Daftar event:
// 'cart:updated'        → keranjang berubah
// 'cart:open'           → buka sheet cart
// 'products:updated'    → CRUD produk
// 'products:filter'     → filter kategori/search
// 'products:manage'     → buka kelola produk
// 'productsSheet:open'  → buka sheet produk
// 'productsSheet:refresh'
// 'product:add'         → buka form tambah
// 'product:edit'  id    → buka form edit
// 'variant:pick'  p     → buka picker varian
// 'payment:open'        → buka modal bayar
// 'receipt:show'  tx    → tampilkan struk
// 'store:open'          → buka modal info toko
// 'payMethods:open'     → buka modal metode bayar
// 'view:change'   {view}→ tab berpindah
// 'auth:enter'          → user login
// 'auth:exit'           → user logout
// 'theme:change'  {dark}→ tema berubah
// 'toast'         {msg} → tampilkan toast
