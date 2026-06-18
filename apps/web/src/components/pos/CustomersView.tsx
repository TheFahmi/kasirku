'use client';
import React, { useState } from 'react';
import { usePosStore } from '../../store/usePosStore';
import { swatch, initials } from '../../utils/swatch';
import { formatRupiah } from '../../utils/format';

export default function CustomersView() {
  const { customers, transactions, bizMode, fetchCustomers, fetchTransactions } = usePosStore();
  const [search, setSearch] = useState('');
  
  React.useEffect(() => {
    fetchCustomers();
    fetchTransactions();
  }, [fetchCustomers, fetchTransactions]);

  const q = search.toLowerCase();
  const items = customers.filter(c => c.name.toLowerCase().includes(q) || (c.phone && c.phone.includes(q)));
  const txs = transactions.filter(t => t.isDebt);

  return (
    <>
      <header className="topbar">
        <div className="search">
          <svg className="ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            placeholder="Cari pelanggan (nama, nomor WA)..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div style={{ padding: '16px', paddingBottom: '80px' }}>
        {!items.length ? (
          <div className="empty">
            <p className="empty__title">Tidak ada pelanggan</p>
            <p className="empty__sub">{q ? 'Coba ubah kata kunci' : 'Belum ada pelanggan terdaftar'}</p>
          </div>
        ) : (
          items.map(c => {
            const debtTotal = txs.filter(t => t.customerId === c.id).reduce((s, t) => s + t.total, 0);
            const [bg, fg] = swatch(c.name);
            
            return (
              <div key={c.id} className="citem" style={{ cursor: 'pointer', padding: '16px', borderRadius: '12px', marginBottom: '12px', border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', background: 'var(--surface)' }}>
                <span className="tile" style={{'--tile-bg': bg, '--tile-fg': fg} as any}>{initials(c.name)}</span>
                <div className="citem__info">
                  <div className="citem__name" style={{fontSize: '16px', fontWeight: 700}}>{c.name}</div>
                  <div className="citem__price" style={{fontSize: '13px', color: 'var(--muted)'}}>{c.phone || '-'}</div>
                </div>
                {debtTotal > 0 && (
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '11px', color: 'var(--danger)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase'}}>Belum Lunas</div>
                    <div style={{fontSize: '15px', fontWeight: 800, color: 'var(--ink)'}}>{formatRupiah(debtTotal)}</div>
                  </div>
                )}
                {bizMode === 'service' && c.quota > 0 && (
                  <div style={{textAlign: 'right', marginLeft: 'auto'}}>
                    <div style={{fontSize: '11px', color: 'var(--success)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase'}}>Sisa Kuota</div>
                    <div style={{fontSize: '15px', fontWeight: 800, color: 'var(--ink)'}}>{c.quota} Kg</div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 'calc(var(--nav-h) + 16px)', left: '16px', right: '16px', zIndex: 90, maxWidth: '800px', margin: '0 auto' }}>
        <button className="btn btn--primary btn--block btn--lg" style={{boxShadow: '0 4px 12px rgba(0,0,0,0.2)'}}>+ Tambah Pelanggan</button>
      </div>
    </>
  );
}
