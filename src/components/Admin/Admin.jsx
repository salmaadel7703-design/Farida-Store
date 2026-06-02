import { useState, useEffect } from 'react'
import { getProducts, addProduct, updateProduct, deleteProduct, getOrders, uploadImage, getSlides, addSlide, deleteSlide, getOffers, addOffer, deleteOffer, getCoupons, addCoupon, deleteCoupon, toggleCoupon, updateOrder, deleteOrder, makeAdmin, getBundles, addBundle, deleteBundle } from '../../api'

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

const STATUS_STEPS = ['جاري التجهيز', 'جاري الشحن', 'تم التوصيل']

const statusColor = (status) => {
  if (status === 'تم التوصيل') return '#4caf50'
  if (status === 'جاري الشحن') return '#ff9800'
  return 'var(--gold)'
}

const subCatOptions = {
  'بيجامات': ['بنطلون', 'برمودا', 'هوت شورت'],
  'كاشات': ['طويل', 'قصير'],
  'لانجيري': [],
}

const ImgThumb = ({ src, onRemove }) => (
  <div style={{position:'relative'}}>
    <img src={src} alt="" style={{width:'60px', height:'60px', objectFit:'cover', borderRadius:'4px'}} />
    <button onClick={onRemove} style={{position:'absolute', top:'-6px', right:'-6px', background:'red', color:'white', border:'none', borderRadius:'50%', width:'18px', height:'18px', cursor:'pointer', fontSize:'10px'}}>✕</button>
  </div>
)

