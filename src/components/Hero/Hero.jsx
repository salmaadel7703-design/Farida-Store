import { useState, useEffect } from 'react'
import { getSlides } from '../../api'

const defaultSlides = {
  ar: [
    { tag: '✦ كولكشن جديد ✦', title: 'بيجامات', titleGold: 'فريدة', sub: 'راحة تلتقي بالفخامة في كل قطعة', btn: 'تسوقي الآن' },
    { tag: '✦ عروض خاصة ✦', title: 'خصم يصل إلى', titleGold: '40%', sub: 'عرض محدود — لا تفوتيه', btn: 'اكتشفي العروض' },
    { tag: '✦ لانجيري فاخر ✦', title: 'تشكيلة', titleGold: 'لانجيري', sub: 'أناقة من الداخل تنعكس على الخارج', btn: 'استعرضي التشكيلة' },
  ],
  en: [
    { tag: '✦ New Collection ✦', title: 'Pajamas by', titleGold: 'Farida', sub: 'Where comfort meets luxury', btn: 'Shop Now' },
    { tag: '✦ Special Offers ✦', title: 'Up to', titleGold: '40% Off', sub: 'Limited offer — don\'t miss it', btn: 'Discover Offers' },
    { tag: '✦ Luxury Lingerie ✦', title: 'Exclusive', titleGold: 'Lingerie', sub: 'Elegance from within', btn: 'Browse Collection' },
  ]
}

function Hero({ lang }) {
  const [current, setCurrent] = useState(0)
  const [slides, setSlides] = useState(defaultSlides[lang] || defaultSlides.ar)

  useEffect(() => {
    getSlides()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setSlides(data)
        else setSlides(defaultSlides[lang] || defaultSlides.ar)
      })
      .catch(() => setSlides(defaultSlides[lang] || defaultSlides.ar))
  }, [lang])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides])

  return (
    <div className="hero" style={slides[current]?.image ? {backgroundImage: `url(${slides[current].image})`, backgroundSize: 'cover', backgroundPosition: 'center'} : {}}>
      <div className="slide-content">
        <div className="slide-tag">{slides[current]?.tag}</div>
        <div className="slide-title">
          {slides[current]?.title} <span>{slides[current]?.titleGold}</span>
        </div>
        <div className="slide-sub">{slides[current]?.sub}</div>
        <button className="slide-cta" onClick={() => {
          document.querySelector('.products-grid')?.scrollIntoView({ behavior: 'smooth' })
        }}>
          {slides[current]?.btn}
        </button>
      </div>
      <div className="dots">
        {slides.map((_, i) => (
          <div key={i} className={`dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>
    </div>
  )
}

export default Hero