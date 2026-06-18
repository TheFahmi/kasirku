'use client';
import React, { useMemo } from 'react';
import { usePosStore } from '../../store/usePosStore';

export default function CategoryChips({ category, onCategoryChange }: { category: string, onCategoryChange: (c: string) => void }) {
  const products = usePosStore(s => s.products);

  const categories = useMemo(() => {
    return ['Semua', ...Array.from(new Set(products.map(p => p.category)))];
  }, [products]);

  return (
    <div className="chips" id="categoryChips">
      {categories.map(c => (
        <button 
          key={c}
          className={`chip ${c === category ? 'chip--active' : ''}`} 
          data-cat={c}
          onClick={() => onCategoryChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
