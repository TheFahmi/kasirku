import { Events } from '../core/events.js';
import { AppState } from './AppState.js';
import { esc, formatRupiah, uid } from '../utils/format.js';
import { tile, emptyState } from '../utils/swatch.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { UX } from '../utils/ux.js';

function render() {
    const list = document.getElementById('customersList');
    const q = (document.getElementById('searchCustomer').value || '').toLowerCase();
    
    let items = AppState.state.customers;
    if (q) items = items.filter(c => c.name.toLowerCase().includes(q) || (c.phone && c.phone.includes(q)));
    
    // Hitung total hutang
    const txs = AppState.state.transactions.filter(t => t.isDebt);
    
    let html = '';
    
    if (!items.length) {
        html = emptyState('Tidak ada pelanggan', q ? 'Coba ubah kata kunci' : 'Belum ada pelanggan terdaftar');
    } else {
        html = items.map(c => {
            const debtTotal = txs.filter(t => t.customerId === c.id).reduce((s, t) => s + t.total, 0);
            return `<div class="citem" style="cursor:pointer; padding: 16px; border-radius: 12px; margin-bottom: 12px; border: 1px solid var(--border); box-shadow: 0 2px 4px rgba(0,0,0,0.02); background: var(--surface)" data-cid="${c.id}">
                ${tile(c.name, c.name)}
                <div class="citem__info">
                    <div class="citem__name" style="font-size:16px;font-weight:700">${esc(c.name)}</div>
                    <div class="citem__price" style="font-size:13px;color:var(--muted)">${c.phone ? esc(c.phone) : '-'}</div>
                </div>
                ${debtTotal > 0 ? `<div style="text-align:right">
                    <div style="font-size:11px;color:var(--danger);font-weight:800;letter-spacing:1px;text-transform:uppercase">Belum Lunas</div>
                    <div style="font-size:15px;font-weight:800;color:var(--ink)">${formatRupiah(debtTotal)}</div>
                </div>` : ''}
            </div>`;
        }).join('');
    }
    
    html += `<button class="btn btn--primary btn--lg" style="position:fixed;bottom:90px;right:20px;border-radius:50%;width:56px;height:56px;box-shadow:0 4px 12px rgba(0,0,0,0.15);padding:0;z-index:100;font-size:32px;display:flex;align-items:center;justify-content:center" id="addCustomerFab">+</button>`;
    
    list.innerHTML = html;
}

function promptAddCustomer() {
    const name = prompt('Nama Pelanggan Baru:');
    if (!name || !name.trim()) return;
    const phone = prompt('Nomor Telepon (opsional):') || '';
    const id = uid();
    AppState.state.customers.push({ id, name: name.trim(), phone: phone.trim(), createdAt: Date.now() });
    AppState.persist();
    UX.toast('Pelanggan ditambahkan');
    render();
}

export const CustomersView = {
    mount() {
        document.getElementById('searchCustomer').addEventListener('input', render);
        Events.on('view:change', e => {
            if (e.view === 'customers') render();
        });
        
        document.getElementById('customersList').addEventListener('click', e => {
            const fab = e.target.closest('#addCustomerFab');
            if (fab) {
                promptAddCustomer();
                return;
            }
            
            const card = e.target.closest('[data-cid]');
            if (!card) return;
            const cid = card.dataset.cid;
            const c = AppState.state.customers.find(x => x.id === cid);
            if (!c) return;
            
            const unpaid = AppState.state.transactions.filter(t => t.customerId === cid && t.isDebt);
            if (!unpaid.length) {
                UX.toast('Tidak ada tagihan tertunggak untuk ' + c.name);
                return;
            }
            
            const total = unpaid.reduce((s, t) => s + t.total, 0);
            ConfirmDialog.show(`Lunasi semua tagihan kasbon ${c.name} sejumlah ${formatRupiah(total)}?`, 'Lunasi').then(ok => {
                if (!ok) return;
                unpaid.forEach(t => {
                    t.isDebt = false;
                    t.debtPaidAt = Date.now();
                });
                AppState.persist();
                UX.toast('Kasbon berhasil dilunasi');
                render();
            });
        });
    }
};
