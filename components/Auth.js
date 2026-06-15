'use strict';
const Auth = (() => {
    const getAccount = () => Storage.load(Storage.KEY.auth, null);
    let _session = Storage.load(Storage.KEY.session, '') === '1';
    const setSession = on => { _session = on; Storage.save(Storage.KEY.session, on ? '1' : ''); };
    const isLoggedIn = () => _session;
    let _mode = 'login';
    function showError(msg) {
        const el = document.getElementById('authError');
        el.textContent = msg;
        el.hidden = false;
    }
    function renderMode() {
        const setup = _mode === 'setup';
        document.getElementById('authSubtitle').textContent = setup ? 'Buat akun untuk mulai menggunakan' : 'Masuk untuk melanjutkan';
        document.getElementById('authConfirmField').hidden = !setup;
        document.getElementById('authSubmit').textContent = setup ? 'Buat Akun' : 'Masuk';
        document.getElementById('forgotBtn').hidden = setup;
        document.getElementById('authHint').textContent = setup ? 'Akun & data tersimpan di perangkat ini.' : 'Lupa sandi akan mereset seluruh data.';
        document.getElementById('authError').hidden = true;
        document.getElementById('authForm').reset();
        const acc = getAccount();
        if (!setup && acc) document.getElementById('authUser').value = acc.user;
        setTimeout(() => document.getElementById('authUser').focus(), 60);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        const user = document.getElementById('authUser').value.trim();
        const pass = document.getElementById('authPass').value;
        if (_mode === 'setup') {
            if (user.length < 3) return showError('Nama pengguna minimal 3 karakter');
            if (pass.length < 4) return showError('Kata sandi minimal 4 karakter');
            if (pass !== document.getElementById('authPass2').value) return showError('Konfirmasi sandi tidak cocok');
            const hash = await Crypto.hashPassword(pass);
            Storage.save(Storage.KEY.auth, { user, hash });
            setSession(true); enterApp(); UX.toast('Akun dibuat. Selamat datang, ' + user + '!');
        } else {
            const acc = getAccount();
            if (!acc) { _mode = 'setup'; renderMode(); return showError('Belum ada akun. Silakan daftar.'); }
            if (acc.user.toLowerCase() !== user.toLowerCase()) return showError('Nama pengguna salah');
            const hash = await Crypto.hashPassword(pass);
            if (acc.hash !== hash) return showError('Kata sandi salah');
            setSession(true); enterApp(); UX.toast('Selamat datang kembali, ' + acc.user + '!');
        }
    }
    function enterApp() {
        document.getElementById('authScreen').hidden = true;
        const n = (getAccount() || {}).user || 'Kasir';
        const nameEl = document.getElementById('accountName');
        const avatarEl = document.getElementById('accountAvatar');
        if (nameEl) nameEl.textContent = n;
        if (avatarEl) avatarEl.textContent = n.slice(0, 1).toUpperCase();
        Events.emit('auth:enter');
    }
    function logout() {
        setSession(false); _mode = 'login'; renderMode();
        document.getElementById('authScreen').hidden = false;
        Events.emit('auth:exit');
    }
    function resetAllData() {
        Object.values(Storage.KEY).forEach(k => { try { localStorage.removeItem(k); } catch {} });
        setSession(false);
        AppState.state.products = AppState.freshSeed();
        AppState.state.transactions = []; AppState.state.cart = []; AppState.state.discount = { type: 'Rp', value: 0 };
        AppState.state.category = 'Semua'; AppState.state.search = '';
        AppState.storeInfo.name = 'KasirKu'; AppState.storeInfo.address = ''; AppState.storeInfo.phone = '';
        Storage.save(Storage.KEY.products, AppState.state.products);
        document.getElementById('searchInput').value = ''; document.getElementById('discountInput').value = 0;
        Events.emit('products:updated'); Events.emit('cart:updated');
        _mode = 'setup'; renderMode(); document.getElementById('authScreen').hidden = false;
        UX.toast('Semua data direset. Silakan buat akun baru.');
    }
    function routeAuth() {
        if (!getAccount()) { _mode = 'setup'; renderMode(); document.getElementById('authScreen').hidden = false; }
        else if (!_session) { _mode = 'login'; renderMode(); document.getElementById('authScreen').hidden = false; }
        else { enterApp(); }
    }
    return {
        mount() {
            document.getElementById('authForm').addEventListener('submit', handleSubmit);
            document.getElementById('forgotBtn').addEventListener('click', () => { document.getElementById('forgotModal').hidden = false; });
            document.getElementById('confirmForgotBtn').addEventListener('click', () => { document.getElementById('forgotModal').hidden = true; resetAllData(); });
        },
        getAccount, setSession, isLoggedIn, enterApp, logout, resetAllData, routeAuth
    };
})();
