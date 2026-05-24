function Offers({ lang }) {
  return (
    <div className="offers-banner">
      <div className="offer-tag">{lang === 'ar' ? '✦ عروض اليوم ✦' : '✦ Today\'s Offers ✦'}</div>
      <div className="offer-title">{lang === 'ar' ? 'خصومات حصرية تصل لـ 50%' : 'Exclusive Discounts up to 50%'}</div>
      <div className="offer-sub">{lang === 'ar' ? 'عروض محدودة على أحدث التشكيلات — اطلبي الآن وادفعي عند الاستلام' : 'Limited offers on the latest collections — order now and pay on delivery'}</div>
      <button className="offer-btn" onClick={() => document.querySelector('.products-grid').scrollIntoView({ behavior: 'smooth' })}>
        {lang === 'ar' ? 'تسوقي العروض' : 'Shop Offers'}
      </button>
    </div>
  )
}

export default Offers