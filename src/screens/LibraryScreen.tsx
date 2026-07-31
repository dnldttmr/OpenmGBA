import { Toolbar } from '../components/layout/Toolbar'
import { SettingsDrawer } from '../components/layout/SettingsDrawer'
import { AboutDrawer } from '../components/layout/AboutDrawer'
import { FolderSelector } from '../components/library/FolderSelector'
import { useLibraryStore } from '../store/libraryStore'

export function LibraryScreen() {
  const roms = useLibraryStore((state) => state.roms)
  const isScanning = useLibraryStore((state) => state.isScanning)
  const scanError = useLibraryStore((state) => state.scanError)

  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-neutral-100">
      <Toolbar />
      <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Library</h1>
          <FolderSelector />
        </div>
        {scanError && <p className="text-sm text-red-400">{scanError}</p>}
        {roms.length === 0 && !isScanning ? (
          <p className="text-sm text-neutral-500">
            No ROMs loaded yet. Select a folder to get started.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {roms.map((rom) => (
              <li
                key={rom.id}
                className="flex flex-col gap-1 rounded-md border border-neutral-800 bg-neutral-900 p-3"
              >
                <span className="truncate text-sm font-medium">
                  {rom.header.title || rom.fileName}
                </span>
                {rom.header.gameCode && (
                  <span className="truncate text-xs text-neutral-500">{rom.header.gameCode}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
      <SettingsDrawer />
      <AboutDrawer />
    </div>
  )
}
