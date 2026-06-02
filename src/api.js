const BASE_URL = 'https://farida-backend-production.up.railway.app/api'

// المنتجات
export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`)
  return res.json()
}

export const addProduct = async (product) => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  return res.json()
}

export const updateProduct = async (id, product) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  return res.json()
}

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}

// الطلبات
export const addOrder = async (order) => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
  return res.json()
}

export const getOrders = async () => {
  const res = await fetch(`${BASE_URL}/orders`)
  return res.json()
}

export const updateOrder = async (id, data) => {
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export const deleteOrder = async (id) => {
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}

export const trackOrder = async (code) => {
  const res = await fetch(`${BASE_URL}/orders/track/${code}`)
  return res.json()
}

// المستخدمين
export const register = async (data) => {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export const login = async (data) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)
  const res = await fetch(`${BASE_URL.replace('/api', '')}/api/upload`, {
    method: 'POST',
    body: formData
  })
  return res.json()
}

// السلايدر
export const getSlides = async () => {
  const res = await fetch(`${BASE_URL}/slides`)
  return res.json()
}

export const addSlide = async (slide) => {
  const res = await fetch(`${BASE_URL}/slides`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slide)
  })
  return res.json()
}

export const updateSlide = async (id, slide) => {
  const res = await fetch(`${BASE_URL}/slides/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slide)
  })
  return res.json()
}

export const deleteSlide = async (id) => {
  const res = await fetch(`${BASE_URL}/slides/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}

// العروض
export const getOffers = async () => {
  const res = await fetch(`${BASE_URL}/offers`)
  return res.json()
}

export const addOffer = async (offer) => {
  const res = await fetch(`${BASE_URL}/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(offer)
  })
  return res.json()
}

export const updateOffer = async (id, offer) => {
  const res = await fetch(`${BASE_URL}/offers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(offer)
  })
  return res.json()
}

export const deleteOffer = async (id) => {
  const res = await fetch(`${BASE_URL}/offers/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}

// الكوبونات
export const validateCoupon = async (code) => {
  const res = await fetch(`${BASE_URL}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  })
  return res.json()
}

export const getCoupons = async () => {
  const res = await fetch(`${BASE_URL}/coupons`)
  return res.json()
}

export const addCoupon = async (coupon) => {
  const res = await fetch(`${BASE_URL}/coupons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(coupon)
  })
  return res.json()
}

export const deleteCoupon = async (id) => {
  const res = await fetch(`${BASE_URL}/coupons/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}

export const toggleCoupon = async (id, active) => {
  const res = await fetch(`${BASE_URL}/coupons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active })
  })
  return res.json()
}
export const makeAdmin = async (email) => {
  const res = await fetch(`${BASE_URL}/users/make-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  return res.json()
}
// الباندل
export const getBundles = async () => {
  const res = await fetch(`${BASE_URL}/bundles`)
  return res.json()
}

export const addBundle = async (bundle) => {
  const res = await fetch(`${BASE_URL}/bundles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bundle)
  })
  return res.json()
}

export const deleteBundle = async (id) => {
  const res = await fetch(`${BASE_URL}/bundles/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}