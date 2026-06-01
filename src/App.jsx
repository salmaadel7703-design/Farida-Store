import { useState, useEffect } from 'react'
import Splash from './components/Splash/Splash'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Categories from './components/Categories/Categories'
import Products from './components/Products/Products'
import Offers from './components/Offers/Offers'
import Footer from './components/Footer/Footer'
import Cart from './components/Cart/Cart'
import Auth from './components/Auth/Auth'
import ProductPage from './components/ProductPage/ProductPage'
import Checkout from './components/Checkout/Checkout'
import Admin from './components/Admin/Admin'
import TrackOrder from './components/TrackOrder/TrackOrder'
import './index.css'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [authOpen, setAuthOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [trackOpen, setTrackOpen] = useState(false)
  const [lang, setLang] = useState('ar')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    setTimeout(() => setShowSplash(false), 2500)
  }, [])

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.findIndex(i => i._id === product._id && i.size === product.size && i.color === product.color)
      if (existing !== -1) {
        const updated = [...prev]
        updated[existing] = { ...updated[existing], qty: (updated[existing].qty || 1) + 1 }
        return updated
      }
      return [...prev, { ...product, qty: 1 }]
    })
    setToast(`✅ تمت إضافة "${product.name}" للسلة`)
    setTimeout(() => setToast(''), 2000)
  }

  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateQty = (index, qty) => {
    if (qty < 1) {
      removeFromCart(index)
      return
    }
    setCartItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], qty }
      return updated
    })
  }

  const clearCart = () => {
    setCartItems([])
    setCheckoutOpen(false)
  }

  const handleSearch = (val) => {
    setSearch(val)
    if (val) {
      setTimeout(() => {
        document.querySelector('.products-grid')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const handleFilter = (cat) => {
    setFilter(cat)
    setTimeout(() => {
      document.querySelector('.products-grid')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div>
      {showSplash ? <Splash /> : (
        <>
          <Navbar
            cartCount={cartItems.reduce((sum, i) => sum + (i.qty || 1), 0)}
            onCartClick={() => setCartOpen(true)}
            onAuthClick={() => setAuthOpen(true)}
            onAdminClick={() => setAdminOpen(true)}
            onTrackClick={() => setTrackOpen(true)}
            lang={lang}
            setLang={setLang}
            onSearch={handleSearch}
            onFilterClick={handleFilter}
          />
          <Hero lang={lang} />
          <Categories lang={lang} onFilterClick={handleFilter} />
          <Offers lang={lang} />
          <Products
            onAddToCart={addToCart}
            onProductClick={(p) => setSelectedProduct(p)}
            lang={lang}
            search={search}
            filter={filter}
          />
          <Footer lang={lang} />

          {toast && (
            <div style={{
              position: 'fixed',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#1a1a1a',
              color: 'var(--gold)',
              padding: '12px 24px',
              borderRadius: '12px',
              border: '1px solid var(--gold)',
              fontSize: '14px',
              zIndex: 9999,
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap'
            }}>
              {toast}
            </div>
          )}

          <Cart
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            items={cartItems}
            onCheckout={() => {
              setCartOpen(false)
              setCheckoutOpen(true)
            }}
            onRemoveItem={removeFromCart}
            onUpdateQty={updateQty}
            lang={lang}
          />
          {authOpen && <Auth onClose={() => setAuthOpen(false)} lang={lang} cartItems={cartItems} />}
          {selectedProduct && (
            <ProductPage
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onAddToCart={addToCart}
              lang={lang}
            />
          )}
          {checkoutOpen && (
            <Checkout
              onClose={() => setCheckoutOpen(false)}
              items={cartItems}
              lang={lang}
              onOrderDone={clearCart}
            />
          )}
          {adminOpen && <Admin onClose={() => setAdminOpen(false)} />}
          {trackOpen && <TrackOrder onClose={() => setTrackOpen(false)} />}
        </>
      )}
    </div>
  )
}

export default App