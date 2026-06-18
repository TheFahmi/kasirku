'use client';
import React, { useState } from 'react';
import { usePosStore } from '../../store/usePosStore';

// Assuming formatRupiah and tile are imported or recreated here
const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

export default function CartSheet({ isOpen, onClose, onPay }: { isOpen: boolean, onClose: () => void, onPay: () => void }) {
  const { cart, updateCartQty, cartSubtotal, cartTotal, discount } = usePosStore();
  const [editingQtyFor, setEditingQtyFor] = useState<string | null>(null);
  const [tempQty, setTempQty] = useState('');

  if (!isOpen) return null;

  return (
    <>
      <div className="modal__scrim modal__scrim--active" onClick={onClose} />
      <div className="sheet sheet--active">
        <div className="sheet__head">
          <h3>Keranjang ({cart.length})</h3>
          <button onClick={onClose} style={{background:'none', border:'none', fontSize:'24px'}}>&times;</button>
        </div>
        <div className="sheet__body" id="cartItems">
          {cart.length === 0 ? (
            <div className="empty" style={{textAlign: 'center', padding: '40px 20px'}}>
              <p>Keranjang kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.cartKey} className="citem">
                <span className="tile" style={{backgroundColor: '#eef2fb', color: '#33509e'}}>{item.name.substring(0,2)}</span>
                <div className="citem__info">
                  <div className="citem__name">{item.name}</div>
                  <div className="citem__price">{formatRupiah(item.price)} × {item.qty} = {formatRupiah(item.price * item.qty)}</div>
                </div>
                <div className="qty">
                  <button className="qty__btn" onClick={() => updateCartQty(item.cartKey, item.qty - 1)}>-</button>
                  {editingQtyFor === item.cartKey ? (
                    <input 
                      type="number"
                      autoFocus
                      className="qty__num"
                      style={{ width: '40px', textAlign: 'center', padding: '2px' }}
                      value={tempQty}
                      onChange={e => setTempQty(e.target.value)}
                      onBlur={() => {
                        const val = parseFloat(tempQty);
                        if (!isNaN(val) && val > 0) updateCartQty(item.cartKey, val);
                        setEditingQtyFor(null);
                      }}
                    />
                  ) : (
                    <span 
                      className="qty__num" 
                      style={{cursor: 'pointer', textDecoration: 'underline dashed var(--border)'}}
                      onClick={() => { setEditingQtyFor(item.cartKey); setTempQty(item.qty.toString()); }}
                    >
                      {item.qty}
                    </span>
                  )}
                  <button className="qty__btn" onClick={() => updateCartQty(item.cartKey, item.qty + 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="sheet__foot">
          <div className="summary">
            <div className="summary__row">
              <span>Subtotal</span>
              <span id="cartSub">{formatRupiah(cartSubtotal())}</span>
            </div>
            <div className="summary__row">
              <span style={{color:'var(--accent)', cursor:'pointer'}}>Diskon</span>
              <span id="cartDisc" style={{color:'var(--accent)'}}>
                {discount.value > 0 ? `-${discount.type === '%' ? discount.value + '%' : formatRupiah(discount.value)}` : '-'}
              </span>
            </div>
            <div className="summary__row summary__row--total">
              <span>Total</span>
              <span id="cartTot">{formatRupiah(cartTotal())}</span>
            </div>
          </div>
          <button className="btn btn--primary" style={{width:'100%', marginTop:'16px'}} disabled={cart.length === 0} onClick={onPay}>Lanjut Bayar</button>
        </div>
      </div>
    </>
  );
}
