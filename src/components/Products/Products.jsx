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
              <div className="product-img">
                {p.image ? <img src={p.image} alt={p.name} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span className="product-placeholder">👘</span>}
                {p.badge && <div className="product-badge">{lang === 'ar' ? p.badge : (p.badgeEn || p.badge)}</div>}
              </div>
              <div className="product-info">
                <div className="product-name">{lang === 'ar' ? p.name : (p.nameEn || p.name)}</div>
                <div>
                  {p.oldPrice && <span className="product-old">{p.oldPrice} {lang === 'ar' ? 'ج' : 'EGP'}</span>}
                  <span className="product-price">{p.price} {lang === 'ar' ? 'ج' : 'EGP'}</span>
                </div>
                <button className="add-cart" onClick={(e) => { e.stopPropagation(); onAddToCart(p) }}>
                  {lang === 'ar' ? 'أضيفي للكارت' : 'Add to Cart'}
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