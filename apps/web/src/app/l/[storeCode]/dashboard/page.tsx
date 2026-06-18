'use client';
import React, { useEffect, useState } from 'react';
import { usePosStore } from '@/store/usePosStore';
import { formatRupiah } from '@/utils/format';
import { useRouter } from 'next/navigation';

export default function LaundryDashboard({ params }: { params: { storeCode: string } }) {
  const router = useRouter();
  const { customers, transactions, fetchCustomers, fetchTransactions } = usePosStore();
  const [customer, setCustomer] = useState<any>(null);
  
  useEffect(() => {
    fetchCustomers(params.storeCode);
    fetchTransactions(params.storeCode);
    
    // For demo purposes, we pick the first customer as logged in
    const timer = setTimeout(() => {
      if (customers.length > 0) {
        setCustomer(customers[0]);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [customers.length, fetchCustomers, fetchTransactions]);

  if (!customer) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-accent"></div>
      </div>
    );
  }

  const myTxs = transactions.filter(t => t.customerId === customer.id);
  const activeTxs = myTxs.filter(t => t.status !== 'done' && t.status !== 'delivered');
  const pastTxs = myTxs.filter(t => t.status === 'done' || t.status === 'delivered');

  return (
    <div className="min-h-screen bg-bg text-ink font-sans pb-20">
      {/* Header */}
      <header className="bg-accent text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="50"/>
          </svg>
        </div>
        <div className="flex justify-between items-center relative z-10 mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">KasirKu Laundry</h1>
          <button onClick={() => router.push('/')} className="text-sm font-semibold hover:underline">Keluar</button>
        </div>
        
        <div className="relative z-10">
          <p className="text-accent-ink text-sm font-medium mb-1">Selamat datang kembali,</p>
          <h2 className="text-3xl font-black">{customer.name}</h2>
          <p className="mt-2 text-sm font-medium flex items-center gap-2">
            <span className="bg-white/20 px-2 py-1 rounded-md">{customer.phone || 'No Phone'}</span>
          </p>
        </div>
      </header>

      <main className="px-4 -mt-6 relative z-20 space-y-6">
        
        {/* Quota Card */}
        <section className="bg-surface rounded-2xl p-5 shadow-lg border border-border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-muted">Sisa Kuota Kiloan</h3>
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-ink">{customer.quota || 0}</span>
            <span className="text-lg font-bold text-muted mb-1">Kg</span>
          </div>
          <div className="mt-4 w-full bg-surface-2 rounded-full h-2.5">
            <div className="bg-accent h-2.5 rounded-full" style={{ width: `${Math.min(100, (customer.quota || 0) / 100 * 100)}%` }}></div>
          </div>
          <p className="text-xs text-muted mt-2">Dapatkan diskon 10% untuk isi ulang berikutnya.</p>
        </section>

        {/* Active Transactions */}
        <section>
          <h3 className="font-bold text-lg mb-3">Sedang Diproses</h3>
          {activeTxs.length === 0 ? (
            <div className="bg-surface-2 rounded-2xl p-6 text-center border border-border">
              <p className="text-muted font-medium">Tidak ada cucian yang sedang diproses.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTxs.map(tx => (
                <div key={tx.id} className="bg-surface rounded-2xl p-4 shadow-sm border border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted mb-1">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    <p className="font-bold">{formatRupiah(tx.total)}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-accent-soft text-accent-ink border border-[rgba(191,77,35,0.2)]">
                      {tx.status || 'Washing'}
                    </span>
                    {tx.isDebt && <span className="text-[10px] text-danger font-bold uppercase mt-1">Belum Lunas</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Transactions */}
        <section>
          <h3 className="font-bold text-lg mb-3">Riwayat Selesai</h3>
          {pastTxs.length === 0 ? (
            <p className="text-muted text-sm text-center">Belum ada riwayat.</p>
          ) : (
            <div className="space-y-3">
              {pastTxs.map(tx => (
                <div key={tx.id} className="bg-surface rounded-xl p-4 border border-border flex items-center justify-between opacity-80">
                  <div>
                    <p className="text-xs text-muted">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    <p className="font-semibold text-sm">{formatRupiah(tx.total)}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-surface-2 text-muted">
                    Selesai
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
