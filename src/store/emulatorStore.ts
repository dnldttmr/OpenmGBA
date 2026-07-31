import { create } from 'zustand'

interface EmulatorState {
  isSettingsDrawerOpen: boolean
  isAboutDrawerOpen: boolean
  toggleSettingsDrawer: (open?: boolean) => void
  toggleAboutDrawer: (open?: boolean) => void
}

export const useEmulatorStore = create<EmulatorState>((set) => ({
  isSettingsDrawerOpen: false,
  isAboutDrawerOpen: false,
  toggleSettingsDrawer: (open) =>
    set((state) => ({
      isSettingsDrawerOpen: open ?? !state.isSettingsDrawerOpen,
    })),
  toggleAboutDrawer: (open) =>
    set((state) => ({
      isAboutDrawerOpen: open ?? !state.isAboutDrawerOpen,
    })),
}))
