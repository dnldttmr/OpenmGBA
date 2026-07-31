interface ControlOverlayProps {
  isReady: boolean
  isPlaying: boolean
  onPlayPause: () => void
  onReset: () => void
}

export function ControlOverlay({ isReady, isPlaying, onPlayPause, onReset }: ControlOverlayProps) {
  return (
    <div className="flex h-16 shrink-0 items-center justify-center gap-3 border-t border-neutral-800 bg-neutral-900 px-4">
      <button
        type="button"
        disabled={!isReady}
        onClick={onPlayPause}
        className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button
        type="button"
        disabled={!isReady}
        onClick={onReset}
        className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-100 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Reset
      </button>
    </div>
  )
}
