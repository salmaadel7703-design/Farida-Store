import { useState, useEffect } from 'react'
import { getProducts, addProduct, updateProduct, deleteProduct, getOrders, uploadImage } from '../../api'

const defaultGovernorates = [
  { name: 'القاهرة', price: 35, days: '2-3' },
  { name: 'الجيزة', price: 35, days: '2-3' },
  { name: 'الإسكندرية', price: 45, days: '3-4' },
  { name: 'المنصورة', price: 50, days: '3-5' },
  { name: 'أسيوط', price: 60, days: '4-6' },
  { name: 'سوهاج', price: 60, days: '4-6' },
  { name: 'الأقصر', price: 65, days: '5-7' },
  { name: 'أسوان', price: 65, days: '5-7' },
  { name: 'الفيوم', price: 50, days: '3-5' },
  { name: 'طنطا', price: 45, days: '3-4' },
]

function Admin({ onClose }) {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('products')
  const [editing, setEditing] = useState(null)
  const [newProduct, setNewProduct] = useState({ name: '', nameEn: '', price: '', oldPrice: '', badge: '', badgeEn: '', cat: 'بيجامات', stock: '', image: '' })
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [governorates, setGovernorates] = useState(() => {
    const saved = localStorage.getItem('governorates')
    return saved ? JSON.parse(saved) : defaultGovernorates
  })
  const [editingGov, setEditingGov] = useState(null)

  useEffect(() => {
    getProducts()
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
    getOrders()
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
  }, [])

  const handleImageUpload = async (e, isEdit = false) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const res = await uploadImage(file)
    if (isEdit) {
      setEditing({ ...editing, image: res.url })
    } else {
      setNewProduct({ ...newProduct, image: res.url })
    }
    setUploading(false)
  }

  const handleDelete = async (id) => {
    await deleteProduct(id)
    setProducts(products.filter(p => p._id !== id))
  }

  const handleSaveEdit = async () => {
    const updated = await updateProduct(editing._id, editing)
    setProducts(products.map(p => p._id === updated._id ? updated : p))
    setEditing(null)
  }

  const handleAdd = async () => {
    const product = await addProduct({
      ...newProduct,
      price: Number(newProduct.price),
      oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : null,
      stock: Number(newProduct.stock)
    })
    setProducts([...products, product])
    setNewProduct({ name: '', nameEn: '', price: '', oldPrice: '', badge: '', badgeEn: '', cat: 'بيجامات', stock: '', image: '' })
    setShowAdd(false)
  }

  const saveGovernorates = (updated) => {
    setGovernorates(updated)
    localStorage.setItem('governorates', JSON.stringify(updated))
    setEditingGov(null)
  }

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="admin-panel">
        <div className="admin-header">
          <div className="auth-logo">لوحة التحكم</div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

        <div className="admin-tabs">
          <button className={`auth-tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>المنتجات</button>
          <button className={`auth-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>الطلبات</button>
          <button className={`auth-tab ${tab === 'shipping' ? 'active' : ''}`} onClick={() => setTab('shipping')}>الشحن</button>
        </div>

        {tab === 'products' && (
          <div>
            <button className="admin-add-btn" onClick={() => setShowAdd(!showAdd)}>+ إضافة منتج جديد</button>

            {showAdd && (
              <div className="admin-form">
                <div className="admin-row">
                  <input className="auth-input" placeholder="اسم المنتج عربي" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  <input className="auth-input" placeholder="اسم المنتج انجليزي" value={newProduct.nameEn} onChange={e => setNewProduct({...newProduct, nameEn: e.target.value})} />
                </div>
                <div className="admin-row">
                  <input className="auth-input" placeholder="السعر" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  <input className="auth-input" placeholder="السعر القديم" value={newProduct.oldPrice} onChange={e => setNewProduct({...newProduct, oldPrice: e.target.value})} />
                </div>
                <div className="admin-row">
                  <input className="auth-input" placeholder="البادج عربي (مثلاً: جديد)" value={newProduct.badge} onChange={e => setNewProduct({...newProduct, badge: e.target.value})} />
                  <input className="auth-input" placeholder="البادج انجليزي (مثلاً: New)" value={newProduct.badgeEn} onChange={e => setNewProduct({...newProduct, badgeEn: e.target.value})} />
                </div>
                <div className="admin-row">
                  <input className="auth-input" placeholder="الكمية" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                  <select className="auth-input" value={newProduct.cat} onChange={e => setNewProduct({...newProduct, cat: e.target.value})}>
                    <option>بيجامات</option>
                    <option>كاشات</option>
                    <option>لانجيري</option>
                  </select>
                </div>
                <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'4px'}}>صورة المنتج</div>
                <input type="file" accept="image/*" className="auth-input" onChange={e => handleImageUpload(e)} />
                {uploading && <div style={{color:'var(--gold)', fontSize:'12px'}}>جاري رفع الصورة...</div>}
                {newProduct.image && <img src={newProduct.image} alt="preview" style={{width:'100px', height:'100px', objectFit:'cover', borderRadius:'4px'}} />}
                <button className="auth-btn" onClick={handleAdd} disabled={uploading}>إضافة المنتج</button>
              </div>
            )}

            {loading ? (
              <div className="admin-empty">جاري التحميل...</div>
            ) : (
              <div className="admin-products">
                {products.map(p => (
                  <div className="admin-product-row" key={p._id}>
                    {editing?._id === p._id ? (
                      <div className="admin-form">
                        <div className="admin-row">
                          <input className="auth-input" placeholder="الاسم عربي" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} />
                          <input className="auth-input" placeholder="الاسم انجليزي" value={editing.nameEn || ''} onChange={e => setEditing({...editing, nameEn: e.target.value})} />
                        </div>
                        <div className="admin-row">
                          <input className="auth-input" placeholder="السعر" value={editing.price} onChange={e => setEditing({...editing, price: Number(e.target.value)})} />
                          <input className="auth-input" placeholder="الكمية" value={editing.stock} onChange={e => setEditing({...editing, stock: Number(e.target.value)})} />
                        </div>
                        <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'4px'}}>تغيير الصورة</div>
                        <input type="file" accept="image/*" className="auth-input" onChange={e => handleImageUpload(e, true)} />
                        {uploading && <div style={{color:'var(--gold)', fontSize:'12px'}}>جاري رفع الصورة...</div>}
                        {editing.image && <img src={editing.image} alt="preview" style={{width:'100px', height:'100px', objectFit:'cover', borderRadius:'4px'}} />}
                        <div className="admin-row">
                          <button className="auth-btn" style={{flex:1}} onClick={handleSaveEdit}>حفظ</button>
                          <button className="checkout-back" style={{flex:1}} onClick={() => setEditing(null)}>إلغاء</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="admin-product-info" style={{display:'flex', alignItems:'center', gap:'12px'}}>
                          {p.image && <img src={p.image} alt={p.name} style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'4px'}} />}
                          <div>
                            <div className="admin-product-name">{p.name}</div>
                            <div className="admin-product-meta">{p.cat} · {p.price} ج · كمية: {p.stock}</div>
                          </div>
                        </div>
                        <div className="admin-product-actions">
                          <button className="admin-edit-btn" onClick={() => setEditing(p)}>تعديل</button>
                          <button className="admin-delete-btn" onClick={() => handleDelete(p._id)}>حذف</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="admin-empty">
                <div style={{fontSize:'48px', marginBottom:'1rem'}}>📦</div>
                <p>مفيش طلبات لسه</p>
              </div>
            ) : (
              <div className="admin-products">
                {orders.map(o => (
                  <div className="admin-product-row" key={o._id}>
                    <div className="admin-product-info">
                      <div className="admin-product-name">{o.name} — {o.governorate}</div>
                      <div className="admin-product-meta">
                        📱 {o.phone} · {o.total} ج · {o.payMethod === 'cod' ? 'عند الاستلام' : 'فودافون كاش'}
                      </div>
                      {o.payMethod === 'vodafone' && (
                        <div className="admin-product-meta" style={{color:'#ff6b6b'}}>
                          محفظة: {o.vodafonePhone} · دفع: {o.paidAmount} ج
                        </div>
                      )}
                      <div className="admin-product-meta" style={{color:'var(--gold)'}}>
                        كود: {o.trackCode} · {o.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'shipping' && (
          <div className="admin-products">
            {governorates.map((g, i) => (
              <div className="admin-product-row" key={g.name}>
                {editingGov === i ? (
                  <div className="admin-form" style={{width:'100%'}}>
                    <div className="admin-row">
                      <input className="auth-input" placeholder="السعر" type="number" value={g.price} onChange={e => {
                        const updated = [...governorates]
                        updated[i] = {...updated[i], price: Number(e.target.value)}
                        setGovernorates(updated)
                      }} />
                      <input className="auth-input" placeholder="الأيام (مثلاً: 2-3)" value={g.days} onChange={e => {
                        const updated = [...governorates]
                        updated[i] = {...updated[i], days: e.target.value}
                        setGovernorates(updated)
                      }} />
                    </div>
                    <div className="admin-row">
                      <button className="auth-btn" style={{flex:1}} onClick={() => saveGovernorates(governorates)}>حفظ</button>
                      <button className="checkout-back" style={{flex:1}} onClick={() => setEditingGov(null)}>إلغاء</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="admin-product-info">
                      <div className="admin-product-name">{g.name}</div>
                      <div className="admin-product-meta">{g.price} ج · {g.days} أيام</div>
                    </div>
                    <button className="admin-edit-btn" onClick={() => setEditingGov(i)}>تعديل</button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Admin