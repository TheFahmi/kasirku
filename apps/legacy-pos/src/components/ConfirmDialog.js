import { openModal, closeModal } from '../utils/modal.js';

let _resolve = null;

export const ConfirmDialog = {
    mount() {
        document.getElementById('confirmOkBtn').addEventListener('click', () => {
            closeModal('confirmDialog');
            if (_resolve) { _resolve(true); _resolve = null; }
        });
        document.getElementById('confirmCancelBtn').addEventListener('click', () => {
            closeModal('confirmDialog');
            if (_resolve) { _resolve(false); _resolve = null; }
        });
        document.getElementById('confirmScrim').addEventListener('click', () => {
            closeModal('confirmDialog');
            if (_resolve) { _resolve(false); _resolve = null; }
        });
    },
    show(msg, okLabel = 'Lanjutkan', danger = true) {
        return new Promise(resolve => {
            _resolve = resolve;
            document.getElementById('confirmMsg').textContent = msg;
            document.getElementById('confirmOkBtn').textContent = okLabel;
            document.getElementById('confirmOkBtn').className = `btn ${danger ? 'btn--danger' : 'btn--primary'}`;
            openModal('confirmDialog');
        });
    }
};
