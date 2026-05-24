import { useState } from 'react'

function ProductPage({ product, onClose, onAddToCart }) {
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)

  const sizes = ['S', 'M', 'L', 'XL', 'XXL']

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="product-page">
        <button className="drawer-close product-page-close" onClick={onClose}>✕</button>
        <div className="product-page-inner">
          <div className="product-page-img">
            <span style={{fontSize:'100px', opacity:'0.3'}}>👘</span>
          </div>
          <div className="product-page-info">
            <div className="product-page-name">{product.name}</div>
            <div className="product-page-price">
              {product.oldPrice && <span className="product-old">{product.oldPrice} ج</span>}
              <span className="product-price">{product.price} ج</span>
            </div>
            {product.badge && <div className="product-badge">{product.badge}</div>}

            <div className="product-page-section">السايز</div>
            <div className="sizes-grid">
              {sizes.map(s => (
                <div
                  key={s}
                  className={`size-btn ${size === s ? 'active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </div>
              ))}
            </div>

            <div className="product-page-section">الكمية</div>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
              <span className="qty-val">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>

            <button className="auth-btn" style={{marginTop:'1.5rem'}} onClick={() => {
              onAddToCart({ ...product, size, qty })
              onClose()
            }}>
              أضيفي للكارت
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductPage