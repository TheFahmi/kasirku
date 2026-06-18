import { Events } from '../core/events.js';
import { Storage } from '../core/storage.js';
import { AppState } from './AppState.js';
import { esc, formatRupiah, uid } from '../utils/format.js';
import { openModal, closeModal } from '../utils/modal.js';
import { UX } from '../utils/ux.js';
import { Auth } from './Auth.js';

const BUILTIN_METHODS = [
    { id: 'cash',  label: 'Tunai',       type: 'cash',    builtin: true },
    { id: 'qris',  label: 'QRIS',        type: 'noncash', builtin: true },
    { id: 'debit', label: 'Kartu Debit', type: 'noncash', builtin: true },
    { id: 'debt',  label: 'Kasbon / Piutang', type: 'debt', builtin: true },
    { id: 'pending', label: 'Belum Lunas (Bayar Nanti)', type: 'debt', builtin: true },
];
let customMethods = Storage.load(Storage.KEY.methods, []);
const getPayMethods = () => [...BUILTIN_METHODS, ...customMethods];
const getPayLabel   = id => (getPayMethods().find(x => x.id === id) || {}).label || (id || 'Tunai');
const getPayType    = id => (getPayMethods().find(x => x.id === id) || {}).type  || 'noncash';

function methodIcon(m) {
    if (m.id === 'cash')  return `<svg class="ico ico--sm" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>`;
    if (m.id === 'qris')  return `<svg class="ico ico--sm" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M21 21v-3"/></svg>`;
    if (m.id === 'debit') return `<svg class="ico ico--sm" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>`;
    if (m.id === 'debt')  return `<svg class="ico ico--sm" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>`;
    if (m.type === 'cash') return `<svg class="ico ico--sm" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>`;
    return `<svg class="ico ico--sm" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>`;
}

function quickCash(total) {
    const set = new Set([total]);
    [5000, 10000, 50000, 100000].forEach(s => set.add(Math.ceil(total / s) * s));
    [10000, 20000, 50000, 100000].forEach(d => { if (d > total) set.add(d); });
    return Array.from(set).filter(v => v >= total).sort((a, b) => a - b).slice(0, 6);
}

let _payMethod = 'cash';
const getCurrentPayMethod = () => _payMethod;

function setPayMethod(m) {
    _payMethod = m;
    document.querySelectorAll('.paymethod').forEach(b =>
        b.classList.toggle('paymethod--active', b.dataset.method === m)
    );
    const isCash = getPayType(m) === 'cash';
    document.getElementById('cashSection').hidden    = !isCash;
    document.getElementById('nonCashSection').hidden = isCash;
    if (isCash) {
        updateChange();
        if (!document.getElementById('paymentModal').hidden)
            document.getElementById('cashInput').focus();
    } else {
        document.getElementById('nonCashLabel').textContent  = 'Bayar via ' + getPayLabel(m);
        document.getElementById('nonCashAmount').textContent = formatRupiah(AppState.cartTotal());
        document.getElementById('completePaymentBtn').disabled = false;
    }
}

function updateChange() {
    const cash = parseFloat(document.getElementById('cashInput').value) || 0;
    const c    = cash - AppState.cartTotal();
    document.getElementById('paymentChange').textContent        = formatRupiah(Math.max(0, c));
    document.getElementById('completePaymentBtn').disabled      = c < 0;
}

function openPayment() {
    const t = AppState.cartTotal();
    document.getElementById('paymentTotal').textContent = formatRupiah(t);
    document.getElementById('paymentCustomer').innerHTML = '<option value="">-- Pelanggan Umum --</option>' + 
        AppState.state.customers.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    document.getElementById('cashInput').value          = '';
    document.getElementById('paymentChange').textContent = formatRupiah(0);
    document.getElementById('quickCash').innerHTML = quickCash(t)
        .map(v => `<button data-cash="${v}">${v === t ? 'Uang pas' : formatRupiah(v)}</button>`).join('');
    document.getElementById('payMethods').innerHTML = getPayMethods()
        .map(m => `<button type="button" class="paymethod" data-method="${m.id}">${methodIcon(m)}<span>${esc(m.label)}</span></button>`).join('');
    setPayMethod('cash');
    closeModal('cartSheet');
    openModal('paymentModal');
    setTimeout(() => document.getElementById('cashInput').focus(), 180);
}

function showOrderConfirm() {
    const total  = AppState.cartTotal();
    const isCash = getPayType(_payMethod) === 'cash';
    const customerId = document.getElementById('paymentCustomer').value;
    
    if (_payMethod === 'debt' && !customerId) {
        return UX.toast('Pilih pelanggan untuk opsi Kasbon');
    }
    
    if (isCash) {
        const cash = parseFloat(document.getElementById('cashInput').value) || 0;
        if (cash < total) return UX.toast('Uang tidak cukup');
    }
    const rows = AppState.state.cart.map(i =>
        `<div class="ritem"><div class="ritem__name">${esc(i.name)}</div>
         <div class="ritem__qty">${i.qty} × ${formatRupiah(i.price)}</div>
         <div class="ritem__sub">${formatRupiah(i.price * i.qty)}</div></div>`
    ).join('');
    const cash = parseFloat(document.getElementById('cashInput').value) || 0;
    document.getElementById('orderConfirmContent').innerHTML = `
        <div class="rule" style="margin-top:0"></div>${rows}<div class="rule"></div>
        ${AppState.getNominalDiscount() ? `<div class="rline"><span>Diskon</span><span>-${formatRupiah(AppState.getNominalDiscount())}</span></div>` : ''}
        <div class="rline rline--total"><span>TOTAL</span><span>${formatRupiah(total)}</span></div>
        <div class="rule"></div>
        <div class="rline"><span>Metode</span><span>${getPayLabel(_payMethod)}</span></div>
        ${isCash ? `<div class="rline"><span>Uang Diterima</span><span>${formatRupiah(cash)}</span></div>
        <div class="rline"><span>Kembalian</span><span style="color:var(--success);font-weight:700">${formatRupiah(cash - total)}</span></div>` : ''}
        ${document.getElementById('orderNote').value.trim() ? `<div class="rule"></div><div class="rline"><span>Catatan</span><span style="color:var(--accent-ink)">${esc(document.getElementById('orderNote').value.trim())}</span></div>` : ''}`;
    openModal('orderConfirmModal');
}

function completeTx() {
    const total = AppState.cartTotal();
    let cash, change;
    if (getPayType(_payMethod) === 'cash') {
        cash   = parseFloat(document.getElementById('cashInput').value) || 0;
        if (cash < total) return UX.toast('Uang tidak cukup');
        change = cash - total;
    } else if (_payMethod === 'debt' || _payMethod === 'pending') {
        cash = 0; change = 0;
    } else {
        cash = total; change = 0;
    }
    const cashier = (Auth.getAccount() || {}).user || 'Kasir';
    const note    = (document.getElementById('orderNote').value || '').trim();
    
    const customerId = document.getElementById('paymentCustomer').value || null;
    const isDebt     = _payMethod === 'debt';
    const activeShift= AppState.getActiveShift();
    const shiftId    = activeShift ? activeShift.id : null;

    const custName = document.getElementById('payCustomerName').value.trim();
    const prioEl = document.getElementById('payPrioritySelect');
    const priority = prioEl ? prioEl.value : 'normal';
    
    let wa = '', delivery = '', dueDate = '';
    if (AppState.state.bizMode === 'service') {
        const waEl = document.getElementById('payCustomerWa');
        const delEl = document.getElementById('payDeliveryType');
        const dueEl = document.getElementById('payDueDate');
        if (waEl) wa = waEl.value.trim();
        if (delEl) delivery = delEl.value;
        if (dueEl) dueDate = dueEl.value;
    }

    const tx = {
        id: uid(), no: AppState.nextTxNo(), date: new Date().toISOString(), cashier, note,
        customerId, isDebt, shiftId,
        customerName: custName, priority, wa, delivery, dueDate, bizMode: AppState.state.bizMode,
        items:    AppState.state.cart.map(i => ({ ...i })),
        subtotal: AppState.cartSubtotal(),
        discount: AppState.getNominalDiscount(),
        total, cash, change,
        method: _payMethod,
    };
    AppState.state.cart.forEach(i => {
        const p = AppState.state.products.find(x => x.id === i.id);
        if (p) p.stock = Math.max(0, p.stock - i.qty);
    });

    // Add to Queue if not Retail
    if (AppState.state.bizMode !== 'retail') {
        AppState.state.orders.push({
            id: tx.id,
            no: tx.no,
            timestamp: new Date().getTime(),
            customerName: tx.customerName,
            wa: tx.wa,
            delivery: tx.delivery,
            dueDate: tx.dueDate,
            priority: tx.priority,
            status: AppState.state.bizMode === 'service' ? 'BARU' : 'DAPUR',
            items: tx.items.map(i => ({ name: i.name, qty: i.qty })),
            total: tx.total,
            method: tx.method,
            isPaid: _payMethod !== 'debt' && _payMethod !== 'pending'
        });
        Events.emit('orders:updated');
    }

    AppState.state.transactions.unshift(tx);
    AppState.persist();
    Events.emit('receipt:show', tx);
    AppState.state.cart     = [];
    AppState.state.discount = { type: 'Rp', value: 0 };
    document.getElementById('discountInput').value = 0;
    document.getElementById('discountType').value  = 'Rp';
    document.getElementById('orderNote').value      = '';
    document.getElementById('payCustomerName').value = '';
    const prioSel = document.getElementById('payPrioritySelect');
    if (prioSel) prioSel.value = 'normal';
    Events.emit('products:updated');
    Events.emit('cart:updated');
    Events.emit('history:updated');
    Events.emit('reports:updated');
    closeModal('orderConfirmModal');
    closeModal('paymentModal');
    UX.haptic(50); UX.playSound('success'); UX.fireConfetti();
}

export { customMethods };
export { BUILTIN_METHODS };

export const PaymentModal = {
    mount() {
        Events.on('payment:open', openPayment);
        document.getElementById('payMethods').addEventListener('click', e => {
            const btn = e.target.closest('[data-method]');
            if (btn) {
                const method = btn.dataset.method;
                const customerId = document.getElementById('paymentCustomer').value;
                if (method === 'debt' && !customerId) {
                    UX.toast('Pilih pelanggan terlebih dahulu untuk kasbon');
                    const sel = document.getElementById('paymentCustomer');
                    sel.style.boxShadow = '0 0 0 2px var(--danger)';
                    setTimeout(() => sel.style.boxShadow = '', 1500);
                    return;
                }
                setPayMethod(method);
            }
        });
        document.getElementById('paymentCustomer').addEventListener('change', e => {
            if (!e.target.value && getCurrentPayMethod() === 'debt') {
                setPayMethod('cash');
                UX.toast('Metode dikembalikan ke Tunai');
            }
        });
        document.getElementById('cashInput').addEventListener('input', updateChange);
        document.getElementById('quickCash').addEventListener('click', e => {
            const btn = e.target.closest('[data-cash]');
            if (!btn) return;
            document.getElementById('cashInput').value = btn.dataset.cash;
            updateChange();
        });
        document.getElementById('completePaymentBtn').addEventListener('click', showOrderConfirm);
        document.getElementById('confirmOrderBtn').addEventListener('click', completeTx);
    },
    BUILTIN_METHODS, getPayMethods, getPayLabel, getPayType, getCurrentPayMethod, customMethods
};
