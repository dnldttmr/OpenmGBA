import { create } from 'zustand'

const STORAGE_KEY = 'openmgba:recently-played'

function loadInitial(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

interface RecentlyPlayedState {
  lastPlayedByRomId: Record<string, number>
  recordPlayed: (romId: string) => void
}

export const useRecentlyPlayedStore = create<RecentlyPlayedState>((set, get) => ({
  lastPlayedByRomId: loadInitial(),
  recordPlayed: (romId) => {
    const lastPlayedByRomId = { ...get().lastPlayedByRomId, [romId]: Date.now() }
    set({ lastPlayedByRomId })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lastPlayedByRomId))
  },
}))
