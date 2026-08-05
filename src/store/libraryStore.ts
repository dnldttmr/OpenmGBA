import { create } from 'zustand'
import type { RomHeader } from '../lib/rom/parseRomHeader'

export interface LibraryRom {
  id: string
  folderId: string
  fileName: string
  relativePath: string
  size: number
  data: ArrayBuffer
  header: RomHeader
}

interface LibraryState {
  roms: LibraryRom[]
  isScanning: boolean
  scanError: string | null
  activeRomId: string | null
  addRoms: (folderId: string, roms: LibraryRom[]) => void
  removeRomsByFolder: (folderId: string) => void
  setScanning: (isScanning: boolean) => void
  setScanError: (error: string | null) => void
  setActiveRom: (romId: string | null) => void
}

export const useLibraryStore = create<LibraryState>((set) => ({
  roms: [],
  isScanning: false,
  scanError: null,
  activeRomId: null,
  addRoms: (folderId, roms) =>
    set((state) => ({
      roms: [...state.roms.filter((rom) => rom.folderId !== folderId), ...roms],
    })),
  removeRomsByFolder: (folderId) =>
    set((state) => {
      const roms = state.roms.filter((rom) => rom.folderId !== folderId)
      const activeRomId = state.roms.some(
        (rom) => rom.folderId === folderId && rom.id === state.activeRomId,
      )
        ? null
        : state.activeRomId
      return { roms, activeRomId }
    }),
  setScanning: (isScanning) => set({ isScanning }),
  setScanError: (scanError) => set({ scanError }),
  setActiveRom: (romId) => set({ activeRomId: romId }),
}))
