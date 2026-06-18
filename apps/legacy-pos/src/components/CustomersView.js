import { Events } from '../core/events.js';
import { AppState } from './AppState.js';
import { esc, formatRupiah, uid } from '../utils/format.js';
import { tile, emptyState } from '../utils/swatch.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { UX } from '../utils/ux.js';
import { openModal, closeModal } from '../utils/modal.js';

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
                ${(AppState.state.bizMode === 'service' && c.quota > 0) ? `<div style="text-align:right;margin-left:auto">
                    <div style="font-size:11px;color:var(--primary);font-weight:800;letter-spacing:1px;text-transform:uppercase">Sisa Kuota</div>
                    <div style="font-size:15px;font-weight:800;color:var(--ink)">${c.quota} Kg</div>
                </div>` : ''}
            </div>`;
        }).join('');
    }
    
    html += `<div style="position:fixed;bottom:calc(var(--nav-h) + 16px);left:16px;right:16px;z-index:90;max-width:800px;margin:0 auto">
        <button class="btn btn--primary btn--block btn--lg" id="addCustomerBtn" style="box-shadow:0 4px 12px rgba(0,0,0,0.2)">+ Tambah Pelanggan</button>
    </div>`;
    
    list.innerHTML = html;
}

function openCustomerModal(id) {
    const c = id ? AppState.state.customers.find(x => x.id === id) : null;
    document.getElementById('customerModalTitle').textContent = c ? 'Edit Pelanggan' : 'Tambah Pelanggan';
    document.getElementById('customerId').value = c ? c.id : '';
    document.getElementById('customerName').value = c ? c.name : '';
    document.getElementById('customerPhone').value = c ? c.phone : '';
    
    const quotaField = document.getElementById('customerQuotaField');
    if (quotaField) quotaField.style.display = AppState.state.bizMode === 'service' ? 'flex' : 'none';
    document.getElementById('customerQuota').value = c && c.quota ? c.quota : '';

    document.getElementById('deleteCustomerBtn').hidden = !c;
    openModal('customerModal');
}

export const CustomersView = {
    mount() {
        document.getElementById('searchCustomer').addEventListener('input', render);
        Events.on('view:change', e => {
            if (e.view === 'customers') render();
        });
        
        document.getElementById('customerForm').addEventListener('submit', e => {
            const id = document.getElementById('customerId').value;
            const name = document.getElementById('customerName').value.trim();
            const phone = document.getElementById('customerPhone').value.trim();
            const quotaStr = document.getElementById('customerQuota').value;
            const quota = quotaStr ? parseFloat(quotaStr) : 0;
            if (!name) return;
            
            if (id) {
                const c = AppState.state.customers.find(x => x.id === id);
                if (c) {
                    c.name = name;
                    c.phone = phone;
                    c.quota = quota;
                }
            } else {
                AppState.state.customers.push({ id: uid(), name, phone, quota, createdAt: Date.now() });
            }
            AppState.persist();
            Events.emit('customers:updated');
            closeModal('customerModal');
            render();
            UX.toast('Pelanggan disimpan');
        });
        
        document.getElementById('deleteCustomerBtn').addEventListener('click', () => {
            const id = document.getElementById('customerId').value;
            ConfirmDialog.show('Hapus pelanggan ini?', 'Hapus').then(ok => {
                if (!ok) return;
                AppState.state.customers = AppState.state.customers.filter(x => x.id !== id);
                AppState.persist();
                closeModal('customerModal');
                render();
            });
        });
        
        document.getElementById('customersList').addEventListener('click', e => {
            if (e.target.closest('#addCustomerBtn')) {
                openCustomerModal();
                return;
            }
            
            const card = e.target.closest('[data-cid]');
            if (!card) return;
            const cid = card.dataset.cid;
            const c = AppState.state.customers.find(x => x.id === cid);
            if (!c) return;
            
            const unpaid = AppState.state.transactions.filter(t => t.customerId === cid && t.isDebt);
            if (!unpaid.length) {
                // Edit profile if no debt
                openCustomerModal(cid);
                return;
            }
            
            const total = unpaid.reduce((s, t) => s + t.total, 0);
            ConfirmDialog.show(`Tagihan kasbon ${c.name} sejumlah ${formatRupiah(total)}\nApakah Anda ingin melunasinya atau edit profil pelanggan?`, 'Lunasi Kasbon').then(ok => {
                if (!ok) {
                    // if cancel, open edit
                    openCustomerModal(cid);
                    return;
                }
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
