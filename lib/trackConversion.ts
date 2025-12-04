import { hashUserDataForGoogleAds } from './hashUserData'

interface ConversionData {
  transactionId: string
  value: number
  currency: string
  items: Array<{
    id: string
    name: string
    price: number
    category: string
  }>
  userData: {
    email: string
    phone: string
    firstName: string
    lastName: string
  }
}

// Enviar conversão para UTMify (waiting_payment)
export async function trackWaitingPayment(data: ConversionData) {
  try {
    const utmParams = new URLSearchParams(window.location.search)
    
    const payload = {
      event: 'waiting_payment',
      transaction_id: data.transactionId,
      value: data.value,
      currency: data.currency,
      items: data.items,
      // Preservar todos os parâmetros UTM
      utm_source: utmParams.get('utm_source'),
      utm_medium: utmParams.get('utm_medium'),
      utm_campaign: utmParams.get('utm_campaign'),
      utm_term: utmParams.get('utm_term'),
      utm_content: utmParams.get('utm_content'),
      fbclid: utmParams.get('fbclid'),
      gclid: utmParams.get('gclid'),
      // Dados adicionais
      timestamp: new Date().toISOString(),
      page_url: window.location.href
    }

    // Enviar para UTMify
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'waiting_payment', payload)
    }

    console.log('📊 [Conversion] Waiting Payment tracked:', payload)
    return true
  } catch (error) {
    console.error('❌ [Conversion] Error tracking waiting payment:', error)
    return false
  }
}

// Enviar conversão para UTMify e Google Ads (purchase)
export async function trackPurchase(data: ConversionData) {
  try {
    const utmParams = new URLSearchParams(window.location.search)
    
    // 1. Enviar para UTMify/GA4
    const gaPayload = {
      event: 'purchase',
      transaction_id: data.transactionId,
      value: data.value,
      currency: data.currency,
      items: data.items,
      utm_source: utmParams.get('utm_source'),
      utm_medium: utmParams.get('utm_medium'),
      utm_campaign: utmParams.get('utm_campaign'),
      utm_term: utmParams.get('utm_term'),
      utm_content: utmParams.get('utm_content'),
      fbclid: utmParams.get('fbclid'),
      gclid: utmParams.get('gclid'),
      timestamp: new Date().toISOString()
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', gaPayload)
    }

    // 2. Enviar para Google Ads com Enhanced Conversions (dados hasheados)
    const hashedUserData = await hashUserDataForGoogleAds({
      email: data.userData.email,
      phone: data.userData.phone,
      firstName: data.userData.firstName,
      lastName: data.userData.lastName,
      country: 'BR'
    })

    const adsPayload = {
      send_to: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID,
      transaction_id: data.transactionId,
      value: data.value,
      currency: data.currency,
      user_data: hashedUserData
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', adsPayload)
    }

    console.log('✅ [Conversion] Purchase tracked:', {
      ga: gaPayload,
      ads: { ...adsPayload, user_data: '[HASHED]' }
    })

    return true
  } catch (error) {
    console.error('❌ [Conversion] Error tracking purchase:', error)
    return false
  }
}

// Enviar conversão para Facebook Pixel
export async function trackFacebookPurchase(data: ConversionData) {
  try {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: data.value,
        currency: data.currency,
        content_ids: data.items.map(item => item.id),
        content_type: 'product',
        contents: data.items.map(item => ({
          id: item.id,
          quantity: 1,
          item_price: item.price
        }))
      })

      console.log('📘 [Facebook] Purchase tracked')
    }
    return true
  } catch (error) {
    console.error('❌ [Facebook] Error tracking purchase:', error)
    return false
  }
}
