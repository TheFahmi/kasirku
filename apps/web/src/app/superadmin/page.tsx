'use client';
import React, { useState, useEffect } from 'react';

export default function SuperAdminPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Tenant Form
  const [name, setName] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [type, setType] = useState('resto');
  const [ownerId, setOwnerId] = useState(''); // E.g., company-x

  const fetchTenants = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/tenants`);
      if (res.ok) setTenants(await res.json());
    } catch (e) {
      console.error('Failed to fetch tenants', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !storeCode) return;
    
    // Default subscription gives 30 days of active period
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, storeCode, type, ownerId, subscriptionStatus: 'active', validUntil })
      });
      if (res.ok) {
        setName('');
        setStoreCode('');
        setType('resto');
        setOwnerId('');
        fetchTenants();
      }
    } catch (e) {
      console.error('Failed to create tenant', e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tenant Management</h2>
          <p className="text-muted mt-2">Manage your KasirKu SaaS clients and store codes.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Form */}
        <div className="bg-surface-2 border border-border rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-lg font-bold mb-4">Generate New Tenant</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Business Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="e.g., Kopi Senja"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Unique Store Code</label>
              <input 
                type="text" 
                value={storeCode} 
                onChange={e => setStoreCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} 
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="e.g., kopi-senja"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Owner / Company ID (Optional)</label>
              <input 
                type="text" 
                value={ownerId} 
                onChange={e => setOwnerId(e.target.value)} 
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="e.g., pt-kopi-senja"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Business Type</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="resto">F&B / Resto</option>
                <option value="laundry">Laundry</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="w-full bg-accent text-white font-semibold py-2.5 rounded-xl hover:bg-blue-600 transition-colors mt-2"
            >
              Create Tenant
            </button>
          </form>
        </div>

        {/* Tenant List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
             <div className="animate-pulse bg-surface-2 h-32 rounded-2xl"></div>
          ) : tenants.length === 0 ? (
             <div className="bg-surface-2 border border-border rounded-2xl p-10 text-center">
               <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
               </div>
               <h3 className="text-lg font-bold">No Tenants Found</h3>
               <p className="text-muted mt-1">Generate your first tenant on the left panel.</p>
             </div>
          ) : (
            <div className="grid gap-4">
              {tenants.map(t => (
                <div key={t.id} className="bg-surface-2 border border-border rounded-2xl p-5 flex items-center justify-between hover:border-accent transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-sm ${t.type === 'resto' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{t.name} {t.subscriptionStatus === 'active' ? <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full ml-2">Active</span> : <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full ml-2">Expired</span>}</h4>
                      <p className="text-sm text-muted">Code: <span className="font-mono text-accent">{t.storeCode}</span> &bull; {t.type.toUpperCase()}</p>
                      {t.ownerId && <p className="text-xs text-muted mt-1">Owner: {t.ownerId}</p>}
                      {t.validUntil && <p className="text-xs text-muted">Valid until: {new Date(t.validUntil).toLocaleDateString()}</p>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a 
                      href={t.type === 'resto' ? `/r/${t.storeCode}/menu/1` : `/l/${t.storeCode}`}
                      target="_blank"
                      className="px-4 py-2 bg-surface text-sm font-semibold border border-border rounded-xl hover:bg-border transition-colors"
                    >
                      Visit Portal &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
