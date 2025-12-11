// Lightweight local implementation for marketplace functions.
// In production this should be replaced with proper IPFS uploads and on-chain transactions.

async function fileToBase64(file) {
  if (!file) return null
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

export async function createProfile(profileData = {}, imageFile = null, signAndExecute) {
  // profileData: { username, skills, bio }
  // imageFile: File object (optional)
  // signAndExecute: optional mutate function from useSignAndExecuteTransaction
  try {
    const avatar = imageFile ? await fileToBase64(imageFile) : profileData.avatar || null

    const profile = {
      id: `p_${Date.now()}`,
      username: profileData.username || 'anonymous',
      skills: Array.isArray(profileData.skills) ? profileData.skills : (profileData.skills ? [profileData.skills] : []),
      bio: profileData.bio || '',
      avatar,
      createdAt: new Date().toISOString(),
    }

    // If a signAndExecute function is provided, call it (best-effort).
    // The exact payload/shape for Sui transactions depends on your on-chain contracts
    // so here we simply call the function with the profile as an argument if available.
    if (typeof signAndExecute === 'function') {
      try {
        const maybePromise = signAndExecute(profile)
        // Many mutate functions return a Promise; await if so
        if (maybePromise && typeof maybePromise.then === 'function') {
          const res = await maybePromise
          // If on-chain transaction succeeded, attach tx result
          profile.tx = res
        }
      } catch (chainErr) {
        // If on-chain fails, we still proceed to store locally and return the error info
        profile.txError = chainErr && chainErr.message ? chainErr.message : String(chainErr)
      }
    }

    // Persist to global store (Zustand)
    try {
      const useStore = require('../../store/useStore').default
      const store = useStore.getState()
      store.addProfile(profile)
    } catch (e) {
      // fallback to localStorage if store not available
      const raw = localStorage.getItem('marketplace_profiles')
      const list = raw ? JSON.parse(raw) : []
      list.push(profile)
      localStorage.setItem('marketplace_profiles', JSON.stringify(list))
    }

    return profile
  } catch (err) {
    throw err
  }
}

export async function getUserProfile({ username, id } = {}) {
  try {
    const useStore = require('../../store/useStore').default
    const store = useStore.getState()
    if (id) return store.profiles.find((p) => p.id === id) || null
    if (username) return store.profiles.find((p) => p.username === username) || null
    return null
  } catch (e) {
    const raw = localStorage.getItem('marketplace_profiles')
    const list = raw ? JSON.parse(raw) : []
    if (id) return list.find((p) => p.id === id) || null
    if (username) return list.find((p) => p.username === username) || null
    return null
  }
}

export async function createServiceListing(listing = {}, imageFile = null, signAndExecute) {
  try {
    const image = imageFile ? await fileToBase64(imageFile) : listing.image || null
    const service = {
      id: `s_${Date.now()}`,
      title: listing.title || 'Untitled Service',
      description: listing.description || '',
      price: listing.price || 0,
      image,
      createdAt: new Date().toISOString(),
    }

    if (typeof signAndExecute === 'function') {
      try {
        const maybePromise = signAndExecute(service)
        if (maybePromise && typeof maybePromise.then === 'function') {
          const res = await maybePromise
          service.tx = res
        }
      } catch (chainErr) {
        service.txError = chainErr && chainErr.message ? chainErr.message : String(chainErr)
      }
    }

    try {
      const useStore = require('../../store/useStore').default
      const store = useStore.getState()
      store.addService(service)
    } catch (e) {
      const raw = localStorage.getItem('marketplace_services')
      const list = raw ? JSON.parse(raw) : []
      list.push(service)
      localStorage.setItem('marketplace_services', JSON.stringify(list))
    }

    return service
  } catch (err) {
    throw err
  }
}

export default {
  createProfile,
  getUserProfile,
  createServiceListing,
}
