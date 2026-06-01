import { useState } from 'react'

function ProductPage({ product, onClose, onAddToCart }) {
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  const allImages = product.image ? [product.image, ...(product.images || [])] : (product.images || [])
  const images = [...new Set(allImages)]
  const colors = product.colors ? product.colors.split(',').map(c => c.trim()).filter(Boolean) : []
  const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : ['S', 'M', 'L', 'XL', 'XXL']

  const prevImg = () => setActiveImg(i => (i === 0 ? images.length - 1 : i - 1))
  const nextImg = () => setActiveImg(i => (i === images.length - 1 ? 0 : i + 1))

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="product-page">
        <button className="drawer-close product-page-close" onClick={onClose}>✕</button>
        <div className="product-page-inner">
          <div className="product-page-img" style={{position:'relative'}}>
            {images.length > 0 ? (
              <>
                <img src={images[activeImg]} alt={product.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />

                {/* ✅ سهام التنقل */}
                {images.length > 1 && (
                  <>
                    <button onClick={prevImg} style={{
                      position:'absolute', top:'50%', left:'8px', transform:'translateY(-50%)',
                      background:'rgba(0,0,0,0.5)', color:'white', border:'none',
                      borderRadius:'50%', width:'36px', height:'36px', cursor:'pointer', fontSize:'18px', zIndex:10
                    }}>‹</button>
                    <button onClick={nextImg} style={{
                      position:'absolute', top:'50%', right:'8px', transform:'translateY(-50%)',
                      background:'rgba(0,0,0,0.5)', color:'white', border:'none',
                      borderRadius:'50%', width:'36px', height:'36px', cursor:'pointer', fontSize:'18px', zIndex:10
                    }}>›</button>

                    {/* ✅ نقاط */}
                    <div style={{position:'absolute', bottom:'70px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'6px'}}>
                      {images.map((_, i) => (
                        <div key={i} onClick={() => setActiveImg(i)} style={{
                          width:'8px', height:'8px', borderRadius:'50%', cursor:'pointer',
                          background: i === activeImg ? 'var(--gold)' : 'rgba(255,255,255,0.5)'
                        }} />
                      ))}
                    </div>

                    {/* ✅ صور مصغرة */}
                    <div style={{display:'flex', gap:'8px', padding:'8px', overflowX:'auto'}}>
                      {images.map((img, i) => (
                        <img key={i} src={img} alt="" onClick={() => setActiveImg(i)} style={{
                          width:'60px', height:'60px', objectFit:'cover', borderRadius:'4px',
                          cursor:'pointer', border: activeImg === i ? '2px solid var(--gold)' : '2px solid transparent',
                          flexShrink: 0
                        }} />
                      ))}
                    </div>
                  </>
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