import { useEmulatorStore, EmulatorStatus } from '../../store/emulatorStore'

export function CanvasContainer() {
  const status = useEmulatorStore((state) => state.status)

  return (
    <div className="relative flex flex-1 items-center justify-center bg-black">
      <canvas
        id="emulator-canvas"
        width={240}
        height={160}
        className="aspect-[3/2] w-full max-w-3xl bg-black [image-rendering:pixelated]"
      />
      {status === EmulatorStatus.IDLE && (
        <p className="absolute text-sm text-neutral-500">
          Select a ROM to start playing
        </p>
      )}
    </div>
  )
}
