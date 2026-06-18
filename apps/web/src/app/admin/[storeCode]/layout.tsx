'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function TenantAdminLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode,
  params: { storeCode: string }
}) {
  const [showToast, setShowToast] = useState(false);

  const handleBukaCabang = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col md:flex-row relative">
      {/* Custom Toast */}
      <div className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <div className="bg-accent text-white px-6 py-3 rounded-full shadow-lg font-semibold flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>Fitur Buka Cabang akan segera hadir (Coming Soon)!</span>
        </div>
      </div>

      <aside className="w-full md:w-64 bg-surface-2 border-r border-border flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-blue-400">Dashboard</h1>
          <p className="text-xs text-muted mt-1 font-mono uppercase">{params.storeCode}</p>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-2">
          <Link href={`/admin/${params.storeCode}`} className="flex items-center space-x-3 px-4 py-3 bg-surface hover:bg-white/5 rounded-xl transition-colors">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            <span className="font-medium">Overview</span>
          </Link>
          <Link href={`/admin/${params.storeCode}/products`} className="flex items-center space-x-3 px-4 py-3 bg-surface hover:bg-white/5 rounded-xl transition-colors">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            <span className="font-medium">Products</span>
          </Link>
          
          <div className="pt-4 mt-4 border-t border-border">
            <p className="px-4 text-xs font-semibold text-muted mb-2 uppercase">Manajemen</p>
            <button onClick={handleBukaCabang} className="w-full flex items-center justify-between px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl transition-colors text-left">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                <span>Buka Cabang</span>
              </div>
              <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full uppercase font-bold">Soon</span>
            </button>
          </div>

          <div className="pt-4 mt-4 border-t border-border">
            <p className="px-4 text-xs font-semibold text-muted mb-2 uppercase">Quick Links</p>
            <Link href="/pos" className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              <span>Buka POS Kasir</span>
            </Link>
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}
