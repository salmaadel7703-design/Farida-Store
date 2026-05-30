import { useState, useEffect } from 'react'
import { getOffers } from '../../api'

function Offers({ lang }) {
  const [offers, setOffers] = useState([])

  useEffect(() => {
    getOffers()
      .then(data => setOffers(Array.isArray(data) ? data : []))
      .catch(() => setOffers([]))
  }, [])

  if (offers.length === 0) {
    return (
      <div className="offers-banner">
        <div className="offer-tag">{lang === 'ar' ? '✦ عروض اليوم ✦' : '✦ Today\'s Offers ✦'}</div>
        <div className="offer-title">{lang === 'ar' ? 'خصومات حصرية تصل لـ 50%' : 'Exclusive Discounts up to 50%'}</div>
        <div className="offer-sub">{lang === 'ar' ? 'عروض محدودة على أحدث التشكيلات — اطلبي الآن وادفعي عند الاستلام' : 'Limited offers on the latest collections — order now and pay on delivery'}</div>
        <button className="offer-btn" onClick={() => document.querySelector('.products-grid')?.scrollIntoView({ behavior: 'smooth' })}>
          {lang === 'ar' ? 'تسوقي العروض' : 'Shop Offers'}
        </button>
      </div>
    )
  }

  return (
    <div>
      {offers.map((offer, i) => (
        <div className="offers-banner" key={i} style={offer.image ? {backgroundImage: `url(${offer.image})`, backgroundSize: 'cover', backgroundPosition: 'center'} : {}}>
          <div className="offer-tag">✦ {offer.discount} ✦</div>
          <div className="offer-title">{offer.title}</div>
          <div className="offer-sub">{offer.sub}</div>
          <button className="offer-btn" onClick={() => document.querySelector('.products-grid')?.scrollIntoView({ behavior: 'smooth' })}>
            {lang === 'ar' ? 'تسوقي العروض' : 'Shop Offers'}
          </button>
        </div>
      ))}
    </div>
  )
}

export default Offers