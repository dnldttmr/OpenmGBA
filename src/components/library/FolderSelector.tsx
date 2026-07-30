import { useEffect, useRef } from 'react'
import { useLibraryStore } from '../../store/libraryStore'
import { parseRomHeader } from '../../lib/rom/parseRomHeader'
import type { LibraryRom } from '../../store/libraryStore'

const ROM_EXTENSION = '.gba'

export function FolderSelector() {
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

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.name.toLowerCase().endsWith(ROM_EXTENSION),
    )
    event.target.value = ''

    if (files.length === 0) {
      setScanError('No .gba files found in the selected folder.')
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

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        disabled={isScanning}
        onClick={() => inputRef.current?.click()}
        className="rounded-md bg-neutral-800 px-3 py-2 text-sm font-medium text-neutral-100 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isScanning ? 'Scanning…' : 'Select ROM Folder'}
      </button>
      {scanError && <p className="text-xs text-red-400">{scanError}</p>}
    </div>
  )
}
