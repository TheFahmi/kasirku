'use client';
import React, { useEffect, useState } from 'react';

export default function KitchenDashboard({ params }: { params: { storeCode: string } }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/orders/kitchen?storeCode=${params.storeCode}`);
      if (res.ok) setOrders(await res.json());
    } catch (e) {
      console.error('Failed to fetch kitchen orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const int = setInterval(fetchOrders, 5000); // refresh every 5s
    return () => clearInterval(int);
  }, []);

  const markReady = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3005/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ready' }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
      alert('Gagal update status');
    }
  };

  const pending = orders.filter(o => o.status === 'pending');
  const cooking = orders.filter(o => o.status === 'cooking');

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans p-6">
      <header className="flex justify-between items-center mb-8 border-b border-[#333] pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <span className="bg-accent text-white p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
              </svg>
            </span>
            Kitchen Display System
          </h1>
          <p className="text-gray-400 mt-1">Real-time order tracking untuk dapur</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#1e1e1e] border border-[#333] px-4 py-2 rounded-xl text-center">
            <p className="text-xs text-gray-400 font-bold uppercase">Pending</p>
            <p className="text-xl font-black text-white">{pending.length}</p>
          </div>
          <div className="bg-[#1e1e1e] border border-[#333] px-4 py-2 rounded-xl text-center">
            <p className="text-xs text-gray-400 font-bold uppercase">Cooking</p>
            <p className="text-xl font-black text-accent">{cooking.length}</p>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-accent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map(o => (
            <div key={o.id} className="bg-[#1e1e1e] border border-[#333] rounded-2xl overflow-hidden shadow-xl flex flex-col transition-transform hover:-translate-y-1">
              <div className={`p-3 ${o.status === 'pending' ? 'bg-[#2a2a2a]' : 'bg-[rgba(191,77,35,0.2)] border-b border-[rgba(191,77,35,0.5)]'} flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${o.status === 'pending' ? 'bg-gray-600 text-white' : 'bg-accent text-white'}`}>
                    {o.status}
                  </span>
                  <span className="text-gray-400 text-xs">{new Date(o.createdAt).toLocaleTimeString()}</span>
                </div>
                {o.tableNumber && (
                  <span className="bg-[#333] text-white font-bold px-3 py-1 rounded-lg">
                    Meja {o.tableNumber}
                  </span>
                )}
              </div>
              <div className="p-4 flex-1">
                <ul className="space-y-3">
                  {o.items?.map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between items-start border-b border-[#333] pb-2 last:border-0 last:pb-0">
                      <div className="flex gap-3">
                        <span className="font-black text-lg text-accent">{item.qty}x</span>
                        <span className="font-semibold text-lg">{item.product?.name || item.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                {o.notes && (
                  <div className="mt-4 bg-[#2a2a2a] p-3 rounded-lg text-sm text-gray-300 border border-[#444]">
                    <span className="font-bold text-gray-400 block mb-1">Catatan:</span>
                    {o.notes}
                  </div>
                )}
              </div>
              <div className="p-4 pt-0">
                <button 
                  onClick={() => markReady(o.id)}
                  className="w-full bg-success text-white font-black py-4 rounded-xl shadow-[0_4px_12px_rgba(47,111,79,0.3)] hover:opacity-90 transition-opacity text-lg"
                >
                  TANDAI SELESAI
                </button>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-400">Tidak Ada Pesanan Aktif</h3>
              <p className="text-gray-500">Dapur saat ini bersih.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
