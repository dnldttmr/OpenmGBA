import { useEmulatorStore, EmulatorStatus } from '../../store/emulatorStore'

export function ControlOverlay() {
  const status = useEmulatorStore((state) => state.status)
  const setStatus = useEmulatorStore((state) => state.setStatus)

  const canPlayPause = status === EmulatorStatus.RUNNING || status === EmulatorStatus.PAUSED

  return (
    <div className="flex h-16 shrink-0 items-center justify-center gap-3 border-t border-neutral-800 bg-neutral-900 px-4">
      <button
        type="button"
        disabled={!canPlayPause}
        onClick={() =>
          setStatus(status === EmulatorStatus.RUNNING ? EmulatorStatus.PAUSED : EmulatorStatus.RUNNING)
        }
        className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-100 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === EmulatorStatus.RUNNING ? 'Pause' : 'Play'}
      </button>
      <button
        type="button"
        disabled={!canPlayPause}
        onClick={() => setStatus(EmulatorStatus.IDLE)}
        className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-100 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Reset
      </button>
    </div>
  )
}
