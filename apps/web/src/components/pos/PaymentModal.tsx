'use client';
import React, { useState, useEffect } from 'react';
import { usePosStore } from '../../store/usePosStore';

const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

const BUILTIN_METHODS = [
  { id: 'cash',  label: 'Tunai',       type: 'cash' },
  { id: 'qris',  label: 'QRIS',        type: 'noncash' },
  { id: 'debit', label: 'Kartu Debit', type: 'noncash' },
  { id: 'debt',  label: 'Kasbon / Piutang', type: 'debt' },
  { id: 'quota', label: 'Potong Saldo Kuota', type: 'quota' },
];

function quickCash(total: number) {
  const set = new Set([total]);
  [5000, 10000, 50000, 100000].forEach(s => set.add(Math.ceil(total / s) * s));
  [10000, 20000, 50000, 100000].forEach(d => { if (d > total) set.add(d); });
  return Array.from(set).filter(v => v >= total).sort((a, b) => a - b).slice(0, 6);
}

export default function PaymentModal({ isOpen, onClose, onComplete }: { isOpen: boolean, onClose: () => void, onComplete: () => void }) {
  const { cartTotal, clearCart } = usePosStore();
  const total = cartTotal();
  const [method, setMethod] = useState('cash');
  const [cashInput, setCashInput] = useState<number | ''>('');
  
  const m = BUILTIN_METHODS.find(x => x.id === method)!;
  const isCash = m.type === 'cash';
  const change = typeof cashInput === 'number' ? Math.max(0, cashInput - total) : 0;
  const isPayDisabled = isCash && (typeof cashInput !== 'number' || cashInput < total);

  const handlePay = async () => {
    const amountPaid = isCash ? (typeof cashInput === 'number' ? cashInput : total) : total;
    if (amountPaid < total) {
      alert('Nominal uang kurang dari total tagihan.');
      return;
    }
    const success = await usePosStore.getState().submitOrder(m.label, amountPaid);
    if (success) {
      alert('Pembayaran berhasil!');
      onComplete();
      onClose();
    } else {
      alert('Pembayaran gagal, silakan coba lagi.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setMethod('cash');
      setCashInput('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal__scrim modal__scrim--active" onClick={onClose} />
      <div className="modal modal--active">
        <div className="modal__head">
          <h2 className="modal__title">Pembayaran</h2>
          <button className="modal__close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal__body">
          <div className="receipt-total" style={{textAlign:'center', marginBottom:'20px'}}>
            <div style={{color:'var(--muted)', fontSize:'14px'}}>Total Tagihan</div>
            <div style={{fontSize:'32px', fontWeight:900, color:'var(--accent)'}}>{formatRupiah(total)}</div>
          </div>

          <div style={{display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'16px'}}>
            {BUILTIN_METHODS.map(bm => (
              <button 
                key={bm.id} 
                className={`paymethod ${method === bm.id ? 'paymethod--active' : ''}`}
                onClick={() => setMethod(bm.id)}
                style={{flexShrink:0}}
              >
                {bm.label}
              </button>
            ))}
          </div>

          {isCash ? (
            <div id="cashSection">
              <label style={{display:'block', marginBottom:'8px', fontWeight:600}}>Nominal Diterima</label>
              <input 
                type="number" 
                className="input" 
                style={{fontSize:'20px', fontWeight:'bold'}}
                value={cashInput}
                onChange={e => setCashInput(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="0"
                autoFocus
              />
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginTop:'12px'}}>
                {quickCash(total).map(qc => (
                  <button key={qc} className="btn" onClick={() => setCashInput(qc)}>{formatRupiah(qc)}</button>
                ))}
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginTop:'16px', padding:'12px', background:'var(--surface-2)', borderRadius:'var(--r-md)'}}>
                <span style={{color:'var(--muted)'}}>Kembalian</span>
                <span style={{fontWeight:'bold', fontSize:'18px'}}>{formatRupiah(change)}</span>
              </div>
            </div>
          ) : (
            <div id="nonCashSection" style={{textAlign:'center', padding:'30px', background:'var(--surface-2)', borderRadius:'var(--r-md)'}}>
              <div style={{color:'var(--muted)', marginBottom:'8px'}}>Bayar via {m.label}</div>
              <div style={{fontSize:'24px', fontWeight:'bold'}}>{formatRupiah(total)}</div>
              {m.type === 'quota' && (
                <div style={{marginTop: '12px', fontSize: '14px', color: 'var(--warn)'}}>
                  Pastikan memilih Pelanggan di tab Pelanggan untuk memotong kuota.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal__foot">
          <button 
            className="btn btn--primary" 
            style={{width:'100%', height:'54px', fontSize:'16px'}}
            disabled={isPayDisabled}
            onClick={handlePay}
          >
            Selesaikan Pembayaran
          </button>
        </div>
      </div>
    </>
  );
}
