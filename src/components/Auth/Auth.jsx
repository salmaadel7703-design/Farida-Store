import { useState, useEffect } from 'react'
import { login, register, getOrders } from '../../api'

function Auth({ onClose, cartItems }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('orders')
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    if (user) {
      getOrders()
        .then(data => {
          const myOrders = Array.isArray(data) ? data.filter(o => o.email === user.email) : []
          setOrders(myOrders)
        })
        .catch(() => setOrders([]))
    }
  }, [user])

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await login(loginForm)
      if (res.token) {
        localStorage.setItem('token', res.token)
        localStorage.setItem('user', JSON.stringify(res.user))
        setUser(res.user)
      } else {
        setError(res.message || 'في مشكلة، حاولي تاني')
      }
    } catch {
      setError('في مشكلة، حاولي تاني')
    }
    setLoading(false)
  }

  const handleRegister = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await register(registerForm)
      if (res.token) {
        localStorage.setItem('token', res.token)
        localStorage.setItem('user', JSON.stringify(res.user))
        setUser(res.user)
      } else {
        setError(res.message || 'في مشكلة، حاولي تاني')
      }
    } catch {
      setError('في مشكلة، حاولي تاني')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    onClose()
  }

  const statusColor = (status) => {
    if (status === 'تم التوصيل') return '#4caf50'
    if (status === 'جاري الشحن') return '#ff9800'
    return 'var(--gold)'
  }

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="auth-panel">
        <div className="auth-header">
          <div className="auth-logo">فريدة</div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

        {user ? (
          <>
            <div style={{textAlign:'center', padding:'1rem', color:'var(--gold)', fontSize:'18px'}}>
              أهلاً {user.name}! 👋
            </div>
            <div className="admin-tabs">
              <button className={`auth-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>طلباتي</button>
              <button className={`auth-tab ${tab === 'cart' ? 'active' : ''}`} onClick={() => setTab('cart')}>سلتي</button>
            </div>

            {tab === 'orders' && (
              <div className="admin-products">
                {orders.length === 0 ? (
                  <div className="admin-empty">
                    <div style={{fontSize:'48px', marginBottom:'1rem'}}>📦</div>
                    <p>مفيش طلبات لسه</p>
                  </div>
                ) : (
                  orders.map(o => (
                    <div className="admin-product-row" key={o._id} style={{flexDirection:'column', alignItems:'flex-start'}}>
                      <div className="admin-product-info" style={{width:'100%'}}>
                        <div className="admin-product-name">{o.governorate} · {o.total} ج</div>
                        <div className="admin-product-meta">
                          {o.payMethod === 'cod' ? '🚚 عند الاستلام' : '📱 فودافون كاش'}
                        </div>

                        {/* ✅ كود التتبع مع زرار كوبي */}
                        <div style={{display:'flex', alignItems:'center', gap:'8px', marginTop:'6px'}}>
                          <div style={{color:'var(--gold)', fontSize:'13px', fontWeight:'700', letterSpacing:'1px'}}>
                            {o.trackCode}
                          </div>
                          <button
                            onClick={() => handleCopy(o.trackCode, o._id)}
                            style={{
                              background: copiedId === o._id ? '#4caf50' : '#222',
                              color: copiedId === o._id ? '#fff' : 'var(--gold)',
                              border: '1px solid var(--gold)',
                              borderRadius:'6px', padding:'2px 10px',
                              fontSize:'11px', cursor:'pointer'
                            }}
                          >
                            {copiedId === o._id ? '✓ تم النسخ' : 'نسخ'}
                          </button>
                        </div>

                        {/* ✅ حالة الطلب */}
                        <div style={{
                          display:'inline-block', marginTop:'6px',
                          padding:'2px 12px', borderRadius:'20px', fontSize:'11px',
                          background: '#1a1a1a',
                          color: statusColor(o.status),
                          border: `1px solid ${statusColor(o.status)}`
                        }}>
                          {o.status}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'cart' && (
              <div className="admin-products">
                {!cartItems || cartItems.length === 0 ? (
                  <div className="admin-empty">
                    <div style={{fontSize:'48px', marginBottom:'1rem'}}>🛍</div>
                    <p>السلة فاضية</p>
                  </div>
                ) : (
                  cartItems.map((item, i) => (
                    <div className="admin-product-row" key={i}>
                      <div className="admin-product-info" style={{display:'flex', alignItems:'center', gap:'12px'}}>
                        {item.image && <img src={item.image} alt={item.name} style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'4px'}} />}
                        <div>
                          <div className="admin-product-name">{item.name}</div>
                          <div className="admin-product-meta">{item.price} ج</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            <button className="checkout-back" style={{margin:'1rem'}} onClick={handleLogout}>تسجيل الخروج</button>
          </>
        ) : (
          <>
            <div className="auth-tabs">
              <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(true); setError('') }}>
                تسجيل الدخول
              </button>
              <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(false); setError('') }}>
                حساب جديد
              </button>
            </div>

            {error && <div style={{color:'#ff6b6b', fontSize:'13px', marginBottom:'1rem', textAlign:'center'}}>{error}</div>}

            {isLogin ? (
              <div className="auth-form">
                <input className="auth-input" type="email" placeholder="البريد الإلكتروني" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
                <input className="auth-input" type="password" placeholder="كلمة المرور" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
                <button className="auth-btn" onClick={handleLogin} disabled={loading}>
                  {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                </button>
                <div className="auth-switch">
                  مش عندك حساب؟
                  <span onClick={() => setIsLogin(false)}> إنشاء حساب جديد</span>
                </div>
              </div>
            ) : (
              <div className="auth-form">
                <input className="auth-input" type="text" placeholder="الاسم الكامل" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} />
                <input className="auth-input" type="email" placeholder="البريد الإلكتروني" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} />
                <input className="auth-input" type="tel" placeholder="رقم الموبايل" value={registerForm.phone} onChange={e => setRegisterForm({...registerForm, phone: e.target.value})} />
                <input className="auth-input" type="password" placeholder="كلمة المرور" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} />
                <button className="auth-btn" onClick={handleRegister} disabled={loading}>
                  {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
                </button>
                <div className="auth-switch">
                  عندك حساب؟
                  <span onClick={() => setIsLogin(true)}> تسجيل الدخول</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Auth