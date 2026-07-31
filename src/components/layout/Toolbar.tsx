import { useEmulatorStore } from '../../store/emulatorStore'
import { BatteryIcon, ClockIcon, GamepadIcon } from '../icons/Icons'

export function Toolbar() {
  const toggleSettingsDrawer = useEmulatorStore((state) => state.toggleSettingsDrawer)
  const toggleAboutDrawer = useEmulatorStore((state) => state.toggleAboutDrawer)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 text-neutral-100">
      <div className="flex h-full items-center gap-6">
        <span className="font-mono text-sm font-bold tracking-wide">OpenmGBA</span>
        <nav className="flex h-full items-center gap-6 font-mono text-sm">
          <span className="flex h-full items-center border-b-2 border-violet-500 text-violet-300">
            Bibliothek
          </span>
          <button
            type="button"
            onClick={() => toggleSettingsDrawer()}
            className="flex h-full items-center border-b-2 border-transparent text-neutral-400 hover:text-neutral-100"
          >
            Einstellungen
          </button>
          <button
            type="button"
            onClick={() => toggleAboutDrawer()}
            className="flex h-full items-center border-b-2 border-transparent text-neutral-400 hover:text-neutral-100"
          >
            Über
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-4 text-neutral-500">
        <GamepadIcon className="h-4 w-4" />
        <BatteryIcon className="h-4 w-4" />
        <ClockIcon className="h-4 w-4" />
      </div>
    </header>
  )
}
