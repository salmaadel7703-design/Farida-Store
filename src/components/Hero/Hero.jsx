import { useState, useEffect } from 'react'

const slidesAr = [
  { tag: '✦ كولكشن جديد ✦', title: 'بيجامات', titleGold: 'فريدة', sub: 'راحة تلتقي بالفخامة في كل قطعة', btn: 'تسوقي الآن' },
  { tag: '✦ عروض خاصة ✦', title: 'خصم يصل إلى', titleGold: '40%', sub: 'عرض محدود — لا تفوتيه', btn: 'اكتشفي العروض' },
  { tag: '✦ لانجيري فاخر ✦', title: 'تشكيلة', titleGold: 'لانجيري', sub: 'أناقة من الداخل تنعكس على الخارج', btn: 'استعرضي التشكيلة' },
]

const slidesEn = [
  { tag: '✦ New Collection ✦', title: 'Pajamas by', titleGold: 'Farida', sub: 'Where comfort meets luxury', btn: 'Shop Now' },
  { tag: '✦ Special Offers ✦', title: 'Up to', titleGold: '40% Off', sub: 'Limited offer — don\'t miss it', btn: 'Discover Offers' },
  { tag: '✦ Luxury Lingerie ✦', title: 'Exclusive', titleGold: 'Lingerie', sub: 'Elegance from within', btn: 'Browse Collection' },
]

function Hero({ lang }) {
  const [current, setCurrent] = useState(0)
  const slides = lang === 'ar' ? slidesAr : slidesEn

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [lang])

  return (
    <div className="hero">
      <div className="slide-content">
        <div className="slide-tag">{slides[current].tag}</div>
        <div className="slide-title">
          {slides[current].title} <span>{slides[current].titleGold}</span>
        </div>
        <div className="slide-sub">{slides[current].sub}</div>
        <button className="slide-cta" onClick={() => {
  if (current === 0) {
    document.querySelector('.products-grid').scrollIntoView({ behavior: 'smooth' })
  } else if (current === 1) {
    document.querySelector('.offers-banner').scrollIntoView({ behavior: 'smooth' })
  } else {
    document.querySelector('.products-grid').scrollIntoView({ behavior: 'smooth' })
  }
}}>
  {slides[current].btn}
</button>
      </div>
      <div className="dots">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero