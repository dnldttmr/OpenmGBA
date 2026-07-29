import { useEmulatorStore } from '../../store/emulatorStore'

export function Header() {
  const currentRomName = useEmulatorStore((state) => state.currentRomName)
  const toggleSettingsDrawer = useEmulatorStore((state) => state.toggleSettingsDrawer)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-900 px-4 text-neutral-100">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold tracking-tight">OpenmGBA</span>
        {currentRomName && (
          <span className="text-sm text-neutral-400">{currentRomName}</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => toggleSettingsDrawer()}
        className="rounded-md px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
      >
        Settings
      </button>
    </header>
  )
}
