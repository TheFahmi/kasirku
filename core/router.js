'use strict';
const Router = (() => {
    const VIEWS = ['pos', 'history', 'reports'];
    let _currentView = 'pos';
    function switchView(v) {
        if (!VIEWS.includes(v)) return;
        _currentView = v;
        document.querySelectorAll('.view').forEach(el => el.classList.remove('view--active'));
        const viewEl = document.getElementById('view-' + v);
        if (viewEl) {
            viewEl.classList.add('view--active');
            viewEl.style.animation = 'none';
            viewEl.offsetHeight;
            viewEl.style.animation = null;
        }
        document.querySelectorAll('.tab').forEach(btn => btn.classList.toggle('tab--active', btn.dataset.view === v));
        const cartBar = document.getElementById('cartBar');
        const clearBtn = document.getElementById('clearCartBtn');
        if (cartBar) cartBar.hidden = v !== 'pos';
        if (clearBtn) clearBtn.style.visibility = v === 'pos' ? 'visible' : 'hidden';
        document.querySelectorAll('.search').forEach(s => s.setAttribute('data-hide', 'false'));
        window._lastScrollY = 0;
        Events.emit('view:change', { view: v });
    }
    function initRouter() {
        document.querySelectorAll('.tab').forEach(btn => {
            btn.addEventListener('click', () => switchView(btn.dataset.view));
        });
        document.addEventListener('scroll', () => {
            const s = document.querySelector('.view--active .search');
            if (!s) return;
            const y = window.scrollY;
            const hide = y > (window._lastScrollY || 0) && y > 100;
            s.setAttribute('data-hide', hide ? 'true' : 'false');
            window._lastScrollY = y;
        }, { passive: true });
    }
    return { switchView, mount: initRouter, getCurrentView: () => _currentView };
})();
