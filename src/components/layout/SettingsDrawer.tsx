import { useEmulatorStore } from '../../store/emulatorStore'
import { useLibraryStore } from '../../store/libraryStore'
import { useFolderManager } from '../../hooks/useFolderManager'
import { FolderPlusIcon, RefreshIcon, TrashIcon } from '../icons/Icons'

export function SettingsDrawer() {
  const isOpen = useEmulatorStore((state) => state.isSettingsDrawerOpen)
  const toggleSettingsDrawer = useEmulatorStore((state) => state.toggleSettingsDrawer)
  const roms = useLibraryStore((state) => state.roms)
  const { folders, addFolder, removeFolder, renewFolderAccess } = useFolderManager()

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-10 bg-black/50"
        onClick={() => toggleSettingsDrawer(false)}
      />
      <aside className="fixed inset-y-0 right-0 z-20 flex w-80 flex-col border-l border-neutral-800 bg-neutral-950 p-4 text-neutral-100">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-base font-semibold">Einstellungen</h2>
          <button
            type="button"
            onClick={() => toggleSettingsDrawer(false)}
            className="rounded-md px-2 py-1 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
          >
            Schließen
          </button>
        </div>

        <h3 className="mb-2 font-mono text-xs tracking-widest text-neutral-500">ORDNER</h3>

        {folders.length === 0 ? (
          <p className="text-sm text-neutral-500">Noch keine Ordner ausgewählt.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {folders.map((folder) => {
              const romCount = roms.filter((rom) => rom.folderId === folder.id).length
              return (
                <li
                  key={folder.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm">{folder.name}</p>
                    <p className="text-xs text-neutral-500">{romCount} Spiele</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {folder.permissionState !== 'granted' && (
                      <button
                        type="button"
                        onClick={() => renewFolderAccess(folder.id)}
                        title="Zugriff erneuern"
                        className="rounded-md p-1.5 text-amber-400 hover:bg-neutral-800"
                      >
                        <RefreshIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFolder(folder.id)}
                      title="Ordner entfernen"
                      className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-red-400"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <button
          type="button"
          onClick={addFolder}
          className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-neutral-800 px-4 py-2 font-mono text-sm text-neutral-300 hover:bg-neutral-900"
        >
          <FolderPlusIcon className="h-4 w-4" />
          Ordner hinzufügen
        </button>
      </aside>
    </>
  )
}
