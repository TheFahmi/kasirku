'use client';
import React from 'react';
import { usePosStore } from '../../store/usePosStore';
import { swatch, EmptyState } from '../../utils/swatch';
import { formatRupiah, initials } from '../../utils/format';

export default function ProductGrid({ search, category, onManageProducts, onPickVariant }: { search: string, category: string, onManageProducts?: () => void, onPickVariant?: (product: any) => void }) {
    const products = usePosStore(s => s.products);
    const cart = usePosStore(s => s.cart);
    const addToCart = usePosStore(s => s.addToCart);

    const q = search.trim().toLowerCase();
    
    let list = products.filter(p =>
        (category === 'Semua' || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q))
    );
    list = [...list.filter(p => (p as any).pinned), ...list.filter(p => !(p as any).pinned)];

    const low = products.filter(p => p.stock > 0 && p.stock <= 5);
    const out = products.filter(p => p.stock <= 0);

    const getCartQty = (id: string) => {
        const item = cart.find(i => i.id === id);
        return item ? item.qty : 0;
    };

    return (
        <>
            {/* Stock Alert Banner */}
            <div id="stockAlertBanner">
                {(low.length > 0 || out.length > 0) && (
                    <button className="stock-alert" id="stockAlertBtn" onClick={onManageProducts}>
                        &#9888;&#65039; {out.length > 0 ? <b>{out.length} produk habis</b> : null}
                        {out.length > 0 && low.length > 0 && ', '}
                        {low.length > 0 ? `${low.length} produk stok ≤ 5` : null}
                        {' — '}<u>Kelola produk</u>
                    </button>
                )}
            </div>

            {/* Product Grid */}
            <div className="product-grid" id="productGrid">
                {list.length === 0 ? (
                    <div style={{ gridColumn: '1/-1' }}>
                        <EmptyState title="Tidak ditemukan" sub="Coba kata kunci atau kategori lain" />
                    </div>
                ) : (
                    list.map(p => {
                        const isOut = p.stock <= 0;
                        const isLow = !isOut && p.stock <= 5;
                        const inC = getCartQty(p.id);
                        const [bg, fg] = swatch(p.category);
                        const sc = isOut ? 'pcard__stock--out' : (isLow ? 'pcard__stock--low' : '');
                        const st = isOut ? 'Habis' : 'Stok ' + p.stock;
                        const hasVar = p.variants && p.variants.length > 0;
                        const minPrice = hasVar ? Math.min(p.price, ...p.variants!.map(v => v.price ?? p.price)) : p.price;
                        const priceLabel = hasVar ? `dari ${formatRupiah(minPrice)}` : formatRupiah(p.price);

                        return (
                            <button
                                key={p.id}
                                className={`pcard ${isOut ? 'pcard--out' : ''} ${inC > 0 ? 'pcard--incart' : ''} ${(p as any).pinned ? 'pcard--pinned' : ''}`.trim()}
                                data-add={p.id}
                                disabled={isOut}
                                onClick={() => {
                                    if (!isOut && !hasVar) {
                                        addToCart({
                                            ...p,
                                            cartKey: p.id,
                                            qty: 1
                                        });
                                    } else if (hasVar && onPickVariant) {
                                        onPickVariant(p);
                                    }
                                }}
                            >
                                <div className="pcard__media" style={{ '--tile-bg': bg, '--tile-fg': fg } as React.CSSProperties}>
                                    <span className="pcard__cat">{p.category}</span>{initials(p.name)}
                                    {inC > 0 ? <span className="pcard__badge">{inC}</span> : null}
                                    {isOut ? null : (
                                        <span className="pcard__add">
                                            <svg className="ico" viewBox="0 0 24 24">
                                                <path d="M12 5v14"/>
                                                <path d="M5 12h14"/>
                                            </svg>
                                        </span>
                                    )}
                                </div>
                                <div className="pcard__body">
                                    <div className="pcard__name">{p.name}{hasVar ? <small style={{ color: 'var(--muted)', fontSize: '10px' }}>▾ varian</small> : null}</div>
                                    <div className="pcard__foot">
                                        <span className="pcard__price">{priceLabel}</span>
                                        <span className={`pcard__stock ${sc}`}><span className="pcard__dot"></span>{st}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </>
    );
}
