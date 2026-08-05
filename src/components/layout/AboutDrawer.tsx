import { useEmulatorStore } from '../../store/emulatorStore'

export function AboutDrawer() {
  const isOpen = useEmulatorStore((state) => state.isAboutDrawerOpen)
  const toggleAboutDrawer = useEmulatorStore((state) => state.toggleAboutDrawer)

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-10 bg-black/50"
        onClick={() => toggleAboutDrawer(false)}
      />
      <aside className="fixed inset-y-0 right-0 z-20 flex w-80 flex-col border-l border-neutral-800 bg-neutral-950 p-4 text-neutral-100">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-base font-semibold">Über</h2>
          <button
            type="button"
            onClick={() => toggleAboutDrawer(false)}
            className="rounded-md px-2 py-1 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
          >
            Schließen
          </button>
        </div>
        <p className="text-sm text-neutral-300">
          OpenmGBA ist ein browserbasiertes Game Boy Advance Emulator-Frontend.
        </p>
        <a
          href="https://github.com/dnldttmr/RetroPlay"
          target="_blank"
          rel="noreferrer"
          className="mt-4 text-sm text-violet-400 underline hover:text-violet-300"
        >
          Auf GitHub ansehen
        </a>
      </aside>
    </>
  )
}
