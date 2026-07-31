import { useEmulatorStore } from '../../store/emulatorStore'

export function SettingsDrawer() {
  const isOpen = useEmulatorStore((state) => state.isSettingsDrawerOpen)
  const toggleSettingsDrawer = useEmulatorStore((state) => state.toggleSettingsDrawer)

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-10 bg-black/50"
        onClick={() => toggleSettingsDrawer(false)}
      />
      <aside className="fixed inset-y-0 right-0 z-20 flex w-80 flex-col border-l border-neutral-800 bg-neutral-900 p-4 text-neutral-100">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Settings</h2>
          <button
            type="button"
            onClick={() => toggleSettingsDrawer(false)}
            className="rounded-md px-2 py-1 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
          >
            Close
          </button>
        </div>
        <p className="text-sm text-neutral-500">Folder management is coming soon.</p>
      </aside>
    </>
  )
}
