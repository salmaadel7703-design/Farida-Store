import { useState, useRef } from 'react'

function ProductPage({ product, onClose, onAddToCart }) {
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const touchStartX = useRef(null)

  const allImages = product.image ? [product.image, ...(product.images || [])] : (product.images || [])
  const images = [...new Set(allImages)]
  const colors = product.colors ? product.colors.split(',').map(c => c.trim()).filter(Boolean) : []
  const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : ['S', 'M', 'L', 'XL', 'XXL']

  const prevImg = () => setActiveImg(i => (i === 0 ? images.length - 1 : i - 1))
  const nextImg = () => setActiveImg(i => (i === images.length - 1 ? 0 : i + 1))

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? nextImg() : prevImg()
    touchStartX.current = null
  }

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="product-page" onClick={onClose}>

        <button
          className="drawer-close product-page-close"
          onClick={onClose}
          style={{
            position: 'fixed', top: '1rem', right: '1rem', left: 'auto', zIndex: 400,
            background: 'var(--gold)', color: 'var(--black)', border: 'none',
            borderRadius: '24px', padding: '8px 16px', fontWeight: '700', fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            fontFamily: 'Tajawal, sans-serif'
          }}
        >
          ✕ رجوع
        </button>

        <div className="product-page-inner" onClick={e => e.stopPropagation()}>
          <div className="product-page-img" style={{position:'relative'}}>
            {images.length > 0 ? (
              <>
                {/* الصورة الرئيسية مع swipe وزوم */}
                <div
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => setZoomed(!zoomed)}
                  style={{
                    width: '100%', height: zoomed ? 'auto' : '100%',
                    overflow: zoomed ? 'auto' : 'hidden',
                    cursor: zoomed ? 'zoom-out' : 'zoom-in',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    minHeight: '300px',
                  }}
                >
                  <img
                    src={images[activeImg]}
                    alt={product.name}
                    style={{
                      width: zoomed ? '200%' : '100%',
                      height: zoomed ? 'auto' : '100%',
                      objectFit: zoomed ? 'contain' : 'cover',
                      transition: 'all 0.3s',
                    }}
                  />
                </div>

                {/* النقاط */}
                {images.length > 1 && (
                  <div style={{position:'absolute', bottom:'70px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'6px', zIndex:5}}>
                    {images.map((_, i) => (
                      <div key={i} onClick={() => setActiveImg(i)} style={{
                        width:'8px', height:'8px', borderRadius:'50%', cursor:'pointer',
                        background: i === activeImg ? 'var(--gold)' : 'rgba(255,255,255,0.5)'
                      }} />
                    ))}
                  </div>
                )}

                {/* التامبنيلز */}
                {images.length > 1 && (
                  <div style={{display:'flex', gap:'8px', padding:'8px', overflowX:'auto'}}>
                    {images.map((img, i) => (
                      <img key={i} src={img} alt="" onClick={() => setActiveImg(i)} style={{
                        width:'60px', height:'60px', objectFit:'cover', borderRadius:'4px',
                        cursor:'pointer', border: activeImg === i ? '2px solid var(--gold)' : '2px solid transparent',
                        flexShrink: 0
                      }} />
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