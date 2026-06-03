import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar({ cartCount, onCartClick, onAuthClick, onAdminClick, onTrackClick, onOrdersClick, lang, setLang, onSearch, onFilterClick }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const isAdmin = user?.role === 'admin'

  const handleFilter = (cat, subCat = '') => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (subCat) {
      navigate(`/category/${encodeURIComponent(cat)}?sub=${encodeURIComponent(subCat)}`)
    } else {
      navigate(`/category/${encodeURIComponent(cat)}`)
    }
    setDrawerOpen(false)
  }

  const goHome = () => {
    navigate('/')
    setDrawerOpen(false)
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-inner">
          <button className="menu-btn" onClick={() => setDrawerOpen(true)}>☰</button>
          <div className="nav-logo" onClick={goHome}>
            {lang === 'ar' ? 'فريدة' : 'Farida'}
            <span>WOMEN'S WEAR</span>
          </div>
          <div className="search-bar desktop-search">
            <input type="text" placeholder={lang === 'ar' ? 'ابحثي عن منتج...' : 'Search for a product...'} onChange={(e) => onSearch(e.target.value)} />
          </div>
          <div className="nav-actions">
            <button className="search-icon-btn mobile-search" onClick={() => setShowSearch(!showSearch)}>🔍</button>
            <div className="lang-toggle">
              <button className={`lang-btn ${lang === 'ar' ? 'active' : ''}`} onClick={() => setLang('ar')}>عربي</button>
              <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
            </div>
            <div className="cart-btn" onClick={onCartClick}>
              🛍 <span className="cart-badge">{cartCount}</span>
            </div>
          </div>
        </div>
        {showSearch && (
          <div className="mobile-search-bar">
            <input type="text" placeholder={lang === 'ar' ? 'ابحثي عن منتج...' : 'Search for a product...'} onChange={(e) => onSearch(e.target.value)} autoFocus />
          </div>
        )}
      </nav>

      {drawerOpen && (
        <div className="overlay" onClick={() => setDrawerOpen(false)}></div>
      )}

      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title">{lang === 'ar' ? 'المنتجات' : 'Products'}</span>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        <div className="drawer-category">
          <div className="cat-item" onClick={goHome}>🏠 {lang === 'ar' ? 'الصفحة الرئيسية' : 'Home'}</div>
        </div>
        <div className="drawer-category">
          <div className="cat-title">{lang === 'ar' ? 'بيجامات' : 'Pajamas'}</div>
          <div className="cat-item" onClick={() => handleFilter('بيجامات', 'بنطلون')}>{lang === 'ar' ? 'بيجامات بنطلون' : 'Long Pajamas'}</div>
          <div className="cat-item" onClick={() => handleFilter('بيجامات', 'برمودا')}>{lang === 'ar' ? 'بيجامات برمودا' : 'Bermuda Pajamas'}</div>
          <div className="cat-item" onClick={() => handleFilter('بيجامات', 'هوت شورت')}>{lang === 'ar' ? 'بيجامات هوت شورت' : 'Hot Short Pajamas'}</div>
        </div>
        <div className="drawer-category">
          <div className="cat-title">{lang === 'ar' ? 'كاشات' : 'Caftans'}</div>
          <div className="cat-item" onClick={() => handleFilter('كاشات', 'طويل')}>{lang === 'ar' ? 'كاش طويل' : 'Long Caftan'}</div>
          <div className="cat-item" onClick={() => handleFilter('كاشات', 'قصير')}>{lang === 'ar' ? 'كاش قصير' : 'Short Caftan'}</div>
        </div>
        <div className="drawer-category">
          <div className="cat-title">{lang === 'ar' ? 'لانجيري' : 'Lingerie'}</div>
          <div className="cat-item" onClick={() => handleFilter('لانجيري')}>{lang === 'ar' ? 'كل اللانجيري' : 'All Lingerie'}</div>
        </div>
        <div className="drawer-category">
          <div className="cat-title">{lang === 'ar' ? 'عروض' : 'Offers'}</div>
          <div className="cat-item" onClick={() => handleFilter('عروض')}>{lang === 'ar' ? 'العروض الحالية' : 'Current Offers'}</div>
        </div>
        <div className="drawer-category">
          <div className="cat-title">{lang === 'ar' ? 'حسابي' : 'My Account'}</div>
          {user ? (
            <div className="cat-item" onClick={() => { onAuthClick(); setDrawerOpen(false) }}>👤 {user.name}</div>
          ) : (
            <>
              <div className="cat-item" onClick={() => { onAuthClick(); setDrawerOpen(false) }}>{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</div>
              <div className="cat-item" onClick={() => { onAuthClick(); setDrawerOpen(false) }}>{lang === 'ar' ? 'إنشاء حساب جديد' : 'Register'}</div>
            </>
          )}
        </div>
        <div className="drawer-category">
          <div className="cat-title">{lang === 'ar' ? 'طلباتي' : 'My Orders'}</div>
          <div className="cat-item" onClick={() => { onTrackClick(); setDrawerOpen(false) }}>
            📦 {lang === 'ar' ? 'تتبع الطلب' : 'Track Order'}
          </div>
          {user && (
            <div className="cat-item" onClick={() => { onOrdersClick(); setDrawerOpen(false) }}>
              🧾 {lang === 'ar' ? 'طلباتي' : 'My Orders'}
            </div>
          )}
        </div>
        {isAdmin && (
          <div className="drawer-category">
            <div className="cat-title">{lang === 'ar' ? 'الإدارة' : 'Admin'}</div>
            <div className="cat-item" onClick={() => { onAdminClick(); setDrawerOpen(false) }}>{lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</div>
          </div>
        )}
      </div>
    </>
  )
}

export default Navbar