import React from 'react';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-surface-2 border-r border-border flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-400">KasirKu Master</h1>
          <p className="text-xs text-muted mt-1">SaaS Super Admin</p>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-2">
          <a href="/superadmin" className="flex items-center space-x-3 px-4 py-3 bg-accent text-white rounded-xl shadow-lg shadow-accent/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            <span className="font-medium">Tenants</span>
          </a>
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center font-bold text-sm">F</div>
            <div>
              <p className="text-sm font-semibold">Founder</p>
              <p className="text-xs text-muted">Admin</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}
