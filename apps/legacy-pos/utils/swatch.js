'use strict';
const Swatch = (() => {
    const SWATCHES = [
        ['#eef2fb', '#33509e'],
        ['#edf5ef', '#2f6f4f'],
        ['#f8ece4', '#b1502a'],
        ['#f3eff9', '#6a4bab'],
        ['#fbf3e3', '#996a17'],
        ['#f8eef0', '#a83a59'],
    ];

    const swatch = category => {
        let h = 0;
        for (const ch of String(category))
            h = (h * 31 + ch.charCodeAt(0)) >>> 0;
        return SWATCHES[h % SWATCHES.length];
    };

    const tile = (name, category) => {
        const [bg, fg] = swatch(category);
        return `<span class="tile" style="--tile-bg:${bg};--tile-fg:${fg}">${Format.esc(Format.initials(name))}</span>`;
    };

    const emptyState = (title, sub) =>
        `<div class="empty">
            <div class="empty__mark">
                <svg class="ico" viewBox="0 0 24 24" style="width:32px;height:32px;opacity:0.8">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.5"/>
                    <path d="M9 3v18M15 3v18" stroke-width="1.5"/>
                    <path d="M3 9h18M3 15h18" stroke-width="1.5"/>
                </svg>
            </div>
            <p class="empty__title">${Format.esc(title)}</p>
            <p class="empty__sub">${Format.esc(sub)}</p>
        </div>`;

    return { swatch, tile, emptyState };
})();
