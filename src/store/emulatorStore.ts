import { create } from 'zustand'

export const EmulatorStatus = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
} as const

export type EmulatorStatus = (typeof EmulatorStatus)[keyof typeof EmulatorStatus]

interface EmulatorState {
  status: EmulatorStatus
  currentRomName: string | null
  isSettingsDrawerOpen: boolean
  isAboutDrawerOpen: boolean
  setStatus: (status: EmulatorStatus) => void
  setCurrentRom: (romName: string | null) => void
  toggleSettingsDrawer: (open?: boolean) => void
  toggleAboutDrawer: (open?: boolean) => void
}

export const useEmulatorStore = create<EmulatorState>((set) => ({
  status: EmulatorStatus.IDLE,
  currentRomName: null,
  isSettingsDrawerOpen: false,
  isAboutDrawerOpen: false,
  setStatus: (status) => set({ status }),
  setCurrentRom: (romName) => set({ currentRomName: romName }),
  toggleSettingsDrawer: (open) =>
    set((state) => ({
      isSettingsDrawerOpen: open ?? !state.isSettingsDrawerOpen,
    })),
  toggleAboutDrawer: (open) =>
    set((state) => ({
      isAboutDrawerOpen: open ?? !state.isAboutDrawerOpen,
    })),
}))
