import './style.css';
import { Events } from './core/events.js';
import { Storage } from './core/storage.js';
import { Router } from './core/router.js';
import { Modal } from './utils/modal.js';
import { UX } from './utils/ux.js';
import { Scanner } from './utils/scanner.js';
import { AppState } from './components/AppState.js';
import { Auth, setAppStateRef } from './components/Auth.js';
import { Topbar } from './components/Topbar.js';
import { CategoryChips } from './components/CategoryChips.js';
import { ProductGrid, setCartSheetRef } from './components/ProductGrid.js';
import { CartBar } from './components/CartBar.js';
import { CartSheet, setProductGridRef } from './components/CartSheet.js';
import { ConfirmDialog } from './components/ConfirmDialog.js';
import { VariantModal } from './components/VariantModal.js';
import { PaymentModal } from './components/PaymentModal.js';
import { ReceiptModal, setPaymentModalRef as receiptSetPM, setRouterRef } from './components/ReceiptModal.js';
import { ProductModal } from './components/ProductModal.js';
import { SettingsSheet, setPaymentModalRef as settingsSetPM } from './components/SettingsSheet.js';
import { StoreModal } from './components/StoreModal.js';
import { PayMethodsModal } from './components/PayMethodsModal.js';
import { ProductsSheet } from './components/ProductsSheet.js';
import { StockOpnameSheet } from './components/StockOpnameSheet.js';
import { HistoryView } from './components/HistoryView.js';
import { ReportsView } from './components/ReportsView.js';

// Wire up lazy refs to break circular dependencies
setAppStateRef(AppState);
setCartSheetRef(CartSheet);
setProductGridRef(ProductGrid);
receiptSetPM(PaymentModal);
setRouterRef(Router);
settingsSetPM(PaymentModal);

// Subscribe toast event
Events.on('toast', ({ msg }) => UX.toast(msg));

function init() {
    console.log('KasirKu v2 (Vite + ES Modules)');

    Modal.initDataCloseButtons();
    Modal.initSwipeToClose();
    Topbar.initTheme();
    Scanner.init();

    [
        Auth, Topbar, CategoryChips, ProductGrid, CartBar, CartSheet,
        ConfirmDialog, VariantModal, PaymentModal, ReceiptModal, ProductModal,
        SettingsSheet, StoreModal, PayMethodsModal, ProductsSheet, StockOpnameSheet,
        HistoryView, ReportsView, Router
    ].forEach(m => { if (m && m.mount) m.mount(); });

    document.getElementById('searchInput').value = '';
    CategoryChips.render();
    ProductGrid.render();
    CartBar.render();

    Auth.routeAuth();

    // Hide splash screen after a short delay
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.style.opacity = '0';
            splash.style.visibility = 'hidden';
            setTimeout(() => splash.remove(), 400);
        }
    }, 800);

    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(reg => {
                console.log('SW registered: ', reg.scope);
            }).catch(err => {
                console.log('SW registration failed: ', err);
            });
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
