import { Storage } from '../core/storage.js';
import { Events } from '../core/events.js';
import { uid, formatRupiah } from '../utils/format.js';

const SEED_PRODUCTS = [
    { name: 'Nasi Goreng', price: 15000, category: 'Makanan', stock: 50 },
    { name: 'Mie Ayam', price: 13000, category: 'Makanan', stock: 40 },
    { name: 'Ayam Geprek', price: 18000, category: 'Makanan', stock: 30 },
    { name: 'Roti Bakar', price: 12000, category: 'Makanan', stock: 25 },
    { name: 'Es Teh Manis', price: 5000, category: 'Minuman', stock: 100 },
    { name: 'Es Jeruk', price: 7000, category: 'Minuman', stock: 80 },
    { name: 'Kopi Susu', price: 12000, category: 'Minuman', stock: 60 },
    { name: 'Air Mineral', price: 4000, category: 'Minuman', stock: 120 },
    { name: 'Keripik Kentang', price: 10000, category: 'Snack', stock: 45 },
    { name: 'Coklat Batang', price: 9000, category: 'Snack', stock: 35 },
    { name: 'Biskuit', price: 8000, category: 'Snack', stock: 50 },
    { name: 'Permen', price: 2000, category: 'Snack', stock: 200 },
];

export const freshSeed = () => SEED_PRODUCTS.map(p => ({ id: uid(), ...p }));

function loadProducts() {
    const s = Storage.load(Storage.KEY.products, null);
    if (Array.isArray(s) && s.length) return s;
    const seed = freshSeed();
    Storage.save(Storage.KEY.products, seed);
    return seed;
}

let _sd = Storage.load(Storage.KEY.discount, { type: 'Rp', value: 0 });
if (typeof _sd === 'number') _sd = { type: 'Rp', value: _sd };
const _si = Storage.load(Storage.KEY.store, {}) || {};

export const state = {
    products: loadProducts(),
    transactions: Storage.load(Storage.KEY.tx, []),
    cart: Storage.load(Storage.KEY.cart, []),
    opnameHistory: Storage.load(Storage.KEY.opname, []),
    customers: Storage.load(Storage.KEY.customers, []),
    shifts: Storage.load(Storage.KEY.shifts, []),
    expenses: Storage.load(Storage.KEY.expenses, []),
    orders: Storage.load(Storage.KEY.orders, []),
    bizMode: Storage.load(Storage.KEY.bizmode, 'retail'),
    category: 'Semua',
    search: '',
    discount: _sd,
};

export const storeInfo = {
    name: _si.name || 'KasirKu',
    address: _si.address || '',
    phone: _si.phone || '',
    footer: _si.footer || '',
};

let _daily = Storage.load(Storage.KEY.daily, { date: '', seq: 0 });

export function nextTxNo() {
    const n = new Date();
    const yy = String(n.getFullYear()).slice(2);
    const mm = String(n.getMonth() + 1).padStart(2, '0');
    const dd = String(n.getDate()).padStart(2, '0');
    const today = `${yy}${mm}${dd}`;
    if (_daily.date !== today) _daily = { date: today, seq: 0 };
    _daily.seq++;
    Storage.save(Storage.KEY.daily, _daily);
    return `${today}-${String(_daily.seq).padStart(3, '0')}`;
}

export const persist = () => {
    Storage.save(Storage.KEY.products, state.products);
    Storage.save(Storage.KEY.tx, state.transactions);
    Storage.save(Storage.KEY.cart, state.cart);
    Storage.save(Storage.KEY.discount, state.discount);
    Storage.save(Storage.KEY.opname, state.opnameHistory);
    Storage.save(Storage.KEY.customers, state.customers);
    Storage.save(Storage.KEY.shifts, state.shifts);
    Storage.save(Storage.KEY.expenses, state.expenses);
    Storage.save(Storage.KEY.orders, state.orders);
    Storage.save(Storage.KEY.bizmode, state.bizMode);
};

export const persistStore = () => Storage.save(Storage.KEY.store, storeInfo);
export const cartSubtotal = () => state.cart.reduce((s, i) => s + i.price * i.qty, 0);
export const getNominalDiscount = () => {
    const v = state.discount.value || 0;
    return state.discount.type === '%' ? Math.floor(cartSubtotal() * (v / 100)) : v;
};
export const cartTotal = () => Math.max(0, cartSubtotal() - getNominalDiscount());
export const cartCount = () => state.cart.reduce((s, i) => s + i.qty, 0);
export const cartQty = id => (state.cart.find(x => x.id === id) || {}).qty || 0;
export const getActiveShift = () => state.shifts.find(s => !s.endTime) || null;

export const AppState = {
    state, storeInfo, freshSeed, nextTxNo, persist, persistStore,
    cartSubtotal, getNominalDiscount, cartTotal, cartCount, cartQty, getActiveShift
};
