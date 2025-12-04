// Hash SHA-256 para dados do usuário (Google Ads Enhanced Conversions)
export async function hashUserData(data: string): Promise<string> {
  if (typeof window === 'undefined') {
    // Server-side (Node.js)
    const crypto = require('crypto')
    return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex')
  } else {
    // Client-side (Browser)
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data.toLowerCase().trim())
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
}

export async function hashUserDataForGoogleAds(userData: {
  email: string
  phone: string
  firstName: string
  lastName: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
}) {
  const [firstName, ...lastNameParts] = userData.firstName.split(' ')
  const lastName = lastNameParts.join(' ') || userData.lastName || ''

  return {
    email: await hashUserData(userData.email),
    phone_number: await hashUserData(userData.phone.replace(/\D/g, '')),
    address: {
      first_name: await hashUserData(firstName),
      last_name: await hashUserData(lastName),
      city: userData.city ? await hashUserData(userData.city) : undefined,
      region: userData.state ? await hashUserData(userData.state) : undefined,
      country: userData.country ? await hashUserData(userData.country) : undefined,
      postal_code: userData.postalCode ? await hashUserData(userData.postalCode) : undefined,
    }
  }
}
