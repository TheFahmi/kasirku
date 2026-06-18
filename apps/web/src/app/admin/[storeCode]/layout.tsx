'use client';
import React from 'react';
import Link from 'next/link';

export default function TenantAdminLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode,
  params: { storeCode: string }
}) {
  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col md:flex-row">
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
