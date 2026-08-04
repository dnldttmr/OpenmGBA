import { useEffect } from 'react'
import { useLibraryStore } from '../store/libraryStore'

interface NavigationHistoryState {
  romId: string | null
}

function readHistoryRomId(): string | null {
  const state = window.history.state as NavigationHistoryState | null
  return state?.romId ?? null
}

/**
 * Keeps the browser history stack in sync with the active ROM.
 *
 * Opening a game pushes a history entry, so the device/browser back button
 * (and the in-app "← Bibliothek" control) returns the user to the library
 * instead of leaving the app or doing nothing.
 */
export function useHistorySync() {
  const activeRomId = useLibraryStore((state) => state.activeRomId)
  const setActiveRom = useLibraryStore((state) => state.setActiveRom)

  // Seed a history entry for the initial screen on mount, so there is
  // always something to compare against once navigation starts.
  useEffect(() => {
    const state = window.history.state as NavigationHistoryState | null
    if (state == null || typeof state.romId === 'undefined') {
      const seeded: NavigationHistoryState = { romId: activeRomId }
      window.history.replaceState(seeded, '')
    }
    // Only ever seed once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Browser/device back (and forward) button -> update app state.
  useEffect(() => {
    function handlePopState(event: PopStateEvent) {
      const romId = (event.state as NavigationHistoryState | null)?.romId ?? null
      setActiveRom(romId)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [setActiveRom])

  // App state -> history stack.
  useEffect(() => {
    const historyRomId = readHistoryRomId()
    if (historyRomId === activeRomId) return // Already in sync (e.g. change came from popstate).

    if (activeRomId) {
      const next: NavigationHistoryState = { romId: activeRomId }
      window.history.pushState(next, '')
    } else if (historyRomId) {
      // Left the player via an in-app control (not the back button): pop the
      // history entry that was pushed when the game was opened, so the stack
      // stays consistent with a real back navigation.
      window.history.back()
    } else {
      const next: NavigationHistoryState = { romId: null }
      window.history.replaceState(next, '')
    }
  }, [activeRomId])
}
