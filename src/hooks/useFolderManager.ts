import { useRef, type ChangeEvent } from 'react'
import { useLibraryStore } from '../store/libraryStore'
import { useFolderStore } from '../store/folderStore'
import { parseRomHeader } from '../lib/rom/parseRomHeader'
import { scanDirectoryForRoms } from '../lib/rom/scanDirectory'
import { deleteFolderHandle, loadStoredFolders, saveFolderHandle } from '../lib/folderPersistence'
import type { LibraryRom } from '../store/libraryStore'

const ROM_EXTENSION = '.gba'

export const isFileSystemAccessSupported = typeof window !== 'undefined' && 'showDirectoryPicker' in window

export function useFolderManager() {
  const inputRef = useRef<HTMLInputElement>(null)
  const isScanning = useLibraryStore((state) => state.isScanning)
  const scanError = useLibraryStore((state) => state.scanError)
  const addRoms = useLibraryStore((state) => state.addRoms)
  const removeRomsByFolder = useLibraryStore((state) => state.removeRomsByFolder)
  const setScanning = useLibraryStore((state) => state.setScanning)
  const setScanError = useLibraryStore((state) => state.setScanError)

  const folders = useFolderStore((state) => state.folders)
  const addFolderEntry = useFolderStore((state) => state.addFolder)
  const removeFolderEntry = useFolderStore((state) => state.removeFolder)
  const setFolderPermission = useFolderStore((state) => state.setFolderPermission)

  async function scanAndStore(folderId: string, handle: FileSystemDirectoryHandle) {
    setScanning(true)
    try {
      const roms = await scanDirectoryForRoms(folderId, handle)
      addRoms(folderId, roms)
      if (roms.length === 0) {
        setScanError('Keine .gba-Dateien im ausgewählten Ordner gefunden.')
      } else {
        setScanError(null)
      }
    } finally {
      setScanning(false)
    }
  }

  async function addFolder() {
    if (!isFileSystemAccessSupported) {
      inputRef.current?.click()
      return
    }

    try {
      const handle = await window.showDirectoryPicker({ mode: 'read' })
      const id = crypto.randomUUID()
      await saveFolderHandle(id, handle.name, handle)
      addFolderEntry({ id, name: handle.name, handle, permissionState: 'granted' })
      await scanAndStore(id, handle)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setScanError('Der Ordner konnte nicht gelesen werden.')
    }
  }

  async function restorePersistedFolders() {
    const stored = await loadStoredFolders()
    for (const { id, name, handle } of stored) {
      const permissionState = await handle.queryPermission({ mode: 'read' })
      addFolderEntry({ id, name, handle, permissionState })
      if (permissionState === 'granted') {
        await scanAndStore(id, handle)
      }
    }
  }

  async function renewFolderAccess(id: string) {
    const folder = folders.find((entry) => entry.id === id)
    if (!folder?.handle) return

    const permissionState = await folder.handle.requestPermission({ mode: 'read' })
    setFolderPermission(id, permissionState)
    if (permissionState === 'granted') {
      await scanAndStore(id, folder.handle)
    }
  }

  async function removeFolder(id: string) {
    await deleteFolderHandle(id)
    removeFolderEntry(id)
    removeRomsByFolder(id)
  }

  async function handleFallbackChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.name.toLowerCase().endsWith(ROM_EXTENSION),
    )
    event.target.value = ''

    if (files.length === 0) {
      setScanError('Keine .gba-Dateien im ausgewählten Ordner gefunden.')
      return
    }

    const id = crypto.randomUUID()
    const folderName = files[0].webkitRelativePath.split('/')[0] || 'Ordner'

    setScanError(null)
    setScanning(true)

    try {
      const roms: LibraryRom[] = await Promise.all(
        files.map(async (file, index) => {
          const data = await file.arrayBuffer()
          return {
            id: `${id}/${file.webkitRelativePath || file.name}-${index}`,
            folderId: id,
            fileName: file.name,
            relativePath: file.webkitRelativePath || file.name,
            size: file.size,
            data,
            header: parseRomHeader(data),
          }
        }),
      )
      addFolderEntry({ id, name: folderName, handle: null, permissionState: 'granted' })
      addRoms(id, roms)
    } finally {
      setScanning(false)
    }
  }

  return {
    inputRef,
    isScanning,
    scanError,
    folders,
    addFolder,
    removeFolder,
    renewFolderAccess,
    restorePersistedFolders,
    handleFallbackChange,
  }
}
