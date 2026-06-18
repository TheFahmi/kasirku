'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [storeName, setStoreName] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Auto-generate storeCode from storeName
  useEffect(() => {
    const slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setStoreCode(slug);
  }, [storeName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeCode || !storeName) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeCode,
          name: storeName,
          ownerId: ownerId || 'self-registered',
          subscriptionStatus: 'Active',
          // Give them 14 days free trial automatically
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        })
      });

      if (res.ok) {
        // Redirect directly to their new admin dashboard!
        router.push(`/admin/${storeCode}`);
      } else {
        const err = await res.json();
        alert('Gagal membuat toko: ' + (err.message || 'Store code mungkin sudah dipakai.'));
      }
    } catch (e) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center items-center p-6 selection:bg-accent selection:text-white">
      
      {/* Dynamic Background subtle */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h1 className="text-2xl font-bold">Mulai Bisnis Anda</h1>
          <p className="text-white/50 text-sm mt-2">Daftar dalam 5 detik. Tanpa kartu kredit.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Nama Toko / Bisnis</label>
            <input 
              type="text" 
              required
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              placeholder="e.g., Kopi Senja"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Link URL Toko Anda</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all">
              <span className="pl-4 pr-2 text-white/40 text-sm font-mono select-none">merdu.id/</span>
              <input 
                type="text" 
                required
                value={storeCode}
                onChange={e => setStoreCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full bg-transparent py-3 pr-4 text-white font-mono text-sm focus:outline-none"
                placeholder="kopi-senja"
              />
            </div>
            <p className="text-xs text-white/40 mt-1.5 ml-1">Ini akan jadi link QR Menu & Kasir Anda.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Nama Pemilik (Opsional)</label>
            <input 
              type="text" 
              value={ownerId}
              onChange={e => setOwnerId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              placeholder="Budi Santoso"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !storeCode}
            className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Menyiapkan Toko...' : 'Buka Toko Sekarang →'}
          </button>
        </form>

        <p className="text-center text-xs text-white/40 mt-6">
          Dengan mendaftar, Anda menyetujui Syarat & Ketentuan Merdu Omni.
        </p>
      </div>

      <div className="relative z-10 mt-8">
        <Link href="/" className="text-sm text-white/50 hover:text-white transition-colors">
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
