const KEY = {
    products: 'kasirku.products.v2',
    tx:       'kasirku.tx.v2',
    auth:     'kasirku.auth.v1',
    session:  'kasirku.session.v1',
    store:    'kasirku.store.v1',
    methods:  'kasirku.methods.v1',
    cart:     'kasirku.cart.v1',
    discount: 'kasirku.discount.v1',
    daily:    'kasirku.daily.v1',
    theme:    'kasirku.theme',
    opname:   'kasirku.opname.v1',
};
const load = (key, fallback) => {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }
    catch { return fallback; }
};
const save = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.warn('Storage error:', e); }
};
const remove = (key) => { try { localStorage.removeItem(key); } catch { } };
export const Storage = { KEY, load, save, remove };
