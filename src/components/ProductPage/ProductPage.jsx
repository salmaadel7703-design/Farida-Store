import { useState, useRef } from 'react'

function ProductPage({ product, onClose, onAddToCart }) {
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [fullScreen, setFullScreen] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const touchStartX = useRef(null)
  const lastTap = useRef(0)

  const allImages = product.image ? [product.image, ...(product.images || [])] : (product.images || [])
  const images = [...new Set(allImages)]
  const colors = product.colors ? product.colors.split(',').map(c => c.trim()).filter(Boolean) : []
  const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : ['S', 'M', 'L', 'XL', 'XXL']

  const prevImg = () => { setActiveImg(i => (i === 0 ? images.length - 1 : i - 1)); setZoomed(false) }
  const nextImg = () => { setActiveImg(i => (i === images.length - 1 ? 0 : i + 1)); setZoomed(false) }

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? nextImg() : prevImg()
    touchStartX.current = null
  }

  const handleImgTap = () => {
    const now = Date.now()
    if (now - lastTap.current < 300) {
      setZoomed(z => !z)
    } else {
      setFullScreen(true)
    }
    lastTap.current = now
  }

  const imgStyle = (url, isActive) => ({
    width: '60px', height: '60px', borderRadius: '4px', cursor: 'pointer', flexShrink: 0,
    backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center',
    border: isActive ? '2px solid var(--gold)' : '2px solid transparent',
  })

  return (
    <>
      <div className="overlay" onClick={onClose}></div>

      {fullScreen && (
        <div
          onClick={() => { setFullScreen(false); setZoomed(false) }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)',
            zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: zoomed ? 'auto' : 'hidden'
          }}
        >
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={() => setZoomed(z => !z)}
            onClick={e => e.stopPropagation()}
            style={{
              width: zoomed ? '250%' : '100%',
              minHeight: '100vh',
              backgroundImage: `url(${images[activeImg]})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              cursor: zoomed ? 'zoom-out' : 'zoom-in',
              transition: 'all 0.3s',
            }}
          />
          <button onClick={() => { setFullScreen(false); setZoomed(false) }} style={{
            position: 'fixed', top: '1rem', right: '1rem',
            background: 'var(--gold)', color: 'var(--black)', border: 'none',
            borderRadius: '24px', padding: '8px 16px', fontWeight: '700',
            fontSize: '14px', cursor: 'pointer', zIndex: 501, fontFamily: 'Tajawal, sans-serif'
          }}>✕ إغلاق</button>
        </div>
      )}

      <div className="product-page" onClick={onClose}>
        <button
          onClick={onClose}
          style={{
            position: 'fixed', top: '1rem', right: '1rem', left: 'auto', zIndex: 400,
            background: 'var(--gold)', color: 'var(--black)', border: 'none',
            borderRadius: '24px', padding: '8px 16px', fontWeight: '700', fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            fontFamily: 'Tajawal, sans-serif'
          }}
        >✕ رجوع</button>

        <div className="product-page-inner" onClick={e => e.stopPropagation()}>
          <div className="product-page-img" style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {images.length > 0 ? (
              <>
                {/* الصورة الرئيسية كـ background */}
                <div
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onClick={handleImgTap}
                  style={{
                    width: '100%', flex: 1, minHeight: '300px',
                    backgroundImage: `url(${images[activeImg]})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                  }}
                />

                {images.length > 1 && (
                  <div style={{ position: 'absolute', bottom: '70px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 5 }}>
                    {images.map((_, i) => (
                      <div key={i} onClick={() => setActiveImg(i)} style={{
                        width: '8px', height: '8px', borderRadius: '50%', cursor: 'pointer',
                        background: i === activeImg ? 'var(--gold)' : 'rgba(255,255,255,0.5)'
                      }} />
                    ))}
                  </div>
                )}

                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: '8px', padding: '8px', overflowX: 'auto' }}>
                    {images.map((img, i) => (
                      <div key={i} onClick={() => setActiveImg(i)} style={imgStyle(img, activeImg === i)} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <span style={{ fontSize: '100px', opacity: '0.3' }}>👘</span>
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

            <button className="auth-btn" style={{ marginTop: '1.5rem' }} onClick={() => {
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