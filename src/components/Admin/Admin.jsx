import { useState, useEffect } from 'react'
import { getProducts, addProduct, updateProduct, deleteProduct, getOrders, uploadImage, getSlides, addSlide, deleteSlide, getOffers, addOffer, deleteOffer, getCoupons, addCoupon, deleteCoupon, toggleCoupon } from '../../api'

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
  const [slides, setSlides] = useState([])
  const [offers, setOffers] = useState([])
  const [coupons, setCoupons] = useState([])
  const [tab, setTab] = useState('products')
  const [editing, setEditing] = useState(null)
  const [newProduct, setNewProduct] = useState({ name: '', nameEn: '', price: '', oldPrice: '', badge: '', badgeEn: '', cat: 'بيجامات', stock: '', image: '', images: [], colors: '', sizes: '' })
  const [newSlide, setNewSlide] = useState({ tag: '', title: '', titleGold: '', sub: '', btn: '', image: '' })
  const [newOffer, setNewOffer] = useState({ title: '', discount: '', sub: '', image: '' })
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', type: 'percent', maxUses: 100 })
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
    getSlides()
      .then(data => setSlides(Array.isArray(data) ? data : []))
      .catch(() => setSlides([]))
    getOffers()
      .then(data => setOffers(Array.isArray(data) ? data : []))
      .catch(() => setOffers([]))
    getCoupons()
      .then(data => setCoupons(Array.isArray(data) ? data : []))
      .catch(() => setCoupons([]))
  }, [])

  const handleImageUpload = async (e, target = 'product', isEdit = false, isExtra = false) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const res = await uploadImage(file)
    if (target === 'product') {
      if (isExtra) {
        if (isEdit) setEditing({ ...editing, images: [...(editing.images || []), res.url] })
        else setNewProduct({ ...newProduct, images: [...(newProduct.images || []), res.url] })
      } else {
        if (isEdit) setEditing({ ...editing, image: res.url })
        else setNewProduct({ ...newProduct, image: res.url })
      }
    } else if (target === 'slide') {
      setNewSlide({ ...newSlide, image: res.url })
    } else if (target === 'offer') {
      setNewOffer({ ...newOffer, image: res.url })
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
    setNewProduct({ name: '', nameEn: '', price: '', oldPrice: '', badge: '', badgeEn: '', cat: 'بيجامات', stock: '', image: '', images: [], colors: '', sizes: '' })
    setShowAdd(false)
  }

  const handleAddSlide = async () => {
    const slide = await addSlide(newSlide)
    setSlides([...slides, slide])
    setNewSlide({ tag: '', title: '', titleGold: '', sub: '', btn: '', image: '' })
  }

  const handleDeleteSlide = async (id) => {
    await deleteSlide(id)
    setSlides(slides.filter(s => s._id !== id))
  }

  const handleAddOffer = async () => {
    const offer = await addOffer(newOffer)
    setOffers([...offers, offer])
    setNewOffer({ title: '', discount: '', sub: '', image: '' })
  }

  const handleDeleteOffer = async (id) => {
    await deleteOffer(id)
    setOffers(offers.filter(o => o._id !== id))
  }

  // ✅ الكوبونات
  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount) return
    const coupon = await addCoupon({
      ...newCoupon,
      code: newCoupon.code.toUpperCase(),
      discount: Number(newCoupon.discount),
      maxUses: Number(newCoupon.maxUses),
    })
    setCoupons([coupon, ...coupons])
    setNewCoupon({ code: '', discount: '', type: 'percent', maxUses: 100 })
  }

  const handleDeleteCoupon = async (id) => {
    await deleteCoupon(id)
    setCoupons(coupons.filter(c => c._id !== id))
  }

  const handleToggleCoupon = async (id, active) => {
    const updated = await toggleCoupon(id, !active)
    setCoupons(coupons.map(c => c._id === updated._id ? updated : c))
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

        <div className="admin-tabs" style={{flexWrap:'wrap'}}>
          <button className={`auth-tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>المنتجات</button>
          <button className={`auth-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>الطلبات</button>
          <button className={`auth-tab ${tab === 'slides' ? 'active' : ''}`} onClick={() => setTab('slides')}>السلايدر</button>
          <button className={`auth-tab ${tab === 'offers' ? 'active' : ''}`} onClick={() => setTab('offers')}>العروض</button>
          <button className={`auth-tab ${tab === 'shipping' ? 'active' : ''}`} onClick={() => setTab('shipping')}>الشحن</button>
          <button className={`auth-tab ${tab === 'coupons' ? 'active' : ''}`} onClick={() => setTab('coupons')}>🎫 كوبونات</button>
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
                <input className="auth-input" placeholder="الألوان مفصولة بفاصلة (مثلاً: أحمر, أسود, بيج)" value={newProduct.colors} onChange={e => setNewProduct({...newProduct, colors: e.target.value})} />
                <input className="auth-input" placeholder="المقاسات مفصولة بفاصلة (مثلاً: S, M, L)" value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} />
                <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'4px'}}>الصورة الرئيسية</div>
                <input type="file" accept="image/*" className="auth-input" onChange={e => handleImageUpload(e, 'product')} />
                {newProduct.image && <img src={newProduct.image} alt="preview" style={{width:'100px', height:'100px', objectFit:'cover', borderRadius:'4px'}} />}
                <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'4px'}}>صور إضافية</div>
                <input type="file" accept="image/*" className="auth-input" onChange={e => handleImageUpload(e, 'product', false, true)} />
                <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  {newProduct.images?.map((img, i) => (
                    <img key={i} src={img} alt="" style={{width:'60px', height:'60px', objectFit:'cover', borderRadius:'4px'}} />
                  ))}
                </div>
                {uploading && <div style={{color:'var(--gold)', fontSize:'12px'}}>جاري رفع الصورة...</div>}
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
                        <input className="auth-input" placeholder="الألوان مفصولة بفاصلة" value={editing.colors || ''} onChange={e => setEditing({...editing, colors: e.target.value})} />
                        <input className="auth-input" placeholder="المقاسات مفصولة بفاصلة" value={editing.sizes || ''} onChange={e => setEditing({...editing, sizes: e.target.value})} />
                        <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'4px'}}>تغيير الصورة الرئيسية</div>
                        <input type="file" accept="image/*" className="auth-input" onChange={e => handleImageUpload(e, 'product', true)} />
                        {editing.image && <img src={editing.image} alt="preview" style={{width:'100px', height:'100px', objectFit:'cover', borderRadius:'4px'}} />}
                        <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'4px'}}>إضافة صور إضافية</div>
                        <input type="file" accept="image/*" className="auth-input" onChange={e => handleImageUpload(e, 'product', true, true)} />
                        <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                          {editing.images?.map((img, i) => (
                            <div key={i} style={{position:'relative'}}>
                              <img src={img} alt="" style={{width:'60px', height:'60px', objectFit:'cover', borderRadius:'4px'}} />
                              <button onClick={() => setEditing({...editing, images: editing.images.filter((_, j) => j !== i)})} style={{position:'absolute', top:'-6px', right:'-6px', background:'red', color:'white', border:'none', borderRadius:'50%', width:'18px', height:'18px', cursor:'pointer', fontSize:'10px'}}>✕</button>
                            </div>
                          ))}
                        </div>
                        {uploading && <div style={{color:'var(--gold)', fontSize:'12px'}}>جاري رفع الصورة...</div>}
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
                            {p.colors && <div className="admin-product-meta">🎨 {p.colors}</div>}
                            {p.sizes && <div className="admin-product-meta">📐 {p.sizes}</div>}
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
                      <div className="admin-product-meta">📱 {o.phone} · {o.total} ج · {o.payMethod === 'cod' ? 'عند الاستلام' : 'فودافون كاش'}</div>
                      {o.payMethod === 'vodafone' && (
                        <div className="admin-product-meta" style={{color:'#ff6b6b'}}>محفظة: {o.vodafonePhone} · دفع: {o.paidAmount} ج</div>
                      )}
                      {o.discount > 0 && (
                        <div className="admin-product-meta" style={{color:'#4caf50'}}>🎫 كوبون: {o.coupon} · خصم: {o.discount} ج</div>
                      )}
                      <div className="admin-product-meta" style={{color:'var(--gold)'}}>كود: {o.trackCode} · {o.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'slides' && (
          <div>
            <div className="admin-form">
              <input className="auth-input" placeholder="التاق (مثلاً: ✦ كولكشن جديد ✦)" value={newSlide.tag} onChange={e => setNewSlide({...newSlide, tag: e.target.value})} />
              <div className="admin-row">
                <input className="auth-input" placeholder="العنوان" value={newSlide.title} onChange={e => setNewSlide({...newSlide, title: e.target.value})} />
                <input className="auth-input" placeholder="العنوان الذهبي" value={newSlide.titleGold} onChange={e => setNewSlide({...newSlide, titleGold: e.target.value})} />
              </div>
              <input className="auth-input" placeholder="الوصف" value={newSlide.sub} onChange={e => setNewSlide({...newSlide, sub: e.target.value})} />
              <input className="auth-input" placeholder="نص الزرار" value={newSlide.btn} onChange={e => setNewSlide({...newSlide, btn: e.target.value})} />
              <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'4px'}}>صورة الخلفية</div>
              <input type="file" accept="image/*" className="auth-input" onChange={e => handleImageUpload(e, 'slide')} />
              {uploading && <div style={{color:'var(--gold)', fontSize:'12px'}}>جاري رفع الصورة...</div>}
              {newSlide.image && <img src={newSlide.image} alt="preview" style={{width:'100px', height:'60px', objectFit:'cover', borderRadius:'4px'}} />}
              <button className="auth-btn" onClick={handleAddSlide} disabled={uploading}>إضافة سلايد</button>
            </div>
            <div className="admin-products">
              {slides.map(s => (
                <div className="admin-product-row" key={s._id}>
                  <div className="admin-product-info">
                    {s.image && <img src={s.image} alt={s.title} style={{width:'60px', height:'40px', objectFit:'cover', borderRadius:'4px', marginBottom:'4px'}} />}
                    <div className="admin-product-name">{s.title} {s.titleGold}</div>
                    <div className="admin-product-meta">{s.tag}</div>
                  </div>
                  <button className="admin-delete-btn" onClick={() => handleDeleteSlide(s._id)}>حذف</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'offers' && (
          <div>
            <div className="admin-form">
              <input className="auth-input" placeholder="عنوان العرض" value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})} />
              <input className="auth-input" placeholder="نسبة الخصم (مثلاً: خصم 50%)" value={newOffer.discount} onChange={e => setNewOffer({...newOffer, discount: e.target.value})} />
              <input className="auth-input" placeholder="الوصف" value={newOffer.sub} onChange={e => setNewOffer({...newOffer, sub: e.target.value})} />
              <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'4px'}}>صورة العرض</div>
              <input type="file" accept="image/*" className="auth-input" onChange={e => handleImageUpload(e, 'offer')} />
              {uploading && <div style={{color:'var(--gold)', fontSize:'12px'}}>جاري رفع الصورة...</div>}
              {newOffer.image && <img src={newOffer.image} alt="preview" style={{width:'100px', height:'60px', objectFit:'cover', borderRadius:'4px'}} />}
              <button className="auth-btn" onClick={handleAddOffer} disabled={uploading}>إضافة عرض</button>
            </div>
            <div className="admin-products">
              {offers.map(o => (
                <div className="admin-product-row" key={o._id}>
                  <div className="admin-product-info">
                    {o.image && <img src={o.image} alt={o.title} style={{width:'60px', height:'40px', objectFit:'cover', borderRadius:'4px', marginBottom:'4px'}} />}
                    <div className="admin-product-name">{o.title}</div>
                    <div className="admin-product-meta">{o.discount}</div>
                  </div>
                  <button className="admin-delete-btn" onClick={() => handleDeleteOffer(o._id)}>حذف</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ تبويب الكوبونات */}
        {tab === 'coupons' && (
          <div>
            <div className="admin-form">
              <div className="admin-row">
                <input
                  className="auth-input"
                  placeholder="كود الكوبون (مثلاً: FARIDA20)"
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  style={{textTransform:'uppercase'}}
                />
                <input
                  className="auth-input"
                  placeholder="قيمة الخصم"
                  type="number"
                  value={newCoupon.discount}
                  onChange={e => setNewCoupon({...newCoupon, discount: e.target.value})}
                />
              </div>
              <div className="admin-row">
                <select className="auth-input" value={newCoupon.type} onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}>
                  <option value="percent">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (ج)</option>
                </select>
                <input
                  className="auth-input"
                  placeholder="أقصى عدد استخدامات"
                  type="number"
                  value={newCoupon.maxUses}
                  onChange={e => setNewCoupon({...newCoupon, maxUses: e.target.value})}
                />
              </div>
              <button className="auth-btn" onClick={handleAddCoupon} disabled={!newCoupon.code || !newCoupon.discount}>
                إضافة كوبون
              </button>
            </div>

            <div className="admin-products">
              {coupons.length === 0 ? (
                <div className="admin-empty">
                  <div style={{fontSize:'48px', marginBottom:'1rem'}}>🎫</div>
                  <p>مفيش كوبونات لسه</p>
                </div>
              ) : (
                coupons.map(c => (
                  <div className="admin-product-row" key={c._id}>
                    <div className="admin-product-info">
                      <div className="admin-product-name" style={{letterSpacing:'2px'}}>{c.code}</div>
                      <div className="admin-product-meta">
                        خصم {c.type === 'percent' ? `${c.discount}%` : `${c.discount} ج`} · استُخدم {c.usedCount}/{c.maxUses}
                      </div>
                      <div style={{
                        display:'inline-block', marginTop:'4px',
                        padding:'2px 10px', borderRadius:'20px', fontSize:'11px',
                        background: c.active ? '#1a3a1a' : '#3a1a1a',
                        color: c.active ? '#4caf50' : '#f44336'
                      }}>
                        {c.active ? '● فعال' : '● منتهي'}
                      </div>
                    </div>
                    <div className="admin-product-actions">
                      <button
                        className="admin-edit-btn"
                        onClick={() => handleToggleCoupon(c._id, c.active)}
                        style={{background: c.active ? '#3a1a1a' : '#1a3a1a', color: c.active ? '#f44336' : '#4caf50'}}
                      >
                        {c.active ? 'إيقاف' : 'تفعيل'}
                      </button>
                      <button className="admin-delete-btn" onClick={() => handleDeleteCoupon(c._id)}>حذف</button>
                    </div>
                  </div>
                ))
              )}
            </div>
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