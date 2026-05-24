const catsAr = [
  { name: 'بيجامات', sub: 'بنطلون · برمودا · هوت شورت', icon: '👘', filter: 'بيجامات' },
  { name: 'كاشات', sub: 'طويل · قصير', icon: '🧥', filter: 'كاشات' },
  { name: 'لانجيري', sub: 'تشكيلات حصرية', icon: '✨', filter: 'لانجيري' },
]

const catsEn = [
  { name: 'Pajamas', sub: 'Long · Bermuda · Hot Short', icon: '👘', filter: 'بيجامات' },
  { name: 'Caftans', sub: 'Long · Short', icon: '🧥', filter: 'كاشات' },
  { name: 'Lingerie', sub: 'Exclusive Collections', icon: '✨', filter: 'لانجيري' },
]

function Categories({ lang, onFilterClick }) {
  const cats = lang === 'ar' ? catsAr : catsEn

  return (
    <div className="section">
      <div className="section-head">
        <div className="section-title">{lang === 'ar' ? '✦ تسوقي بالقسم ✦' : '✦ Shop by Category ✦'}</div>
        <div className="section-line"></div>
      </div>
      <div className="cats-grid">
        {cats.map((cat, i) => (
          <div className="cat-card" key={i} onClick={() => onFilterClick(cat.filter)}>
            <div className="cat-icon">{cat.icon}</div>
            <div className="cat-name">{cat.name}</div>
            <div className="cat-count">{cat.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories