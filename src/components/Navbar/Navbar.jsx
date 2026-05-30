import { useState } from 'react'

function Navbar({ cartCount, onCartClick, onAuthClick, onAdminClick, lang, setLang, onSearch, onFilterClick }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const isAdmin = user?.role === 'admin'

  const handleFilter = (cat) => {
    onFilterClick(cat)
    setDrawerOpen(false)
  }

  const goHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setDrawerOpen(false)
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-inner">
          <button className="menu-btn" onClick={() => setDrawerOpen(true)}>☰</button>
          <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
          <div className="cat-item" onClick={() => handleFilter('بيجامات')}>{lang === 'ar' ? 'بيجامات بنطلون' : 'Long Pajamas'}</div>
          <div className="cat-item" onClick={() => handleFilter('بيجامات')}>{lang === 'ar' ? 'بيجامات برمودا' : 'Bermuda Pajamas'}</div>
          <div className="cat-item" onClick={() => handleFilter('بيجامات')}>{lang === 'ar' ? 'بيجامات هوت شورت' : 'Hot Short Pajamas'}</div>
        </div>
        <div className="drawer-category">
          <div className="cat-title">{lang === 'ar' ? 'كاشات' : 'Caftans'}</div>
          <div className="cat-item" onClick={() => handleFilter('كاشات')}>{lang === 'ar' ? 'كاش طويل' : 'Long Caftan'}</div>
          <div className="cat-item" onClick={() => handleFilter('كاشات')}>{lang === 'ar' ? 'كاش قصير' : 'Short Caftan'}</div>
        </div>
        <div className="drawer-category">
          <div className="cat-title">{lang === 'ar' ? 'لانجيري' : 'Lingerie'}</div>
          <div className="cat-item" onClick={() => handleFilter('لانجيري')}>{lang === 'ar' ? 'كل اللانجيري' : 'All Lingerie'}</div>
        </div>
        <div className="drawer-category">
          <div className="cat-title">{lang === 'ar' ? 'عروض' : 'Offers'}</div>
          <div className="cat-item" onClick={() => { document.querySelector('.offers-banner')?.scrollIntoView({ behavior: 'smooth' }); setDrawerOpen(false) }}>{lang === 'ar' ? 'العروض الحالية' : 'Current Offers'}</div>
        </div>
        <div className="drawer-category">
          <div className="cat-title">{lang === 'ar' ? 'حسابي' : 'My Account'}</div>
          <div className="cat-item" onClick={() => { onAuthClick(); setDrawerOpen(false) }}>{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</div>
          <div className="cat-item" onClick={() => { onAuthClick(); setDrawerOpen(false) }}>{lang === 'ar' ? 'إنشاء حساب جديد' : 'Register'}</div>
          <div className="cat-item">{lang === 'ar' ? 'طلباتي' : 'My Orders'}</div>
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