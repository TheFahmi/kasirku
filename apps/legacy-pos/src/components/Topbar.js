import { Events } from '../core/events.js';
import { Auth } from './Auth.js';

function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    const sw = document.getElementById('darkModeSwitch');
    const th = document.getElementById('darkModeThumb');
    const lb = document.getElementById('darkModeLabel');
    if (!sw) return;
    sw.style.background = dark ? 'var(--accent)' : 'var(--border)';
    th.style.transform = dark ? 'translateX(18px)' : 'none';
    if (lb) lb.textContent = dark ? 'Aktif' : 'Nonaktif';
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = !isDark;
    localStorage.setItem('kasirku.theme', next ? 'dark' : 'light');
    applyTheme(next);
    Events.emit('theme:change', { dark: next });
}

function initTheme() {
    const saved = localStorage.getItem('kasirku.theme');
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved ? saved === 'dark' : sysDark);
}

export const Topbar = {
    initTheme,
    mount() {
        document.getElementById('menuBtn').addEventListener('click', () => {
            const n = (Auth.getAccount() || {}).user || 'Kasir';
            const nameEl = document.getElementById('accountName');
            const avatarEl = document.getElementById('accountAvatar');
            if (nameEl) nameEl.textContent = n;
            if (avatarEl) avatarEl.textContent = n.slice(0, 1).toUpperCase();
            document.getElementById('settingsSheet').hidden = false;
        });
        document.getElementById('shiftBtn').addEventListener('click', () => {
            Events.emit('shift:open');
        });
        document.getElementById('darkModeBtn').addEventListener('click', toggleTheme);
    }
};
