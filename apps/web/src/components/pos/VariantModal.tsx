'use client';
import React from 'react';
import { usePosStore, Product } from '../../store/usePosStore';

const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

interface VariantModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function VariantModal({ product, onClose }: VariantModalProps) {
  const { addToCart } = usePosStore();

  if (!product) return null;

  const handlePick = (variant: { id: string; name: string; price: number }) => {
    addToCart({
      ...product,
      cartKey: `${product.id}-${variant.id}`,
      name: `${product.name} - ${variant.name}`,
      price: variant.price ?? product.price,
      qty: 1
    });
    onClose();
  };

  return (
    <>
      <div className="modal__scrim modal__scrim--active" onClick={onClose} />
      <div className="modal modal--active" style={{ maxWidth: '400px' }}>
        <div className="modal__head">
          <div style={{ flex: 1 }}>
            <h2 className="modal__title">{product.name}</h2>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Pilih varian:</div>
          </div>
          <button className="modal__close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {product.variants?.map(v => (
            <button 
              key={v.id} 
              className="btn btn--ghost" 
              style={{ justifyContent: 'space-between', textAlign: 'left', padding: '16px' }}
              onClick={() => handlePick(v)}
            >
              <span>{v.name}</span>
              <span style={{ fontWeight: 700 }}>{formatRupiah(v.price ?? product.price)}</span>
            </button>
          ))}
          {(!product.variants || product.variants.length === 0) && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px' }}>
              Tidak ada varian.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
