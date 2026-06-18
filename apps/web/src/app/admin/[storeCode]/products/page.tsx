'use client';
import React, { useEffect, useState } from 'react';
import { formatRupiah } from '@/utils/format';

export default function TenantAdminProducts({ params }: { params: { storeCode: string } }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/products?storeCode=${params.storeCode}`);
      if (res.ok) setProducts(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [params.storeCode]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          price: Number(price), 
          category,
          storeCode: params.storeCode
        })
      });
      if (res.ok) {
        setName(''); setPrice(''); setCategory('');
        fetchProducts();
      }
    } catch (e) {
      console.error('Failed to create product', e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Katalog Produk</h2>
        <p className="text-muted mt-1">Kelola daftar menu dan produk yang akan tampil di POS dan QR Menu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Add Product */}
        <div className="bg-surface-2 border border-border rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-lg font-bold mb-4">Tambah Produk Baru</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Nama Produk</label>
              <input 
                type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full bg-bg border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-accent"
                placeholder="e.g., Nasi Goreng Spesial"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Harga (Rp)</label>
              <input 
                type="number" value={price} onChange={e => setPrice(e.target.value)} required
                className="w-full bg-bg border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-accent"
                placeholder="25000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Kategori</label>
              <input 
                type="text" value={category} onChange={e => setCategory(e.target.value)} required
                className="w-full bg-bg border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-accent"
                placeholder="Makanan"
              />
            </div>
            <button type="submit" className="w-full bg-accent text-white font-semibold py-2.5 rounded-xl hover:bg-blue-600 transition-colors">
              Simpan Produk
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2">
          <div className="bg-surface-2 border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-muted">
                <tr>
                  <th className="p-4">Nama Produk</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4 text-right">Harga</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={3} className="p-4 text-center text-muted">Belum ada produk.</td></tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-surface/50">
                      <td className="p-4 font-semibold">{p.name}</td>
                      <td className="p-4 text-muted"><span className="px-2 py-1 bg-surface rounded-md text-xs">{p.category}</span></td>
                      <td className="p-4 text-right text-accent font-medium">{formatRupiah(p.price)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
