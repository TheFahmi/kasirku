'use client';
import React, { useEffect, useState } from 'react';
import { usePosStore, Product } from '@/store/usePosStore';
import { formatRupiah } from '@/utils/format';

export default function QRMenu({ params }: { params: { tableId: string } }) {
  const { products, fetchProducts } = usePosStore();
  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exist = prev.find(i => i.product.id === product.id);
      if (exist) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const exist = prev.find(i => i.product.id === id);
      if (exist && exist.qty > 1) return prev.map(i => i.product.id === id ? { ...i, qty: i.qty - 1 } : i);
      return prev.filter(i => i.product.id !== id);
    });
  };

  const submitOrder = async () => {
    if (cart.length === 0) return;
    try {
      const res = await fetch('http://localhost:3005/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: cart.reduce((s, i) => s + (i.product.price * i.qty), 0),
          status: 'cooking',
          tableNumber: params.tableId,
          customerId: '00000000-0000-0000-0000-000000000000', // anonymous
        }),
      });
      if (res.ok) {
        setOrdered(true);
        setCart([]);
      }
    } catch (e) {
      console.error(e);
      alert('Gagal mengirim pesanan');
    }
  };

  const total = cart.reduce((s, i) => s + (i.product.price * i.qty), 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  if (ordered) {
    return (
      <div className="min-h-screen bg-bg text-ink flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-20 h-20 bg-success text-white rounded-full flex items-center justify-center mb-6 shadow-lg">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-black mb-2 text-center">Pesanan Diterima!</h2>
        <p className="text-muted text-center mb-8">Koki kami sedang menyiapkan makanan Anda. Silakan tunggu di Meja {params.tableId}.</p>
        <button onClick={() => setOrdered(false)} className="px-6 py-3 bg-surface-2 text-ink font-bold rounded-xl shadow-sm border border-border">Pesan Menu Lain</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink font-sans pb-32">
      <header className="bg-surface sticky top-0 z-20 border-b border-border p-4 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="font-black text-xl">Menu Resto</h1>
          <p className="text-xs font-bold text-accent">Meja {params.tableId}</p>
        </div>
        <div className="w-10 h-10 bg-surface-2 rounded-full flex items-center justify-center font-bold text-muted border border-border">
          {products.length}
        </div>
      </header>

      <main className="p-4 space-y-4">
        {products.map(p => {
          const inCart = cart.find(i => i.product.id === p.id)?.qty || 0;
          return (
            <div key={p.id} className="bg-surface p-4 rounded-2xl shadow-sm border border-border flex gap-4 overflow-hidden relative">
              {inCart > 0 && <div className="absolute top-0 right-0 w-2 h-full bg-accent"></div>}
              <div className="w-20 h-20 bg-surface-2 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 border border-border">
                {p.name.charAt(0)}
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{p.name}</h3>
                  <p className="text-accent font-extrabold">{formatRupiah(p.price)}</p>
                </div>
                <div className="flex justify-end items-center gap-3 mt-2">
                  {inCart > 0 ? (
                    <>
                      <button onClick={() => removeFromCart(p.id)} className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-ink font-bold hover:bg-border transition-colors">-</button>
                      <span className="font-black w-4 text-center">{inCart}</span>
                      <button onClick={() => addToCart(p)} className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold shadow-md">+</button>
                    </>
                  ) : (
                    <button onClick={() => addToCart(p)} className="px-4 py-1.5 bg-accent-soft text-accent-ink font-bold rounded-full text-sm hover:bg-accent hover:text-white transition-colors border border-[rgba(191,77,35,0.2)]">
                      Tambah
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Floating Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-50 animate-slide-up">
          <div className="bg-ink text-bg p-2 pl-6 pr-2 rounded-2xl shadow-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-dark font-medium">{itemCount} item</p>
              <p className="font-bold text-lg">{formatRupiah(total)}</p>
            </div>
            <button onClick={submitOrder} className="bg-accent text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_12px_rgba(191,77,35,0.4)] hover:opacity-90 transition-opacity">
              Pesan Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
