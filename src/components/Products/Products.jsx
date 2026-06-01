import { useState, useEffect } from 'react'
import { getProducts } from '../../api'

function Products({ onAddToCart, onProductClick, lang, search = '', filter = '' }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts()
      .then(data => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = products.filter(p => {
    const name = lang === 'ar' ? p.name : (p.nameEn || p.name)
    const matchSearch = name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter ? p.cat === filter : true
    return matchSearch && matchFilter
  })

  if (loading) return (
    <div className="section" style={{textAlign:'center', padding:'3rem'}}>
      <div style={{color:'var(--gold)', fontSize:'18px'}}>جاري التحميل...</div>
    </div>
  )

  return (
    <div className="section">
      <div className="section-head">
        <div className="section-title">{lang === 'ar' ? '✦ أحدث المنتجات ✦' : '✦ Latest Products ✦'}</div>
        <div className="section-line"></div>
      </div>
      {filtered.length === 0 ? (
        <div className="cart-empty">
          <div style={{fontSize:'48px', marginBottom:'1rem'}}>🔍</div>
          <p>{lang === 'ar' ? 'مفيش منتجات' : 'No products found'}</p>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map((p, i) => (
            <div className="product-card" key={i} onClick={() => onProductClick(p)}>
              <div className="product-img" style={{position:'relative'}}>
                {p.image ? <img src={p.image} alt={p.name} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span className="product-placeholder">👘</span>}
                {p.badge && <div className="product-badge">{lang === 'ar' ? p.badge : (p.badgeEn || p.badge)}</div>}

                {/* ✅ مؤشر كذا صورة */}
                {p.images?.length > 0 && (
                  <div style={{
                    position:'absolute', bottom:'8px', left:'8px',
                    display:'flex', gap:'4px'
                  }}>
                    {[p.image, ...p.images].slice(0, 4).map((_, idx) => (
                      <div key={idx} style={{
                        width:'6px', height:'6px', borderRadius:'50%',
                        background: idx === 0 ? 'var(--gold)' : 'rgba(255,255,255,0.6)'
                      }} />
                    ))}
                  </div>
                )}
              </div>

              <div className="product-info">
                <div className="product-name">{lang === 'ar' ? p.name : (p.nameEn || p.name)}</div>
                <div>
                  {p.oldPrice && <span className="product-old">{p.oldPrice} {lang === 'ar' ? 'ج' : 'EGP'}</span>}
                  <span className="product-price">{p.price} {lang === 'ar' ? 'ج' : 'EGP'}</span>
                </div>

                {/* ✅ الألوان من برا */}
                {p.colors && (
                  <div style={{display:'flex', gap:'4px', flexWrap:'wrap', margin:'4px 0'}}>
                    {p.colors.split(',').map(c => c.trim()).filter(Boolean).slice(0, 4).map((c, idx) => (
                      <div key={idx} style={{
                        fontSize:'10px', padding:'1px 6px', borderRadius:'10px',
                        border:'1px solid var(--gold)', color:'var(--gold)'
                      }}>
                        {c}
                      </div>
                    ))}
                  </div>
                )}

                <button className="add-cart" onClick={(e) => { e.stopPropagation(); onAddToCart(p) }}>
                  {lang === 'ar' ? 'أضيفي للسلة' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products