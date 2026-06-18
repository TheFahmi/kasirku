import { Events } from '../core/events.js';
import { AppState } from './AppState.js';
import { esc } from '../utils/format.js';
import { openModal, closeModal } from '../utils/modal.js';

function renderHistoryList() {
    const listEl = document.getElementById('opnameHistoryList');
    const history = AppState.state.opnameHistory || [];

    if (history.length === 0) {
        listEl.innerHTML = '<div style="padding:32px;text-align:center;color:var(--muted)">Belum ada riwayat opname.</div>';
        return;
    }

    listEl.innerHTML = history.map(rec => {
        const d = new Date(rec.timestamp);
        const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        let totalMinus = 0;
        let totalPlus = 0;
        
        const itemsHtml = rec.items.map(item => {
            if (item.diff > 0) totalPlus += item.diff;
            if (item.diff < 0) totalMinus += Math.abs(item.diff);
            
            const badge = item.diff > 0 
                ? `<span style="color:var(--success);font-weight:700">▲ +${item.diff}</span>` 
                : `<span style="color:var(--danger);font-weight:700">▼ ${item.diff}</span>`;
                
            return `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;font-size:13px">
                <div style="color:var(--ink);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-right:8px">${esc(item.productName)}</div>
                <div style="color:var(--muted);font-size:12px;width:70px;text-align:right">${item.oldStock} → ${item.newStock}</div>
                <div style="width:40px;text-align:right">${badge}</div>
            </div>`;
        }).join('');

        return `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:12px;box-shadow:0 1px 3px rgba(0,0,0,0.02)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px dashed var(--border);padding-bottom:8px">
                <div style="font-weight:700;font-size:14px">${dateStr}</div>
                <div style="font-size:12px;font-weight:600;color:var(--muted)">${rec.items.length} item</div>
            </div>
            <div>
                ${itemsHtml}
            </div>
            <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:12px;padding-top:8px;border-top:1px dashed var(--border);font-size:12px;font-weight:600">
                ${totalPlus > 0 ? `<span style="color:var(--success)">Total Surplus: +${totalPlus}</span>` : ''}
                ${totalMinus > 0 ? `<span style="color:var(--danger)">Total Susut: -${totalMinus}</span>` : ''}
            </div>
        </div>
        `;
    }).join('');
}

export const OpnameHistorySheet = {
    mount() {
        Events.on('opnameHistory:open', () => {
            openModal('opnameHistorySheet');
            renderHistoryList();
        });

        Events.on('opnameHistory:updated', renderHistoryList);
    }
};
