function Cart({ open, onClose, items = [], onCheckout }) {
  const total = items.reduce((sum, item) => sum + item.price, 0)

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
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">{item.price} ج</div>
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