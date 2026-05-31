function Cart({ open, onClose, items = [], onCheckout, onRemoveItem, onUpdateQty }) {
  const total = items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0)

  return (
    <>
      {open && <div className="overlay" onClick={onClose}></div>}
      <div className={`cart-panel ${open ? 'open' : ''}`}>
        <div className="cart-head">
          <span className="cart-head-title">عربة التسوق</span>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div style={{fontSize:'48px', marginBottom:'1rem'}}>🛍</div>
              <p>عربتك فارغة</p>
              <p style={{fontSize:'12px', marginTop:'8px', color:'var(--gray)'}}>أضيفي منتجات لتبدئي التسوق</p>
            </div>
          ) : (
            items.map((item, i) => (
              <div className="cart-item" key={i}>
                <div style={{flex:1}}>
                  <div className="cart-item-name">{item.name}</div>
                  {/* ✅ اللون والمقاس */}
                  <div style={{fontSize:'12px', color:'var(--gray)', marginTop:'4px'}}>
                    {item.size && <span>المقاس: {item.size}</span>}
                    {item.size && item.color && <span> · </span>}
                    {item.color && <span>اللون: {item.color}</span>}
                  </div>
                  {/* ✅ الكمية */}
                  <div style={{display:'flex', alignItems:'center', gap:'8px', marginTop:'8px'}}>
                    <button className="qty-btn" onClick={() => onUpdateQty(i, (item.qty || 1) - 1)}>-</button>
                    <span style={{color:'white', fontSize:'14px'}}>{item.qty || 1}</span>
                    <button className="qty-btn" onClick={() => onUpdateQty(i, (item.qty || 1) + 1)}>+</button>
                  </div>
                </div>
                <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px'}}>
                  <div className="cart-item-price">{item.price * (item.qty || 1)} ج</div>
                  {/* ✅ زرار حذف */}
                  <button onClick={() => onRemoveItem(i)} style={{background:'none', border:'none', color:'#ff6b6b', cursor:'pointer', fontSize:'18px'}}>🗑</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <span>الإجمالي</span>
            <span>{total} ج</span>
          </div>
          <button className="checkout-btn" onClick={onCheckout}>إتمام الطلب</button>
          <div className="pay-methods">
            <div className="pay-method">📱 فودافون كاش</div>
            <div className="pay-method">🚚 عند الاستلام</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart