import { useState, useEffect } from 'react'
import { getOrders } from '../../api'

function MyOrders({ onClose }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    if (user) {
      getOrders()
        .then(data => {
          const myOrders = Array.isArray(data) ? data.filter(o => o.email === user.email) : []
          setOrders(myOrders)
          setLoading(false)
        })
        .catch(() => { setOrders([]); setLoading(false) })
    }
  }, [])

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const statusColor = (status) => {
    if (status === 'تم التوصيل') return '#4caf50'
    if (status === 'جاري الشحن') return '#ff9800'
    return 'var(--gold)'
  }

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="checkout-panel">
        <div className="auth-header">
          <div className="auth-logo">🧾 طلباتي</div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <div className="admin-empty">جاري التحميل...</div>
        ) : orders.length === 0 ? (
          <div className="admin-empty">
            <div style={{fontSize:'48px', marginBottom:'1rem'}}>📦</div>
            <p>مفيش طلبات لسه</p>
          </div>
        ) : (
          <div className="admin-products">
            {orders.map(o => (
              <div className="admin-product-row" key={o._id} style={{flexDirection:'column', alignItems:'flex-start'}}>
                <div className="admin-product-info" style={{width:'100%'}}>
                  <div className="admin-product-name">{o.governorate} · {o.total} ج</div>
                  <div className="admin-product-meta">
                    {o.payMethod === 'cod' ? '🚚 عند الاستلام' : '📱 فودافون كاش'}
                  </div>

                  {/* المنتجات */}
                  {o.items?.length > 0 && (
                    <div style={{marginTop:'6px'}}>
                      {o.items.map((item, i) => (
                        <div key={i} style={{fontSize:'11px', color:'#aaa'}}>
                          {item.name} {item.size ? `· ${item.size}` : ''} {item.color ? `· ${item.color}` : ''} × {item.qty || 1}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* كود التتبع */}
                  <div style={{display:'flex', alignItems:'center', gap:'8px', marginTop:'6px'}}>
                    <div style={{color:'var(--gold)', fontSize:'13px', fontWeight:'700', letterSpacing:'1px'}}>
                      {o.trackCode}
                    </div>
                    <button
                      onClick={() => handleCopy(o.trackCode, o._id)}
                      style={{
                        background: copiedId === o._id ? '#4caf50' : '#222',
                        color: copiedId === o._id ? '#fff' : 'var(--gold)',
                        border: '1px solid var(--gold)',
                        borderRadius:'6px', padding:'2px 10px',
                        fontSize:'11px', cursor:'pointer'
                      }}
                    >
                      {copiedId === o._id ? '✓ تم النسخ' : 'نسخ'}
                    </button>
                  </div>

                  {/* الحالة */}
                  <div style={{
                    display:'inline-block', marginTop:'6px',
                    padding:'2px 12px', borderRadius:'20px', fontSize:'11px',
                    background: '#1a1a1a',
                    color: statusColor(o.status),
                    border: `1px solid ${statusColor(o.status)}`
                  }}>
                    {o.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default MyOrders