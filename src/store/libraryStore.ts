import { create } from 'zustand'
import type { RomHeader } from '../lib/rom/parseRomHeader'

export interface LibraryRom {
  id: string
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
  setRoms: (roms: LibraryRom[]) => void
  setScanning: (isScanning: boolean) => void
  setScanError: (error: string | null) => void
}

export const useLibraryStore = create<LibraryState>((set) => ({
  roms: [],
  isScanning: false,
  scanError: null,
  setRoms: (roms) => set({ roms }),
  setScanning: (isScanning) => set({ isScanning }),
  setScanError: (scanError) => set({ scanError }),
}))
