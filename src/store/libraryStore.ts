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
  addRoms: (folderId: string, roms: LibraryRom[]) => void
  removeRomsByFolder: (folderId: string) => void
  setScanning: (isScanning: boolean) => void
  setScanError: (error: string | null) => void
}

export const useLibraryStore = create<LibraryState>((set) => ({
  roms: [],
  isScanning: false,
  scanError: null,
  addRoms: (folderId, roms) =>
    set((state) => ({
      roms: [...state.roms.filter((rom) => rom.folderId !== folderId), ...roms],
    })),
  removeRomsByFolder: (folderId) =>
    set((state) => ({
      roms: state.roms.filter((rom) => rom.folderId !== folderId),
    })),
  setScanning: (isScanning) => set({ isScanning }),
  setScanError: (scanError) => set({ scanError }),
}))
