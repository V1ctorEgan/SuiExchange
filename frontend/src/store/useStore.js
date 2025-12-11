import create from 'zustand'
import { persist } from 'zustand/middleware'

// Global app store persisted to localStorage
export const useStore = create(persist((set, get) => ({
  // User/profile
  user: {
    id: null,
    username: null,
    avatar: null,
    bio: null,
    skills: [],
    role: null,
  },
  // Marketplace lists
  profiles: [],
  services: [],

  // Settings
  settings: {
    showOnline: false,
    allowMessages: true,
    newMessages: true,
    walletActivity: true,
    marketUpdates: false,
  },

  // Actions
  setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
  clearUser: () => set({ user: { id: null, username: null, avatar: null, bio: null, skills: [], role: null } }),

  addProfile: (profile) => set((state) => ({ profiles: [...state.profiles, profile] })),
  updateProfile: (id, patch) => set((state) => ({ profiles: state.profiles.map(p => p.id === id ? { ...p, ...patch } : p) })),
  removeProfile: (id) => set((state) => ({ profiles: state.profiles.filter(p => p.id !== id) })),
  getProfileById: (id) => get().profiles.find(p => p.id === id),

  addService: (service) => set((state) => ({ services: [...state.services, service] })),

  setSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),

}), { 
  name: 'sui-exchange-store',
  // Custom serialization to exclude large binary data (avatars) from persistence
  serialize: (state) => {
    const stateToPersist = {
      ...state,
      state: {
        ...state.state,
        user: { ...state.state.user, avatar: null }, // exclude avatar
        profiles: state.state.profiles.map(p => ({ ...p, avatar: null, cardImage: null })) // exclude images
      }
    }
    return JSON.stringify(stateToPersist)
  },
  deserialize: (str) => JSON.parse(str)
}))

export default useStore
