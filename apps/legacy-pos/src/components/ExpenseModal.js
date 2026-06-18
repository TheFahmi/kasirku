import { AppState } from './AppState.js';
import { Events } from '../core/events.js';
import { uid } from '../utils/format.js';
import { openModal, closeModal } from '../utils/modal.js';
import { UX } from '../utils/ux.js';

export const ExpenseModal = {
    mount() {
        const form = document.getElementById('expenseForm');
        if (!form) return;

        form.addEventListener('submit', e => {
            e.preventDefault();
            
            const activeShift = AppState.getActiveShift();
            const shiftId = activeShift ? activeShift.id : null;
            
            const amount = parseInt(document.getElementById('expenseAmount').value) || 0;
            const category = document.getElementById('expenseCategory').value;
            const note = document.getElementById('expenseNote').value;
            
            if (amount <= 0) return UX.toast('Nominal tidak valid');

            AppState.state.expenses.unshift({
                id: uid(),
                date: new Date().toISOString(),
                amount,
                category,
                note,
                shiftId
            });
            
            AppState.persist();
            
            UX.toast('Pengeluaran berhasil dicatat');
            closeModal('expenseModal');
            Events.emit('expense:updated');
            
            // Reset form
            form.reset();
        });
    }
};
