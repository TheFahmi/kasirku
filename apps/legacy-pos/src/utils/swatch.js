import { esc, initials } from './format.js';

const SWATCHES = [
    ['linear-gradient(135deg, #6366f1, #a855f7)', '#ffffff'], // Indigo to Purple
    ['linear-gradient(135deg, #10b981, #059669)', '#ffffff'], // Emerald
    ['linear-gradient(135deg, #f59e0b, #ea580c)', '#ffffff'], // Amber to Orange
    ['linear-gradient(135deg, #ec4899, #e11d48)', '#ffffff'], // Pink to Rose
    ['linear-gradient(135deg, #3b82f6, #2dd4bf)', '#ffffff'], // Blue to Teal
    ['linear-gradient(135deg, #8b5cf6, #d946ef)', '#ffffff'], // Violet to Fuchsia
];

export const swatch = category => {
    let h = 0;
    for (const ch of String(category)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return SWATCHES[h % SWATCHES.length];
};

export const tile = (name, category) => {
    const [bg, fg] = swatch(category);
    return `<span class="tile" style="--tile-bg:${bg};--tile-fg:${fg}">${esc(initials(name))}</span>`;
};

export const emptyState = (title, sub) =>
    `<div class="empty">
        <div class="empty__mark">
            <svg class="ico" viewBox="0 0 24 24" style="width:32px;height:32px;opacity:0.8">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.5"/>
                <path d="M9 3v18M15 3v18" stroke-width="1.5"/>
                <path d="M3 9h18M3 15h18" stroke-width="1.5"/>
            </svg>
        </div>
        <p class="empty__title">${esc(title)}</p>
        <p class="empty__sub">${esc(sub)}</p>
    </div>`;

export const Swatch = { swatch, tile, emptyState };
