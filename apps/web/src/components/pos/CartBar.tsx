'use client';
import React from 'react';
import { usePosStore } from '../../store/usePosStore';
import { formatRupiah } from '../../utils/format';

export default function CartBar({ onOpen }: { onOpen: () => void }) {
  const { cart, cartTotal } = usePosStore();
  const n = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <button 
        className="cartbar" 
        id="cartBar" 
        onClick={onOpen} 
        style={{ opacity: n ? '1' : '.6' }}
    >
        <span 
            className="cartbar__count" 
            id="cartBarCount" 
            style={{ display: n ? 'flex' : 'none' }}
        >
            {n}
        </span>
        <span className="cartbar__label">
            {n ? 'Keranjang' : 'Keranjang Kosong'}
        </span>
        <span 
            className="cartbar__total" 
            id="cartBarTotal"
            style={{ display: n ? 'block' : 'none' }}
        >
            {formatRupiah(cartTotal())}
        </span>
        <svg className="ico ico--sm" viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </button>
  );
}
