'use client';
import React, { useEffect, useState } from 'react';
import { formatRupiah } from '@/utils/format';

export default function TenantAdminOverview({ params }: { params: { storeCode: string } }) {
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTxs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/transactions?storeCode=${params.storeCode}`);
        if (res.ok) setTxs(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTxs();
  }, [params.storeCode]);

  // Analytics Math
  const today = new Date().toDateString();
  const todayTxs = txs.filter(t => new Date(t.createdAt).toDateString() === today);
  const totalRevenue = txs.reduce((sum, t) => sum + Number(t.total), 0);
  const todayRevenue = todayTxs.reduce((sum, t) => sum + Number(t.total), 0);
  const aov = txs.length > 0 ? totalRevenue / txs.length : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Overview</h2>
        <p className="text-muted mt-1">Pantau performa bisnis Anda secara real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-2 border border-border rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-2">Penjualan Hari Ini</p>
          <p className="text-3xl font-bold text-white">{formatRupiah(todayRevenue)}</p>
          <p className="text-xs text-accent mt-2 font-medium">{todayTxs.length} Transaksi</p>
        </div>
        <div className="bg-surface-2 border border-border rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-2">Rata-rata Order (AOV)</p>
          <p className="text-3xl font-bold text-white">{formatRupiah(aov)}</p>
          <p className="text-xs text-muted mt-2">Per pelanggan</p>
        </div>
        <div className="bg-surface-2 border border-border rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-muted mb-2">Total Pendapatan (All Time)</p>
          <p className="text-3xl font-bold text-white">{formatRupiah(totalRevenue)}</p>
          <p className="text-xs text-green-400 mt-2 font-medium">{txs.length} Total Transaksi</p>
        </div>
      </div>

      <div className="bg-surface-2 border border-border rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">Transaksi Terakhir</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="p-4 rounded-tl-xl">ID Transaksi</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Metode Pembayaran</th>
                <th className="p-4 rounded-tr-xl text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
              ) : txs.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-muted">Belum ada transaksi.</td></tr>
              ) : (
                txs.slice(0, 10).map((t, i) => (
                  <tr key={t.id} className="border-b border-border hover:bg-surface/50 transition-colors">
                    <td className="p-4 font-mono text-accent">{t.id.slice(0,8)}...</td>
                    <td className="p-4 text-muted">{new Date(t.createdAt).toLocaleString()}</td>
                    <td className="p-4 uppercase text-xs font-bold">{t.paymentMethod}</td>
                    <td className="p-4 text-right font-medium">{formatRupiah(t.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
