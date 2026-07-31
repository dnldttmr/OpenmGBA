import { useEffect, useRef, type ChangeEvent } from 'react'
import { useLibraryStore } from '../store/libraryStore'
import { parseRomHeader } from '../lib/rom/parseRomHeader'
import type { LibraryRom } from '../store/libraryStore'

const ROM_EXTENSION = '.gba'

export function useFolderPicker() {
  const inputRef = useRef<HTMLInputElement>(null)
  const isScanning = useLibraryStore((state) => state.isScanning)
  const scanError = useLibraryStore((state) => state.scanError)
  const setRoms = useLibraryStore((state) => state.setRoms)
  const setScanning = useLibraryStore((state) => state.setScanning)
  const setScanError = useLibraryStore((state) => state.setScanError)

  useEffect(() => {
    // webkitdirectory has no React/JSX typing but is supported by all major browsers.
    inputRef.current?.setAttribute('webkitdirectory', '')
  }, [])

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.name.toLowerCase().endsWith(ROM_EXTENSION),
    )
    event.target.value = ''

    if (files.length === 0) {
      setScanError('Keine .gba-Dateien im ausgewählten Ordner gefunden.')
      return
    }

    setScanError(null)
    setScanning(true)

    try {
      const roms: LibraryRom[] = await Promise.all(
        files.map(async (file, index) => {
          const data = await file.arrayBuffer()
          return {
            id: `${file.webkitRelativePath || file.name}-${index}`,
            fileName: file.name,
            relativePath: file.webkitRelativePath || file.name,
            size: file.size,
            data,
            header: parseRomHeader(data),
          }
        }),
      )
      setRoms(roms)
    } finally {
      setScanning(false)
    }
  }

  return {
    inputRef,
    isScanning,
    scanError,
    handleChange,
    pickFolder: () => inputRef.current?.click(),
  }
}
