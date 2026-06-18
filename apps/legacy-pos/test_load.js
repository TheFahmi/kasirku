const fs = require('fs');
const vm = require('vm');
const path = require('path');

const files = [
    'utils/format.js',
    'utils/swatch.js',
    'utils/modal.js',
    'utils/ux.js',
    'core/storage.js',
    'core/events.js',
    'core/state.js',
    'core/router.js',
    'components/Auth.js',
    'components/Topbar.js',
    'components/CategoryChips.js',
    'components/ProductGrid.js',
    'components/ConfirmDialog.js',
    'components/CartBar.js',
    'components/CartSheet.js',
    'components/VariantModal.js',
    'components/PaymentModal.js',
    'components/ReceiptModal.js',
    'components/ProductModal.js',
    'components/SettingsSheet.js',
    'components/StoreModal.js',
    'components/PayMethodsModal.js',
    'components/ProductsSheet.js',
    'components/HistoryView.js',
    'components/ReportsView.js',
    'app.js'
];

const context = {
    document: { 
        getElementById: () => ({ addEventListener: () => {}, reset: () => {}, cloneNode: () => ({ addEventListener: () => {}, parentNode: { replaceChild: () => {} } }), style: {}, classList: { add: () => {}, remove: () => {} } }),
        querySelector: () => ({}),
        querySelectorAll: () => [],
        documentElement: { setAttribute: () => {}, getAttribute: () => '' },
        addEventListener: () => {},
        createElement: () => ({}),
        readyState: 'loading'
    },
    window: { 
        matchMedia: () => ({ matches: false }),
        location: { protocol: 'file:' },
        print: () => {}
    },
    navigator: {},
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    setTimeout: () => {},
    console: console
};
vm.createContext(context);

for (let file of files) {
    try {
        const code = fs.readFileSync(path.join('c:/Users/alienware/KasirKu', file), 'utf8');
        vm.runInContext(code, context, { filename: file });
    } catch(e) {
        console.error('Error in ' + file + ':', e);
        break;
    }
}
console.log('Done testing load order.');
