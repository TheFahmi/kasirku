import { esc, initials } from './format';

const SWATCHES = [
    ['#eef2fb', '#33509e'],
    ['#edf5ef', '#2f6f4f'],
    ['#f8ece4', '#b1502a'],
    ['#f3eff9', '#6a4bab'],
    ['#fbf3e3', '#996a17'],
    ['#f8eef0', '#a83a59'],
];

export const swatch = (category: string) => {
    let h = 0;
    for (const ch of String(category))
        h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return SWATCHES[h % SWATCHES.length];
};

export const tile = (name: string, category: string) => {
    const [bg, fg] = swatch(category);
    // Returning raw HTML string might not be what React needs, but we'll adapt.
    return `<span class="tile" style="--tile-bg:${bg};--tile-fg:${fg}">${esc(initials(name))}</span>`;
};

// React component emptyState
import React from 'react';

export const EmptyState = ({ title, sub }: { title: string, sub: string }) => (
    <div className="empty">
        <div className="empty__mark">
            <svg className="ico" viewBox="0 0 24 24" style={{ width: '32px', height: '32px', opacity: 0.8 }}>
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" fill="none" stroke="currentColor"/>
                <path d="M9 3v18M15 3v18" strokeWidth="1.5" stroke="currentColor"/>
                <path d="M3 9h18M3 15h18" strokeWidth="1.5" stroke="currentColor"/>
            </svg>
        </div>
        <p className="empty__title">{title}</p>
        <p className="empty__sub">{sub}</p>
    </div>
);
