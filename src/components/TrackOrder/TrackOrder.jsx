import { useState } from 'react'
import { trackOrder } from '../../api'

const STATUS_STEPS = ['جاري التجهيز', 'جاري الشحن', 'تم التوصيل']

const statusColor = (status) => {
  if (status === 'تم التوصيل') return '#4caf50'
  if (status === 'جاري الشحن') return '#ff9800'
  return 'var(--gold)'
}

function TrackOrder({ onClose }) {
  const [code, setCode] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTrack = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res = await trackOrder(code.trim().toUpperCase())
      if (res.message) {
        setError(res.message)
      } else {
        setOrder(res)
      }
    } catch {
      setError('في مشكلة، حاولي تاني')
    }
    setLoading(false)
  }

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="checkout-panel">
        <div className="auth-header">
          <div className="auth-logo">تتبع الطلب</div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

        <div className="auth-form">
          <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'6px'}}>ادخلي كود التتبع</div>
          <div style={{display:'flex', gap:'8px'}}>
            <input
              className="auth-input"
              placeholder="مثلاً: FRSG00MVQ"
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setOrder(null); setError('') }}
              style={{marginBottom:0, textTransform:'uppercase'}}
            />
            <button
              onClick={handleTrack}
              disabled={loading || !code.trim()}
              style={{
                background:'var(--gold)', color:'#000', border:'none',
                borderRadius:'8px', padding:'0 16px', fontWeight:'700',
                cursor:'pointer', whiteSpace:'nowrap', flexShrink:0
              }}
            >
              {loading ? '...' : 'تتبع'}
            </button>
          </div>

          {error && <div style={{color:'#f44336', fontSize:'13px', marginTop:'8px'}}>❌ {error}</div>}

          {order && (
            <div style={{marginTop:'1.5rem'}}>

              {/* بيانات الطلب */}
              <div style={{background:'#1a1a1a', borderRadius:'12px', padding:'1rem', marginBottom:'1rem'}}>
                <div style={{color:'var(--gold)', fontWeight:'700', fontSize:'16px', marginBottom:'8px'}}>
                  طلب {order.trackCode}
                </div>
                <div style={{color:'#ccc', fontSize:'13px', lineHeight:'1.8'}}>
                  <div>👤 {order.name}</div>
                  <div>📍 {order.governorate} — {order.address}</div>
                  <div>📱 {order.phone}</div>
                  <div>💳 {order.payMethod === 'cod' ? 'عند الاستلام' : 'فودافون كاش'}</div>
                </div>
              </div>

              {/* ✅ تفاصيل المنتجات */}
              <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'8px'}}>المنتجات</div>
              <div style={{background:'#1a1a1a', borderRadius:'12px', padding:'1rem', marginBottom:'1rem'}}>
                {order.items?.map((item, i) => (
                  <div key={i} style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'8px 0',
                    borderBottom: i < order.items.length - 1 ? '1px solid #333' : 'none'
                  }}>
                    <div>
                      <div style={{color:'white', fontSize:'13px', fontWeight:'600'}}>{item.name}</div>
                      <div style={{color:'#888', fontSize:'11px', marginTop:'2px'}}>
                        {item.size && <span>مقاس: {item.size}</span>}
                        {item.size && item.color && <span> · </span>}
                        {item.color && <span>لون: {item.color}</span>}
                        {item.qty > 1 && <span> · الكمية: {item.qty}</span>}
                      </div>
                    </div>
                    <div style={{color:'var(--gold)', fontWeight:'700', fontSize:'13px'}}>
                      {item.price * (item.qty || 1)} ج
                    </div>
                  </div>
                ))}

                {/* ملخص السعر */}
                <div style={{borderTop:'1px solid #333', marginTop:'8px', paddingTop:'8px'}}>
                  {order.discount > 0 && (
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#4caf50', marginBottom:'4px'}}>
                      <span>خصم ({order.coupon})</span>
                      <span>- {order.discount} ج</span>
                    </div>
                  )}
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#888', marginBottom:'4px'}}>
                    <span>الشحن</span>
                    <span>{order.shipping} ج</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'14px', fontWeight:'700', color:'var(--gold)'}}>
                    <span>الإجمالي</span>
                    <span>{order.total} ج</span>
                  </div>
                </div>
              </div>

              {/* شريط التتبع */}
              <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'12px'}}>حالة الطلب</div>
              <div style={{display:'flex', flexDirection:'column', gap:'0'}}>
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} style={{display:'flex', alignItems:'flex-start', gap:'12px'}}>
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                      <div style={{
                        width:'28px', height:'28px', borderRadius:'50%', flexShrink:0,
                        background: i <= currentStep ? statusColor(step) : '#222',
                        border: `2px solid ${i <= currentStep ? statusColor(step) : '#444'}`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'12px', fontWeight:'700',
                        color: i <= currentStep ? '#000' : '#555'
                      }}>
                        {i < currentStep ? '✓' : i + 1}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div style={{width:'2px', height:'32px', background: i < currentStep ? statusColor(STATUS_STEPS[i + 1]) : '#333'}} />
                      )}
                    </div>
                    <div style={{paddingTop:'4px', paddingBottom:'24px'}}>
                      <div style={{fontSize:'14px', fontWeight: i === currentStep ? '700' : '400', color: i <= currentStep ? statusColor(step) : '#555'}}>
                        {step}
                      </div>
                      {i === currentStep && <div style={{fontSize:'11px', color:'#888', marginTop:'2px'}}>الحالة الحالية</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default TrackOrder