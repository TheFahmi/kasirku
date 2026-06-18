import { AppState } from './AppState.js';
import { Events } from '../core/events.js';

function applyMode() {
    const mode = AppState.state.bizMode || 'retail';
    
    // Update Settings Dropdown
    const select = document.getElementById('bizModeSelect');
    if (select) select.value = mode;

    // Tab Queue visibility & text
    const queueTab = document.querySelector('.tab[data-view="queue"]');
    if (queueTab) {
        if (mode === 'retail') {
            queueTab.style.display = 'none';
        } else {
            queueTab.style.display = 'flex';
            const span = queueTab.querySelector('span');
            if (span) span.textContent = mode === 'fb' ? 'Dapur' : 'Antrean';
        }
    }

    // Topbar Queue Title
    const queueTitle = document.querySelector('#view-queue .topbar__title');
    if (queueTitle) {
        queueTitle.textContent = mode === 'fb' ? 'Antrean Dapur' : 'Antrean Proses';
    }

    const custLabel = document.getElementById('payCustomerLabel');
    const custInput = document.getElementById('payCustomerName');
    const extraDiv  = document.getElementById('paymentOptionsExtra');
    const prioField = document.getElementById('priorityField');
    const lndryDiv  = document.getElementById('laundryFields');
    
    if (extraDiv) {
        if (mode === 'retail') {
            extraDiv.style.display = 'none';
        } else {
            extraDiv.style.display = 'block';
            if (mode === 'fb') {
                custLabel.textContent = 'Nomor Meja / Nama Pemesan';
                custInput.placeholder = 'Contoh: Meja 4 / Budi (Bungkus)';
                prioField.style.display = 'none'; // F&B usually doesn't need priority unless requested, but we'll hide by default
                if (lndryDiv) lndryDiv.style.display = 'none';
            } else if (mode === 'service') {
                custLabel.textContent = 'Nama Pelanggan';
                custInput.placeholder = 'Contoh: Budi Santoso';
                prioField.style.display = 'flex'; // Laundry needs priority
                if (lndryDiv) lndryDiv.style.display = 'block';
            }
        }
    }
}

export const BizMode = {
    mount() {
        applyMode();

        const select = document.getElementById('bizModeSelect');
        if (select) {
            select.addEventListener('change', e => {
                AppState.state.bizMode = e.target.value;
                AppState.persist();
                applyMode();
                Events.emit('bizmode:changed', { mode: e.target.value });
            });
        }
    }
};
