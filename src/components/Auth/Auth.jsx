import { useState } from 'react'
import { login, register } from '../../api'

function Auth({ onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '' })

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await login(loginForm)
      if (res.token) {
        localStorage.setItem('token', res.token)
        localStorage.setItem('user', JSON.stringify(res.user))
        alert(`أهلاً ${res.user.name}! 🎉`)
        onClose()
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
        alert(`تم إنشاء حسابك يا ${res.user.name}! 🎉`)
        onClose()
      } else {
        setError(res.message || 'في مشكلة، حاولي تاني')
      }
    } catch {
      setError('في مشكلة، حاولي تاني')
    }
    setLoading(false)
  }

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="auth-panel">
        <div className="auth-header">
          <div className="auth-logo">فريدة</div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

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
      </div>
    </>
  )
}

export default Auth