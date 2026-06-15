'use strict';
const App = (() => {
    function init() {
        console.log('KasirKu Initialization Started');
        
        Modal.initDataCloseButtons();
        Modal.initSwipeToClose();
        Topbar.initTheme();
        
        [
            Auth, Topbar, CategoryChips, ProductGrid, CartBar, CartSheet,
            ConfirmDialog, VariantModal, PaymentModal, ReceiptModal, ProductModal,
            SettingsSheet, StoreModal, PayMethodsModal, ProductsSheet,
            HistoryView, ReportsView, Router
        ].forEach(m => {
            if (m && m.mount) m.mount();
        });

        document.getElementById('searchInput').value = '';
        CategoryChips.render();
        ProductGrid.render();
        CartBar.render();

        Auth.routeAuth();
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(let registration of registrations) {
                    registration.unregister();
                }
            });
        }
    }

    return { init };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
} else {
    App.init();
}
