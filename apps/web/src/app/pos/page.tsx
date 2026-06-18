'use client';
import React, { useState, useEffect } from 'react';
import CategoryChips from '../../components/pos/CategoryChips';
import ProductGrid from '../../components/pos/ProductGrid';
import CartBar from '../../components/pos/CartBar';
import CartSheet from '@/components/pos/CartSheet';
import PaymentModal from '@/components/pos/PaymentModal';
import VariantModal from '@/components/pos/VariantModal';
import { usePosStore } from '../../store/usePosStore';

export default function POSPage() {
  const [activeCat, setActiveCat] = useState('Semua');
  const [search, setSearch] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [variantProduct, setVariantProduct] = useState<any>(null);
  const { fetchProducts } = usePosStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <header className="topbar">
        <div className="search">
          <svg className="ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            placeholder="Cari menu, produk, paket..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>
      
      <div className="view view--active">
        <CategoryChips 
          activeCat={activeCat} 
          onSelect={setActiveCat} 
        />
        <ProductGrid 
          search={search} 
          category={activeCat} 
          onPickVariant={setVariantProduct}
        />
      </div>

      <CartBar onOpenCart={() => setIsCartOpen(true)} />

      <CartSheet 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onPay={() => {
          setIsCartOpen(false);
          setIsPaymentOpen(true);
        }}
      />
      
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        onComplete={() => console.log('Payment complete')}
      />

      <VariantModal
        product={variantProduct}
        onClose={() => setVariantProduct(null)}
      />
    </>
  );
}
