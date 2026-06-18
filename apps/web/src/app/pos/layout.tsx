import '../pos.css';
import React from 'react';

export default function PosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pos-app">
      {/* Topbar will go here */}
      <main className="view view--active pb-[64px]">
        {children}
      </main>
      {/* Navbar will go here */}
      <nav className="nav">
        <button className="tab tab--active" data-view="pos">
          <svg className="ico" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
          <span>Kasir</span>
        </button>
        <button className="tab" data-view="history">
          <svg className="ico" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span>Riwayat</span>
        </button>
        <button className="tab" data-view="customers">
          <svg className="ico" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Pelanggan</span>
        </button>
        <button className="tab" data-view="reports">
          <svg className="ico" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          <span>Laporan</span>
        </button>
      </nav>
    </div>
  );
}
