import { useEffect, useRef } from 'react'
import { Toolbar } from '../components/layout/Toolbar'
import { SettingsDrawer } from '../components/layout/SettingsDrawer'
import { AboutDrawer } from '../components/layout/AboutDrawer'
import { Sidebar } from '../components/library/Sidebar'
import { FolderPlusIcon, GamepadIcon, InfoIcon } from '../components/icons/Icons'
import { useLibraryStore } from '../store/libraryStore'
import { useFolderManager } from '../hooks/useFolderManager'

export function LibraryScreen() {
  const roms = useLibraryStore((state) => state.roms)
  const setActiveRom = useLibraryStore((state) => state.setActiveRom)
  const { inputRef, isScanning, scanError, handleFallbackChange, addFolder, restorePersistedFolders } =
    useFolderManager()
  const hasRestoredFolders = useRef(false)

  useEffect(() => {
    if (hasRestoredFolders.current) return
    hasRestoredFolders.current = true
    void restorePersistedFolders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-neutral-100">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onPickFolder={addFolder} isScanning={isScanning} />
        <main className="relative flex flex-1 flex-col overflow-y-auto p-8">
          <input ref={inputRef} type="file" multiple className="hidden" onChange={handleFallbackChange} />
          {scanError && <p className="mb-4 text-sm text-red-400">{scanError}</p>}

          {roms.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="relative flex max-w-md flex-col items-center gap-4 px-10 py-10 text-center">
                <span className="pointer-events-none absolute top-0 left-0 h-6 w-6 border-t border-l border-neutral-700" />
                <span className="pointer-events-none absolute top-0 right-0 h-6 w-6 border-t border-r border-neutral-700" />
                <span className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b border-l border-neutral-700" />
                <span className="pointer-events-none absolute right-0 bottom-0 h-6 w-6 border-r border-b border-neutral-700" />

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900">
                  <GamepadIcon className="h-7 w-7 text-neutral-400" />
                </div>
                <h1 className="font-serif text-3xl">Noch keine Spiele hinzugefügt</h1>
                <p className="text-sm text-neutral-400">
                  Deine Bibliothek ist zur Zeit leer. Verbinde deinen lokalen Speicher, um deine
                  klassischen GBA Abenteuer zu importieren.
                </p>
                <button
                  type="button"
                  onClick={addFolder}
                  disabled={isScanning}
                  className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FolderPlusIcon className="h-4 w-4" />
                  {isScanning ? 'Wird gescannt…' : 'Spieleordner wählen'}
                </button>
                <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <InfoIcon className="h-3.5 w-3.5 shrink-0" />
                  Wähle einen Ordner mit .gba Dateien aus, um deine Bibliothek zu füllen.
                </p>
              </div>
            </div>
          ) : (
            <>
              <h1 className="mb-6 font-serif text-2xl">Alle Spiele</h1>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {roms.map((rom) => (
                  <li key={rom.id}>
                    <button
                      type="button"
                      onClick={() => setActiveRom(rom.id)}
                      className="flex w-full flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-left transition-colors hover:border-violet-500/60 hover:bg-neutral-800"
                    >
                      <span className="truncate text-sm font-medium">
                        {rom.header.title || rom.fileName}
                      </span>
                      {rom.header.gameCode && (
                        <span className="truncate font-mono text-xs text-neutral-500">
                          {rom.header.gameCode}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
      <SettingsDrawer />
      <AboutDrawer />
    </div>
  )
}
