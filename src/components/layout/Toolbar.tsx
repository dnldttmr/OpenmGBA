import { useEmulatorStore } from '../../store/emulatorStore'

export function Toolbar() {
  const toggleSettingsDrawer = useEmulatorStore((state) => state.toggleSettingsDrawer)
  const toggleAboutDrawer = useEmulatorStore((state) => state.toggleAboutDrawer)

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-neutral-800 bg-neutral-900 px-4 text-neutral-100">
      <span className="text-lg font-semibold tracking-tight">OpenmGBA</span>
      <nav className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => toggleSettingsDrawer()}
          className="rounded-md px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
        >
          Settings
        </button>
        <button
          type="button"
          onClick={() => toggleAboutDrawer()}
          className="rounded-md px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
        >
          About
        </button>
      </nav>
    </header>
  )
}
