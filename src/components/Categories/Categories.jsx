const catsAr = [
  { name: 'بيجامات', sub: 'بنطلون · برمودا · هوت شورت', filter: 'بيجامات', imgKey: 'cat_pajamas' },
  { name: 'كاشات', sub: 'طويل · قصير', filter: 'كاشات', imgKey: 'cat_kaftans' },
  { name: 'لانجيري', sub: 'تشكيلات حصرية', filter: 'لانجيري', imgKey: 'cat_lingerie' },
  { name: 'العروض', sub: 'أحدث التخفيضات', filter: 'عروض', imgKey: 'cat_offers' },
]

const catsEn = [
  { name: 'Pajamas', sub: 'Long · Bermuda · Hot Short', filter: 'بيجامات', imgKey: 'cat_pajamas' },
  { name: 'Caftans', sub: 'Long · Short', filter: 'كاشات', imgKey: 'cat_kaftans' },
  { name: 'Lingerie', sub: 'Exclusive Collections', filter: 'لانجيري', imgKey: 'cat_lingerie' },
  { name: 'Offers', sub: 'Latest Discounts', filter: 'عروض', imgKey: 'cat_offers' },
]

function Categories({ lang, onFilterClick, catImages = {} }) {
  const cats = lang === 'ar' ? catsAr : catsEn

  return (
    <div className="section">
      <div className="section-head">
        <div className="section-title">{lang === 'ar' ? '✦ تسوقي بالقسم ✦' : '✦ Shop by Category ✦'}</div>
        <div className="section-line"></div>
      </div>
      <div className="cats-grid">
        {cats.map((cat, i) => (
          <div
            className="cat-card"
            key={i}
            onClick={() => onFilterClick(cat.filter)}
            style={{
              backgroundImage: catImages[cat.imgKey] ? `url(${catImages[cat.imgKey]})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {catImages[cat.imgKey] && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 100%)',
              }} />
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="cat-name">{cat.name}</div>
              <div className="cat-count">{cat.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories