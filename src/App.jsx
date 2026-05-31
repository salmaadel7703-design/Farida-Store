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
import './index.css'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [authOpen, setAuthOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [lang, setLang] = useState('ar')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    setTimeout(() => setShowSplash(false), 2500)
  }, [])

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const addToCart = (product) => {
    setCartItems(prev => [...prev, product])
  }

  // ✅ مسح السلة بعد تأكيد الطلب
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
            cartCount={cartItems.length}
            onCartClick={() => setCartOpen(true)}
            onAuthClick={() => setAuthOpen(true)}
            onAdminClick={() => setAdminOpen(true)}
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
          <Cart
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            items={cartItems}
            onCheckout={() => {
              setCartOpen(false)
              setCheckoutOpen(true)
            }}
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
        </>
      )}
    </div>
  )
}

export default App