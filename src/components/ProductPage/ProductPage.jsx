import { useState } from 'react'

function ProductPage({ product, onClose, onAddToCart }) {
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  const images = product.images?.length ? product.images : product.image ? [product.image] : []
  const colors = product.colors ? product.colors.split(',').map(c => c.trim()).filter(Boolean) : []
  const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : ['S', 'M', 'L', 'XL', 'XXL']

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="product-page">
        <button className="drawer-close product-page-close" onClick={onClose}>✕</button>
        <div className="product-page-inner">
          <div className="product-page-img">
            {images.length > 0 ? (
              <>
                <img src={images[activeImg]} alt={product.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                {images.length > 1 && (
                  <div style={{display:'flex', gap:'8px', padding:'8px', overflowX:'auto'}}>
                    {images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        onClick={() => setActiveImg(i)}
                        style={{
                          width:'60px', height:'60px', objectFit:'cover', borderRadius:'4px',
                          cursor:'pointer', border: activeImg === i ? '2px solid var(--gold)' : '2px solid transparent'
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <span style={{fontSize:'100px', opacity:'0.3'}}>👘</span>
            )}
          </div>

          <div className="product-page-info">
            <div className="product-page-name">{product.name}</div>
            <div className="product-page-price">
              {product.oldPrice && <span className="product-old">{product.oldPrice} ج</span>}
              <span className="product-price">{product.price} ج</span>
            </div>
            {product.badge && <div className="product-badge">{product.badge}</div>}

            {colors.length > 0 && (
              <>
                <div className="product-page-section">اللون</div>
                <div className="sizes-grid">
                  {colors.map(c => (
                    <div key={c} className={`size-btn ${color === c ? 'active' : ''}`} onClick={() => setColor(c)}>{c}</div>
                  ))}
                </div>
              </>
            )}

            <div className="product-page-section">المقاس</div>
            <div className="sizes-grid">
              {sizes.map(s => (
                <div key={s} className={`size-btn ${size === s ? 'active' : ''}`} onClick={() => setSize(s)}>{s}</div>
              ))}
            </div>

            <div className="product-page-section">الكمية</div>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
              <span className="qty-val">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>

            <button className="auth-btn" style={{marginTop:'1.5rem'}} onClick={() => {
              onAddToCart({ ...product, size, color, qty })
              onClose()
            }}>
              أضيفي للسلة
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductPage