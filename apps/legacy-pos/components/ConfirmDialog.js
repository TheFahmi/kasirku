'use strict';
const ConfirmDialog = (() => {
    let _resolve = null;
    return {
        mount() {
            document.getElementById('confirmOkBtn').addEventListener('click', () => {
                Modal.closeModal('confirmDialog');
                if (_resolve) { _resolve(true); _resolve = null; }
            });
            document.getElementById('confirmCancelBtn').addEventListener('click', () => {
                Modal.closeModal('confirmDialog');
                if (_resolve) { _resolve(false); _resolve = null; }
            });
            document.getElementById('confirmScrim').addEventListener('click', () => {
                Modal.closeModal('confirmDialog');
                if (_resolve) { _resolve(false); _resolve = null; }
            });
        },
        show(msg, okLabel = 'Lanjutkan', danger = true) {
            return new Promise(resolve => {
                _resolve = resolve;
                document.getElementById('confirmMsg').textContent = msg;
                document.getElementById('confirmOkBtn').textContent = okLabel;
                document.getElementById('confirmOkBtn').className = `btn ${danger ? 'btn--danger' : 'btn--primary'}`;
                Modal.openModal('confirmDialog');
            });
        }
    };
})();

