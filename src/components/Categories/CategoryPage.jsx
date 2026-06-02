import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProducts } from '../../api'

function CategoryPage({ onAddToCart, onProductClick, lang, onBack }) {
  const { cat } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [cat])

  useEffect(() => {
    setLoading(true)
    getProducts()
      .then(data => {
        const all = Array.isArray(data) ? data : []
        const filtered = cat === '%D8%B9%D8%B1%D9%88%D8%B6' || decodeURIComponent(cat) === 'عروض'
          ? all.filter(p => p.oldPrice && p.oldPrice > p.price)
          : all.filter(p => p.cat === decodeURIComponent(cat))
        setProducts(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [cat])

  const catName = decodeURIComponent(cat)

  return (
    <div className="section">
      <div style={{ marginBottom: '16px' }}>
        <button onClick={onBack} style={{
          background: 'none', border: '1px solid var(--gold)', color: 'var(--gold)',
          padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px'
        }}>
          {lang === 'ar' ? '→ الرئيسية' : '→ Home'}
        </button>
      </div>

      <div className="section-head">
        <div className="section-title">✦ {catName} ✦</div>
        <div className="section-line"></div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gold)' }}>جاري التحميل...</div>
      ) : products.length === 0 ? (
        <div className="cart-empty">
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🔍</div>
          <p>{lang === 'ar' ? 'مفيش منتجات' : 'No products found'}</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p, i) => (
            <div className="product-card" key={i} onClick={() => onProductClick(p)}>
              <div className="product-img" style={{ position: 'relative' }}>
                {p.image
                  ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span className="product-placeholder">👘</span>}
                {p.badge && <div className="product-badge">{lang === 'ar' ? p.badge : (p.badgeEn || p.badge)}</div>}
                {p.images?.length > 0 && (
                  <div style={{ position: 'absolute', bottom: '8px', left: '8px', display: 'flex', gap: '4px' }}>
                    {[p.image, ...p.images].slice(0, 4).map((_, idx) => (
                      <div key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', background: idx === 0 ? 'var(--gold)' : 'rgba(255,255,255,0.6)' }} />
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
                {p.colors && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', margin: '4px 0' }}>
                    {p.colors.split(',').map(c => c.trim()).filter(Boolean).slice(0, 4).map((c, idx) => (
                      <div key={idx} style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '10px', border: '1px solid var(--gold)', color: 'var(--gold)' }}>
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

export default CategoryPage