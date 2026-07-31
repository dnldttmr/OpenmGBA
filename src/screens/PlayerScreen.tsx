import { useMemo, useRef } from 'react'
import { useLibraryStore } from '../store/libraryStore'
import { useMgba } from '../hooks/useMgba'
import { CanvasContainer } from '../components/layout/CanvasContainer'
import { ControlOverlay } from '../components/layout/ControlOverlay'

export function PlayerScreen() {
  const activeRomId = useLibraryStore((state) => state.activeRomId)
  const roms = useLibraryStore((state) => state.roms)
  const setActiveRom = useLibraryStore((state) => state.setActiveRom)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const rom = useMemo(() => roms.find((r) => r.id === activeRomId) ?? null, [roms, activeRomId])

  const { isReady, isPlaying, error, play, pause, reset } = useMgba(canvasRef, rom?.data ?? null, {
    fileName: rom?.fileName,
  })

  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-neutral-100">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-neutral-800 bg-neutral-900 px-4">
        <button
          type="button"
          onClick={() => setActiveRom(null)}
          className="rounded-md px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
        >
          ← Library
        </button>
        <span className="truncate text-sm text-neutral-400">
          {rom?.header.title || rom?.fileName}
        </span>
      </header>
      {rom ? (
        <>
          <CanvasContainer canvasRef={canvasRef} isReady={isReady} error={error} />
          <ControlOverlay
            isReady={isReady}
            isPlaying={isPlaying}
            onPlayPause={() => (isPlaying ? pause() : play())}
            onReset={reset}
          />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-neutral-500">ROM not found.</p>
        </div>
      )}
    </div>
  )
}
