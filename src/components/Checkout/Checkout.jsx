import { useState } from 'react'
import { addOrder } from '../../api'

const governorates = [
  { name: 'القاهرة', price: 35, days: '2-3' },
  { name: 'الجيزة', price: 35, days: '2-3' },
  { name: 'الإسكندرية', price: 45, days: '3-4' },
  { name: 'المنصورة', price: 50, days: '3-5' },
  { name: 'أسيوط', price: 60, days: '4-6' },
  { name: 'سوهاج', price: 60, days: '4-6' },
  { name: 'الأقصر', price: 65, days: '5-7' },
  { name: 'أسوان', price: 65, days: '5-7' },
  { name: 'الفيوم', price: 50, days: '3-5' },
  { name: 'طنطا', price: 45, days: '3-4' },
]

const VODAFONE_NUMBER = '01025234076'

// ✅ جلب البيانات المحفوظة من localStorage
const savedInfo = JSON.parse(localStorage.getItem('customerInfo') || 'null')

function Checkout({ onClose, items, onOrderDone }) {
  const [step, setStep] = useState(1)
  const [gov, setGov] = useState(savedInfo?.gov || '')
  const [payMethod, setPayMethod] = useState('cod')
  const [form, setForm] = useState({
    name: savedInfo?.name || '',
    phone: savedInfo?.phone || '',
    address: savedInfo?.address || '',
  })
  const [vodafonePhone, setVodafonePhone] = useState('')
  const [paidAmount, setPaidAmount] = useState('')
  const [orderDone, setOrderDone] = useState(false)
  const [trackCode, setTrackCode] = useState('')
  const [loading, setLoading] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const selectedGov = governorates.find(g => g.name === gov)
  const shipping = selectedGov ? selectedGov.price : 0
  const days = selectedGov ? selectedGov.days : ''
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const total = subtotal + shipping

  const placeOrder = async () => {
    if (payMethod === 'vodafone' && (!vodafonePhone || !paidAmount)) {
      alert('من فضلك ادخلي رقم المحفظة والمبلغ المحول')
      return
    }
    setLoading(true)
    try {
      const order = await addOrder({
        email: user?.email || '',
        name: form.name,
        phone: form.phone,
        address: form.address,
        governorate: gov,
        payMethod,
        vodafonePhone: payMethod === 'vodafone' ? vodafonePhone : '',
        paidAmount: payMethod === 'vodafone' ? Number(paidAmount) : 0,
        items: items.map(i => ({ name: i.name, price: i.price, qty: i.qty || 1, size: i.size || '' })),
        total,
        shipping,
      })
      // ✅ حفظ بيانات العميل للمرة الجاية
      localStorage.setItem('customerInfo', JSON.stringify({ name: form.name, phone: form.phone, address: form.address, gov }))
      setTrackCode(order.trackCode)
      setOrderDone(true)
      onOrderDone()
    } catch (err) {
      alert('في مشكلة، حاولي تاني')
    }
    setLoading(false)
  }

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="checkout-panel">
        <div className="auth-header">
          <div className="auth-logo">إتمام الطلب</div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

        {!orderDone ? (
          <>
            <div className="checkout-steps">
              <div className={`checkout-step ${step >= 1 ? 'active' : ''}`}>١ البيانات</div>
              <div className="checkout-step-line"></div>
              <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>٢ الشحن</div>
              <div className="checkout-step-line"></div>
              <div className={`checkout-step ${step >= 3 ? 'active' : ''}`}>٣ الدفع</div>
            </div>

            {step === 1 && (
              <div className="auth-form">
                <input className="auth-input" placeholder="الاسم الكامل" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <input className="auth-input" placeholder="رقم الموبايل" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                <input className="auth-input" placeholder="العنوان بالتفصيل" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                <button className="auth-btn" onClick={() => setStep(2)} disabled={!form.name || !form.phone || !form.address}>التالي</button>
              </div>
            )}

            {step === 2 && (
              <div className="auth-form">
                <div style={{color:'var(--gold)', fontSize:'13px', letterSpacing:'1px'}}>اختاري المحافظة</div>
                <select className="auth-input" value={gov} onChange={e => setGov(e.target.value)}>
                  <option value="">اختاري المحافظة</option>
                  {governorates.map(g => (
                    <option key={g.name} value={g.name}>{g.name} — {g.price} ج — {g.days} أيام</option>
                  ))}
                </select>
                {selectedGov && (
                  <div className="shipping-info">
                    <div>رسوم الشحن: <span>{shipping} ج</span></div>
                    <div>موعد التسليم: <span>{days} أيام عمل</span></div>
                  </div>
                )}
                <button className="auth-btn" onClick={() => setStep(3)} disabled={!gov}>التالي</button>
                <button className="checkout-back" onClick={() => setStep(1)}>رجوع</button>
              </div>
            )}

            {step === 3 && (
              <div className="auth-form">
                <div style={{color:'var(--gold)', fontSize:'13px', letterSpacing:'1px'}}>طريقة الدفع</div>
                <div className="pay-methods" style={{marginBottom:'1rem'}}>
                  <div className={`pay-method ${payMethod === 'vodafone' ? 'active' : ''}`} onClick={() => setPayMethod('vodafone')}>
                    📱 فودافون كاش
                  </div>
                  <div className={`pay-method ${payMethod === 'cod' ? 'active' : ''}`} onClick={() => setPayMethod('cod')}>
                    🚚 عند الاستلام
                  </div>
                </div>

                {payMethod === 'vodafone' && (
                  <div style={{background:'#1a1a1a', padding:'1rem', borderRadius:'8px', marginBottom:'1rem'}}>
                    <div style={{color:'var(--gold)', fontSize:'13px', marginBottom:'8px'}}>حولي المبلغ على رقم:</div>
                    <div style={{color:'white', fontSize:'20px', fontWeight:'700', letterSpacing:'2px', marginBottom:'12px'}}>{VODAFONE_NUMBER}</div>
                    <input className="auth-input" placeholder="رقم محفظتك اللي حولتي منه" value={vodafonePhone} onChange={e => setVodafonePhone(e.target.value)} />
                    <input className="auth-input" placeholder="المبلغ اللي حولتيه" type="number" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} />
                  </div>
                )}

                <div className="order-summary">
                  <div className="summary-row"><span>المنتجات</span><span>{subtotal} ج</span></div>
                  <div className="summary-row"><span>الشحن</span><span>{shipping} ج</span></div>
                  <div className="summary-row total-row"><span>الإجمالي</span><span>{total} ج</span></div>
                </div>
                <button className="auth-btn" onClick={placeOrder} disabled={loading}>
                  {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                </button>
                <button className="checkout-back" onClick={() => setStep(2)}>رجوع</button>
              </div>
            )}
          </>
        ) : (
          <div className="order-success">
            <div className="success-icon">✅</div>
            <div className="success-title">تم تأكيد طلبك!</div>
            <div className="success-sub">شكراً يا {form.name}، هيوصلك خلال {days} أيام</div>
            <div className="track-code">
              <div style={{fontSize:'12px', color:'var(--gray)', marginBottom:'8px'}}>كود تتبع الشحنة</div>
              <div style={{fontSize:'22px', color:'var(--gold)', fontWeight:'700', letterSpacing:'3px'}}>{trackCode}</div>
            </div>
            <button className="auth-btn" onClick={onClose}>العودة للموقع</button>
          </div>
        )}
      </div>
    </>
  )
}

export default Checkout