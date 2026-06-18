'use client';
import React, { useState, useEffect } from 'react';
import { usePosStore } from '../store/usePosStore';
import { formatRupiah } from '../utils/format';

export default function CustomerPortal() {
  const { customers, transactions, fetchCustomers, fetchTransactions } = usePosStore();
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showPickup, setShowPickup] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchTransactions();
  }, [fetchCustomers, fetchTransactions]);

  const handleSearch = () => {
    if (!phone) return;
    const customer = customers.find(c => c.phone === phone);
    if (customer) {
      const debtTotal = transactions.filter(t => t.customerId === customer.id && t.isDebt).reduce((s, t) => s + t.total, 0);
      setResult({ ...customer, debtTotal });
    } else {
      setResult(null);
    }
    setSearched(true);
    setShowPickup(false);
  };

  const handlePickup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupAddress) return;
    alert(`Pesanan pickup untuk alamat:\n${pickupAddress}\n\nKurir kami akan segera menjemput cucian Anda!`);
    setShowPickup(false);
    setPickupAddress('');
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col font-sans">
      {/* Header */}
      <header className="h-[64px] bg-surface border-b border-border flex items-center px-4 md:px-8 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-accent text-white flex items-center justify-center font-bold">K</div>
          <h1 className="text-xl font-bold tracking-tight">KasirKu <span className="text-accent">Laundry</span></h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface border border-border p-8 rounded-2xl shadow-lg relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
          
          <h2 className="text-2xl font-extrabold mb-2 text-center">Halo, Pelanggan!</h2>
          <p className="text-muted text-center mb-8 text-sm">Masukkan nomor WhatsApp Anda untuk mengecek status cucian atau sisa Kuota Paket Kiloan Anda.</p>

          {!showPickup ? (
            <form className="flex flex-col gap-5" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-ink" htmlFor="phone">Nomor WhatsApp</label>
                <input 
                  type="tel" 
                  id="phone"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setSearched(false); }}
                  placeholder="Contoh: 08123456789" 
                  className="px-4 py-3 bg-surface-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-soft focus:border-accent transition-all"
                />
              </div>

              <button 
                type="submit" 
                className="mt-2 w-full bg-accent text-white font-bold py-3.5 rounded-xl shadow-[0_4px_12px_rgba(191,77,35,0.3)] hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Cek Status & Kuota
              </button>
              
              <button 
                type="button" 
                onClick={() => setShowPickup(true)}
                className="w-full bg-surface-2 text-ink border border-border font-bold py-3.5 rounded-xl hover:bg-border transition-colors flex justify-center items-center gap-2"
              >
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Pesan Layanan Pickup
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-5 animate-fade-in" onSubmit={handlePickup}>
              <div className="flex items-center gap-2 mb-2">
                <button type="button" onClick={() => setShowPickup(false)} className="p-2 rounded-full hover:bg-surface-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h3 className="font-bold text-lg">Layanan Pickup</h3>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-ink" htmlFor="address">Alamat Lengkap Penjemputan</label>
                <textarea 
                  id="address"
                  value={pickupAddress}
                  onChange={e => setPickupAddress(e.target.value)}
                  placeholder="Contoh: Jl. Sudirman No. 123, Kost Putri Kamar 4" 
                  rows={3}
                  className="px-4 py-3 bg-surface-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-soft focus:border-accent transition-all resize-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={!pickupAddress}
                className="w-full bg-accent disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_12px_rgba(191,77,35,0.3)] hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
              >
                Kirim Permintaan Pickup
              </button>
            </form>
          )}

          {/* Search Result */}
          {searched && (
            <div className="mt-6 pt-6 border-t border-border animate-fade-in">
              {result ? (
                <div className="bg-surface-2 p-4 rounded-xl border border-border">
                  <div className="font-bold text-lg mb-1">{result.name}</div>
                  <div className="text-sm text-muted mb-4">{result.phone}</div>
                  <div className="flex justify-between items-center bg-surface p-3 rounded-lg border border-border mb-2">
                    <span className="text-sm font-semibold">Sisa Kuota Kiloan</span>
                    <span className="text-lg font-extrabold text-accent">{result.quota || 0} Kg</span>
                  </div>
                  {result.debtTotal > 0 && (
                    <div className="flex justify-between items-center bg-[var(--danger)] text-white p-3 rounded-lg mb-4">
                      <span className="text-sm font-semibold">Belum Lunas</span>
                      <span className="text-lg font-extrabold">{formatRupiah(result.debtTotal)}</span>
                    </div>
                  )}
                  <button 
                    onClick={() => window.location.href = '/laundry/dashboard'}
                    className="w-full bg-surface-2 text-accent border border-border font-bold py-2.5 rounded-xl hover:bg-border transition-colors mt-2"
                  >
                    Buka Dashboard Lengkap &rarr;
                  </button>
                </div>
              ) : (
                <div className="text-center p-4 bg-surface-2 rounded-xl border border-border text-danger font-semibold">
                  Data pelanggan tidak ditemukan.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Info Banner */}
        <div className="mt-8 flex items-center gap-3 bg-accent-soft text-accent-ink px-4 py-3 rounded-xl max-w-md w-full border border-[rgba(191,77,35,0.2)]">
          <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Beli "Paket Kuota 100Kg" di Kasir untuk menikmati diskon dan layanan prioritas.</span>
        </div>
      </main>
    </div>
  );
}
