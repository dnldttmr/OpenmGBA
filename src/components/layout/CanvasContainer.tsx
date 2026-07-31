import type { RefObject } from 'react'

interface CanvasContainerProps {
  canvasRef: RefObject<HTMLCanvasElement | null>
  isReady: boolean
  error: string | null
}

export function CanvasContainer({ canvasRef, isReady, error }: CanvasContainerProps) {
  return (
    <div className="relative flex flex-1 items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        width={240}
        height={160}
        className="aspect-[3/2] w-full max-w-3xl bg-black [image-rendering:pixelated]"
      />
      {!isReady && !error && (
        <p className="absolute text-sm text-neutral-500">Loading…</p>
      )}
      {error && <p className="absolute max-w-sm text-center text-sm text-red-400">{error}</p>}
    </div>
  )
}
