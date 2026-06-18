'use client';
import React, { useEffect, useState } from 'react';

export default function QueueDisplay({ params }: { params: { storeCode: string } }) {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:3005/orders/queue/public?storeCode=${params.storeCode}`);
      if (res.ok) setOrders(await res.json());
    } catch (e) {
      console.error('Failed to fetch queue orders', e);
    }
  };

  useEffect(() => {
    fetchOrders();
    const int = setInterval(fetchOrders, 5000); // refresh every 5s
    return () => clearInterval(int);
  }, []);

  const cooking = orders.filter(o => o.status === 'cooking');
  const ready = orders.filter(o => o.status === 'ready');

  return (
    <div className="min-h-screen bg-bg text-ink font-sans flex flex-col">
      <header className="bg-surface border-b border-border p-6 shadow-sm flex items-center justify-between text-center">
        <h1 className="text-3xl font-black w-full tracking-wider uppercase text-accent">Status Pesanan / Order Status</h1>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Cooking Column */}
        <div className="flex-1 border-r border-border flex flex-col">
          <div className="bg-surface-2 p-6 text-center shadow-sm">
            <h2 className="text-4xl font-extrabold tracking-tight">Sedang Disiapkan</h2>
            <p className="text-muted font-bold tracking-widest uppercase mt-2">Preparing</p>
          </div>
          <div className="flex-1 p-8 bg-surface overflow-y-auto">
            <div className="flex flex-wrap gap-6 justify-center">
              {cooking.map(o => (
                <div key={o.id} className="w-40 h-32 bg-surface-2 rounded-2xl flex flex-col items-center justify-center border border-border shadow-sm">
                  <span className="text-sm font-bold text-muted uppercase tracking-widest mb-1">Meja</span>
                  <span className="text-6xl font-black">{o.tableNumber || '-'}</span>
                </div>
              ))}
              {cooking.length === 0 && (
                <div className="w-full text-center py-20 text-muted font-semibold text-xl">Kosong / Empty</div>
              )}
            </div>
          </div>
        </div>

        {/* Ready Column */}
        <div className="flex-1 flex flex-col">
          <div className="bg-success text-white p-6 text-center shadow-md z-10 relative">
            <h2 className="text-4xl font-extrabold tracking-tight">Silakan Ambil</h2>
            <p className="font-bold tracking-widest uppercase mt-2 opacity-80">Ready to Collect</p>
          </div>
          <div className="flex-1 p-8 bg-success/5 overflow-y-auto">
            <div className="flex flex-wrap gap-6 justify-center">
              {ready.map(o => (
                <div key={o.id} className="w-48 h-40 bg-white rounded-2xl flex flex-col items-center justify-center border-4 border-success shadow-[0_8px_30px_rgba(47,111,79,0.3)] animate-pulse-slow">
                  <span className="text-sm font-bold text-success uppercase tracking-widest mb-1">Meja</span>
                  <span className="text-7xl font-black text-success">{o.tableNumber || '-'}</span>
                </div>
              ))}
              {ready.length === 0 && (
                <div className="w-full text-center py-20 text-muted font-semibold text-xl opacity-50">Kosong / Empty</div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-surface border-t border-border p-4 text-center">
        <p className="font-semibold text-muted text-lg tracking-widest">KASIRKU RESTO DISPLAY</p>
      </footer>
    </div>
  );
}