function Admin({ onClose }) {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [slides, setSlides] = useState([])
  const [offers, setOffers] = useState([])
  const [coupons, setCoupons] = useState([])
  const [bundles, setBundles] = useState([])
  const [tab, setTab] = useState('products')
  const [editing, setEditing] = useState(null)
  const [newProduct, setNewProduct] = useState({ name: '', nameEn: '', price: '', oldPrice: '', badge: '', badgeEn: '', cat: 'بيجامات', subCat: '', stock: '', image: '', images: [], colors: '', sizes: '' })
  const [newSlide, setNewSlide] = useState({ tag: '', title: '', titleGold: '', sub: '', btn: '', image: '' })
  const [newOffer, setNewOffer] = useState({ title: '', discount: '', sub: '', image: '' })
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', type: 'percent', maxUses: 100 })
  const [newBundle, setNewBundle] = useState({ title: '', titleEn: '', bundlePrice: '', selectedProducts: [] })
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [governorates, setGovernorates] = useState(() => {
    const saved = localStorage.getItem('governorates')
    return saved ? JSON.parse(saved) : defaultGovernorates
  })
  const [editingGov, setEditingGov] = useState(null)
  const [catImages, setCatImages] = useState(() => {
    const saved = localStorage.getItem('catImages')
    return saved ? JSON.parse(saved) : {}
  })
  const [adminEmail, setAdminEmail] = useState('')
  const [adminMsg, setAdminMsg] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)

  useEffect(() => {
    getProducts().then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false) }).catch(() => setLoading(false))
    getOrders().then(data => setOrders(Array.isArray(data) ? data : [])).catch(() => setOrders([]))
    getSlides().then(data => setSlides(Array.isArray(data) ? data : [])).catch(() => setSlides([]))
    getOffers().then(data => setOffers(Array.isArray(data) ? data : [])).catch(() => setOffers([]))
    getCoupons().then(data => setCoupons(Array.isArray(data) ? data : [])).catch(() => setCoupons([]))
    getBundles().then(data => setBundles(Array.isArray(data) ? data : [])).catch(() => setBundles([]))
  }, [])

  const handleImageUpload = async (e, target = 'product', isEdit = false, isExtra = false) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const res = await uploadImage(file)
    if (target === 'product') {
      if (isExtra) {
        if (isEdit) setEditing(prev => ({ ...prev, images: [...(prev.images || []), res.url] }))
        else setNewProduct(prev => ({ ...prev, images: [...(prev.images || []), res.url] }))
      } else {
        if (isEdit) setEditing(prev => ({ ...prev, image: res.url }))
        else setNewProduct(prev => ({ ...prev, image: res.url }))
      }
    } else if (target === 'slide') {
      setNewSlide(prev => ({ ...prev, image: res.url }))
    } else if (target === 'offer') {
      setNewOffer(prev => ({ ...prev, image: res.url }))
    }
    setUploading(false)
  }

  const handleDelete = async (id) => { await deleteProduct(id); setProducts(products.filter(p => p._id !== id)) }
  const handleSaveEdit = async () => {
    const updated = await updateProduct(editing._id, editing)
    setProducts(products.map(p => p._id === updated._id ? updated : p))
    setEditing(null)
  }
  const handleAdd = async () => {
    const product = await addProduct({ ...newProduct, price: Number(newProduct.price), oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : null, stock: Number(newProduct.stock) })
    setProducts([...products, product])
    setNewProduct({ name: '', nameEn: '', price: '', oldPrice: '', badge: '', badgeEn: '', cat: 'بيجامات', subCat: '', stock: '', image: '', images: [], colors: '', sizes: '' })
    setShowAdd(false)
  }
  const handleAddSlide = async () => { const slide = await addSlide(newSlide); setSlides([...slides, slide]); setNewSlide({ tag: '', title: '', titleGold: '', sub: '', btn: '', image: '' }) }
  const handleDeleteSlide = async (id) => { await deleteSlide(id); setSlides(slides.filter(s => s._id !== id)) }
  const handleAddOffer = async () => { const offer = await addOffer(newOffer); setOffers([...offers, offer]); setNewOffer({ title: '', discount: '', sub: '', image: '' }) }
  const handleDeleteOffer = async (id) => { await deleteOffer(id); setOffers(offers.filter(o => o._id !== id)) }
  const handleNextStatus = async (order) => {
    const currentIndex = STATUS_STEPS.indexOf(order.status)
    if (currentIndex === STATUS_STEPS.length - 1) return
    const updated = await updateOrder(order._id, { status: STATUS_STEPS[currentIndex + 1] })
    setOrders(orders.map(o => o._id === updated._id ? updated : o))
  }
  const handleDeleteOrder = async (id) => { await deleteOrder(id); setOrders(orders.filter(o => o._id !== id)) }
  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount) return
    const coupon = await addCoupon({ ...newCoupon, code: newCoupon.code.toUpperCase(), discount: Number(newCoupon.discount), maxUses: Number(newCoupon.maxUses) })
    setCoupons([coupon, ...coupons])
    setNewCoupon({ code: '', discount: '', type: 'percent', maxUses: 100 })
  }
  const handleDeleteCoupon = async (id) => { await deleteCoupon(id); setCoupons(coupons.filter(c => c._id !== id)) }
  const handleToggleCoupon = async (id, active) => { const updated = await toggleCoupon(id, !active); setCoupons(coupons.map(c => c._id === updated._id ? updated : c)) }
  const saveGovernorates = (updated) => { setGovernorates(updated); localStorage.setItem('governorates', JSON.stringify(updated)); setEditingGov(null) }

  const handleAddBundle = async () => {
    if (!newBundle.title || !newBundle.bundlePrice || newBundle.selectedProducts.length === 0) return
    const bundle = await addBundle({ title: newBundle.title, titleEn: newBundle.titleEn, bundlePrice: Number(newBundle.bundlePrice), products: newBundle.selectedProducts })
    setBundles([bundle, ...bundles])
    setNewBundle({ title: '', titleEn: '', bundlePrice: '', selectedProducts: [] })
  }
  const handleDeleteBundle = async (id) => { await deleteBundle(id); setBundles(bundles.filter(b => b._id !== id)) }
  const toggleBundleProduct = (id) => {
    setNewBundle(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(id)
        ? prev.selectedProducts.filter(p => p !== id)
        : [...prev.selectedProducts, id]
    }))
  }

  const handleMakeAdmin = async () => {
    if (!adminEmail.trim()) return
    setAdminLoading(true)
    setAdminMsg('')
    try {
      const res = await makeAdmin(adminEmail.trim())
      if (res.user) {
        setAdminMsg(`✅ تم! ${res.user.email} أصبح أدمن`)
        setAdminEmail('')
      } else {
        setAdminMsg('❌ مفيش يوزر بالإيميل ده')
      }
    } catch {
      setAdminMsg('❌ في مشكلة، حاولي تاني')
    }
    setAdminLoading(false)
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
          <button className={`auth-tab ${tab === 'bundles' ? 'active' : ''}`} onClick={() => setTab('bundles')}>🎁 باندل</button>
          <button className={`auth-tab ${tab === 'shipping' ? 'active' : ''}`} onClick={() => setTab('shipping')}>الشحن</button>
          <button className={`auth-tab ${tab === 'coupons' ? 'active' : ''}`} onClick={() => setTab('coupons')}>🎫 كوبونات</button>
          <button className={`auth-tab ${tab === 'admins' ? 'active' : ''}`} onClick={() => setTab('admins')}>👥 مشرفين</button>
          <button className={`auth-tab ${tab === 'categories' ? 'active' : ''}`} onClick={() => setTab('categories')}>🖼️ الأقسام</button>
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
                  <input className="auth-input" placeholder="البادج عربي" value={newProduct.badge} onChange={e => setNewProduct({...newProduct, badge: e.target.value})} />
                  <input className="auth-input" placeholder="البادج انجليزي" value={newProduct.badgeEn} onChange={e => setNewProduct({...newProduct, badgeEn: e.target.value})} />
                </div>
                <div className="admin-row">
                  <input className="auth-input" placeholder="الكمية" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                  <select className="auth-input" value={newProduct.cat} onChange={e => setNewProduct({...newProduct, cat: e.target.value, subCat: ''})}>
                    <option>بيجامات</option><option>كاشات</option><option>لانجيري</option>
                  </select>
                </div>
                {subCatOptions[newProduct.cat]?.length > 0 && (
                  <select className="auth-input" value={newProduct.subCat} onChange={e => setNewProduct({...newProduct, subCat: e.target.value})}>
                    <option value="">-- النوع (اختياري) --</option>
                    {subCatOptions[newProduct.cat].map(s => <option key={s}>{s}</option>)}
                  </select>
                )}
                <input className="auth-input" placeholder="الألوان مفصولة بفاصلة" value={newProduct.colors} onChange={e => setNewProduct({...newProduct, colors: e.target.value})} />
                <input className="auth-input" placeholder="المقاسات مفصولة بفاصلة" value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} />
                <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'4px'}}>الصورة الرئيسية</div>
                <input type="file" accept="image/*" className="auth-input" onChange={e => handleImageUpload(e, 'product')} />
                {newProduct.image && <ImgThumb src={newProduct.image} onRemove={() => setNewProduct({...newProduct, image: ''})} />}
                <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'4px'}}>صور إضافية</div>
                <input type="file" accept="image/*" className="auth-input" onChange={e => handleImageUpload(e, 'product', false, true)} />
                <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  {newProduct.images?.map((img, i) => (
                    <ImgThumb key={i} src={img} onRemove={() => setNewProduct({...newProduct, images: newProduct.images.filter((_, j) => j !== i)})} />
                  ))}
                </div>
                {uploading && <div style={{color:'var(--gold)', fontSize:'12px'}}>جاري رفع الصورة...</div>}
                <button className="auth-btn" onClick={handleAdd} disabled={uploading}>إضافة المنتج</button>
              </div>
            )}
            {loading ? <div className="admin-empty">جاري التحميل...</div> : (
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
                        {subCatOptions[editing.cat]?.length > 0 && (
                          <select className="auth-input" value={editing.subCat || ''} onChange={e => setEditing({...editing, subCat: e.target.value})}>
                            <option value="">-- النوع (اختياري) --</option>
                            {subCatOptions[editing.cat].map(s => <option key={s}>{s}</option>)}
                          </select>
                        )}
                        <input className="auth-input" placeholder="الألوان مفصولة بفاصلة" value={editing.colors || ''} onChange={e => setEditing({...editing, colors: e.target.value})} />
                        <input className="auth-input" placeholder="المقاسات مفصولة بفاصلة" value={editing.sizes || ''} onChange={e => setEditing({...editing, sizes: e.target.value})} />
                        <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'4px'}}>تغيير الصورة الرئيسية</div>
                        <input type="file" accept="image/*" className="auth-input" onChange={e => handleImageUpload(e, 'product', true)} />
                        {editing.image && <ImgThumb src={editing.image} onRemove={() => setEditing({...editing, image: ''})} />}
                        <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'4px'}}>إضافة صور إضافية</div>
                        <input type="file" accept="image/*" className="auth-input" onChange={e => handleImageUpload(e, 'product', true, true)} />
                        <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                          {editing.images?.map((img, i) => (
                            <ImgThumb key={i} src={img} onRemove={() => setEditing({...editing, images: editing.images.filter((_, j) => j !== i)})} />
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
                            <div className="admin-product-meta">{p.cat} {p.subCat ? `· ${p.subCat}` : ''} · {p.price} ج · كمية: {p.stock}</div>
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
              <div className="admin-empty"><div style={{fontSize:'48px', marginBottom:'1rem'}}>📦</div><p>مفيش طلبات لسه</p></div>
            ) : (
              <div className="admin-products">
                {orders.map(o => (
                  <div className="admin-product-row" key={o._id} style={{flexDirection:'column', alignItems:'flex-start', gap:'10px'}}>
                    <div className="admin-product-info" style={{width:'100%'}}>
                      <div className="admin-product-name">{o.name} — {o.governorate}</div>
                      <div className="admin-product-meta">📱 {o.phone} · {o.total} ج · {o.payMethod === 'cod' ? 'عند الاستلام' : 'فودافون كاش'}</div>
                      {o.payMethod === 'vodafone' && <div className="admin-product-meta" style={{color:'#ff6b6b'}}>محفظة: {o.vodafonePhone} · دفع: {o.paidAmount} ج</div>}
                      {o.discount > 0 && <div className="admin-product-meta" style={{color:'#4caf50'}}>🎫 كوبون: {o.coupon} · خصم: {o.discount} ج</div>}
                      <div className="admin-product-meta">كود: <span style={{color:'var(--gold)', fontWeight:'700'}}>{o.trackCode}</span></div>
                      <div style={{display:'flex', alignItems:'center', gap:'6px', marginTop:'8px', flexWrap:'wrap'}}>
                        {STATUS_STEPS.map((step, i) => (
                          <div key={step} style={{display:'flex', alignItems:'center', gap:'4px'}}>
                            <div style={{padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600', background: o.status === step ? statusColor(step) : '#222', color: o.status === step ? '#000' : '#666', border: `1px solid ${o.status === step ? statusColor(step) : '#333'}`}}>{step}</div>
                            {i < STATUS_STEPS.length - 1 && <span style={{color:'#444', fontSize:'10px'}}>←</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{display:'flex', gap:'8px', width:'100%'}}>
                      {o.status !== 'تم التوصيل' && (
                        <button className="admin-edit-btn" style={{flex:1}} onClick={() => handleNextStatus(o)}>
                          {o.status === 'جاري التجهيز' ? '← جاري الشحن' : '← تم التوصيل'}
                        </button>
                      )}
                      <button className="admin-delete-btn" style={{flex: o.status === 'تم التوصيل' ? 1 : 0}} onClick={() => handleDeleteOrder(o._id)}>حذف</button>
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
              <input className="auth-input" placeholder="التاق" value={newSlide.tag} onChange={e => setNewSlide({...newSlide, tag: e.target.value})} />
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
              <input className="auth-input" placeholder="نسبة الخصم" value={newOffer.discount} onChange={e => setNewOffer({...newOffer, discount: e.target.value})} />
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

        {tab === 'bundles' && (
          <div>
            <div className="admin-form">
              <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'4px'}}>اسم الباندل</div>
              <div className="admin-row">
                <input className="auth-input" placeholder="الاسم عربي" value={newBundle.title} onChange={e => setNewBundle({...newBundle, title: e.target.value})} />
                <input className="auth-input" placeholder="الاسم انجليزي" value={newBundle.titleEn} onChange={e => setNewBundle({...newBundle, titleEn: e.target.value})} />
              </div>
              <input className="auth-input" placeholder="سعر الباندل" type="number" value={newBundle.bundlePrice} onChange={e => setNewBundle({...newBundle, bundlePrice: e.target.value})} />
              <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'8px'}}>اختاري المنتجات:</div>
              <div style={{display:'flex', flexDirection:'column', gap:'6px', maxHeight:'200px', overflowY:'auto'}}>
                {products.map(p => (
                  <div key={p._id} onClick={() => toggleBundleProduct(p._id)}
                    style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px', borderRadius:'4px', cursor:'pointer',
                      background: newBundle.selectedProducts.includes(p._id) ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${newBundle.selectedProducts.includes(p._id) ? 'var(--gold)' : 'rgba(201,168,76,0.1)'}`
                    }}>
                    {p.image && <img src={p.image} alt={p.name} style={{width:'36px', height:'36px', objectFit:'cover', borderRadius:'4px'}} />}
                    <div>
                      <div style={{fontSize:'13px', color:'var(--white)'}}>{p.name}</div>
                      <div style={{fontSize:'11px', color:'var(--gray)'}}>{p.price} ج</div>
                    </div>
                    {newBundle.selectedProducts.includes(p._id) && <span style={{marginRight:'auto', color:'var(--gold)'}}>✓</span>}
                  </div>
                ))}
              </div>
              {newBundle.selectedProducts.length > 0 && (
                <div style={{fontSize:'12px', color:'var(--gold)'}}>
                  تم اختيار {newBundle.selectedProducts.length} منتج · السعر الأصلي: {products.filter(p => newBundle.selectedProducts.includes(p._id)).reduce((s, p) => s + p.price, 0)} ج
                </div>
              )}
              <button className="auth-btn" onClick={handleAddBundle} disabled={!newBundle.title || !newBundle.bundlePrice || newBundle.selectedProducts.length === 0}>
                إضافة الباندل
              </button>
            </div>
            <div className="admin-products">
              {bundles.length === 0 ? (
                <div className="admin-empty"><div style={{fontSize:'48px', marginBottom:'1rem'}}>🎁</div><p>مفيش باندل لسه</p></div>
              ) : (
                bundles.map(b => (
                  <div className="admin-product-row" key={b._id}>
                    <div className="admin-product-info">
                      <div className="admin-product-name">{b.title}</div>
                      <div className="admin-product-meta">سعر الباندل: {b.bundlePrice} ج · {b.products?.length} منتجات</div>
                      <div className="admin-product-meta">{b.products?.map(p => p.name).join(' + ')}</div>
                    </div>
                    <button className="admin-delete-btn" onClick={() => handleDeleteBundle(b._id)}>حذف</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'coupons' && (
          <div>
            <div className="admin-form">
              <div className="admin-row">
                <input className="auth-input" placeholder="كود الكوبون" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} style={{textTransform:'uppercase'}} />
                <input className="auth-input" placeholder="قيمة الخصم" type="number" value={newCoupon.discount} onChange={e => setNewCoupon({...newCoupon, discount: e.target.value})} />
              </div>
              <div className="admin-row">
                <select className="auth-input" value={newCoupon.type} onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}>
                  <option value="percent">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (ج)</option>
                </select>
                <input className="auth-input" placeholder="أقصى عدد استخدامات" type="number" value={newCoupon.maxUses} onChange={e => setNewCoupon({...newCoupon, maxUses: e.target.value})} />
              </div>
              <button className="auth-btn" onClick={handleAddCoupon} disabled={!newCoupon.code || !newCoupon.discount}>إضافة كوبون</button>
            </div>
            <div className="admin-products">
              {coupons.length === 0 ? (
                <div className="admin-empty"><div style={{fontSize:'48px', marginBottom:'1rem'}}>🎫</div><p>مفيش كوبونات لسه</p></div>
              ) : (
                coupons.map(c => (
                  <div className="admin-product-row" key={c._id}>
                    <div className="admin-product-info">
                      <div className="admin-product-name" style={{letterSpacing:'2px'}}>{c.code}</div>
                      <div className="admin-product-meta">خصم {c.type === 'percent' ? `${c.discount}%` : `${c.discount} ج`} · استُخدم {c.usedCount}/{c.maxUses}</div>
                      <div style={{display:'inline-block', marginTop:'4px', padding:'2px 10px', borderRadius:'20px', fontSize:'11px', background: c.active ? '#1a3a1a' : '#3a1a1a', color: c.active ? '#4caf50' : '#f44336'}}>
                        {c.active ? '● فعال' : '● منتهي'}
                      </div>
                    </div>
                    <div className="admin-product-actions">
                      <button className="admin-edit-btn" onClick={() => handleToggleCoupon(c._id, c.active)} style={{background: c.active ? '#3a1a1a' : '#1a3a1a', color: c.active ? '#f44336' : '#4caf50'}}>
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

        {tab === 'admins' && (
          <div className="admin-form">
            <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'6px'}}>إضافة مشرف جديد</div>
            <p style={{color:'#888', fontSize:'12px', marginBottom:'12px'}}>
              المستخدم لازم يكون عامل حساب الأول، بعدين تكتب إيميله هنا وتديه صلاحية الأدمن
            </p>
            <input className="auth-input" type="email" placeholder="إيميل المشرف الجديد" value={adminEmail} onChange={e => { setAdminEmail(e.target.value); setAdminMsg('') }} />
            <button className="auth-btn" onClick={handleMakeAdmin} disabled={adminLoading || !adminEmail.trim()}>
              {adminLoading ? 'جاري...' : 'اجعله مشرف'}
            </button>
            {adminMsg && (
              <div style={{marginTop:'8px', fontSize:'13px', color: adminMsg.startsWith('✅') ? '#4caf50' : '#f44336'}}>
                {adminMsg}
              </div>
            )}
          </div>
        )}

        {tab === 'categories' && (
          <div className="admin-form">
            <p style={{color:'#888', fontSize:'12px', marginBottom:'16px'}}>
              ارفعي صورة لكل قسم تظهر كخلفية في الصفحة الرئيسية
            </p>
            {[
              { key: 'cat_pajamas', label: 'بيجامات' },
              { key: 'cat_kaftans', label: 'كاشات' },
              { key: 'cat_lingerie', label: 'لانجيري' },
              { key: 'cat_offers', label: 'العروض' },
            ].map(({ key, label }) => (
              <div key={key} style={{marginBottom:'20px', paddingBottom:'20px', borderBottom:'1px solid #222'}}>
                <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'8px'}}>{label}</div>
                {catImages[key] && (
                  <img src={catImages[key]} alt={label} style={{width:'120px', height:'80px', objectFit:'cover', borderRadius:'6px', marginBottom:'8px', display:'block'}} />
                )}
                <input type="file" accept="image/*" className="auth-input"
                  onChange={async (e) => {
                    const file = e.target.files[0]
                    if (!file) return
                    setUploading(true)
                    const res = await uploadImage(file)
                    const updated = { ...catImages, [key]: res.url }
                    setCatImages(updated)
                    localStorage.setItem('catImages', JSON.stringify(updated))
                    setUploading(false)
                  }}
                />
                {catImages[key] && (
                  <button className="admin-delete-btn" style={{marginTop:'6px', fontSize:'11px'}}
                    onClick={() => {
                      const updated = { ...catImages }
                      delete updated[key]
                      setCatImages(updated)
                      localStorage.setItem('catImages', JSON.stringify(updated))
                    }}
                  >حذف الصورة</button>
                )}
              </div>
            ))}
            {uploading && <div style={{color:'var(--gold)', fontSize:'12px'}}>جاري رفع الصورة...</div>}
          </div>
        )}

        {tab === 'shipping' && (
          <div className="admin-products">
            {governorates.map((g, i) => (
              <div className="admin-product-row" key={g.name}>
                {editingGov === i ? (
                  <div className="admin-form" style={{width:'100%'}}>
                    <div className="admin-row">
                      <input className="auth-input" placeholder="السعر" type="number" value={g.price} onChange={e => { const u = [...governorates]; u[i] = {...u[i], price: Number(e.target.value)}; setGovernorates(u) }} />
                      <input className="auth-input" placeholder="الأيام" value={g.days} onChange={e => { const u = [...governorates]; u[i] = {...u[i], days: e.target.value}; setGovernorates(u) }} />
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