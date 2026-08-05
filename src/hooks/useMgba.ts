import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import mGBA, { type mGBAEmulator } from '@thenick775/mgba-wasm'

const DEFAULT_SAVE_SLOT = 0

export interface UseMgbaOptions {
  fileName?: string
  autoPlay?: boolean
}

export interface UseMgbaControls {
  isReady: boolean
  isPlaying: boolean
  error: string | null
  play: () => void
  pause: () => void
  reset: () => void
  setSpeed: (multiplier: number) => void
  saveState: (slot?: number) => boolean
  loadState: (slot?: number) => boolean
}

export function useMgba(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  romBuffer: ArrayBuffer | null,
  options: UseMgbaOptions = {},
): UseMgbaControls {
  const { fileName = 'game.gba', autoPlay = true } = options
  const moduleRef = useRef<mGBAEmulator | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const buffer = romBuffer
    if (!canvas || !buffer) return

    let cancelled = false
    setIsReady(false)
    setIsPlaying(false)
    setError(null)

    async function boot(canvas: HTMLCanvasElement, buffer: ArrayBuffer) {
      try {
        const emulator = await mGBA({ canvas })
        if (cancelled) {
          emulator.quitMgba()
          return
        }
        await emulator.FSInit()

        const file = new File([buffer], fileName)
        await new Promise<void>((resolve) => emulator.uploadRom(file, () => resolve()))
        if (cancelled) {
          emulator.quitMgba()
          return
        }

        const loaded = emulator.loadGame(`${emulator.filePaths().gamePath}/${file.name}`)
        if (!loaded) throw new Error('Failed to load ROM into the mGBA core.')

        if (autoPlay) {
          emulator.resumeGame()
          setIsPlaying(true)
        } else {
          emulator.pauseGame()
        }

        moduleRef.current = emulator
        setIsReady(true)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to start the emulator.')
        }
      }
    }

    boot(canvas, buffer)

    return () => {
      cancelled = true
      try {
        // The Emscripten runtime unwinds its C stack by throwing on exit;
        // left uncaught, that exception surfaces during this unmount and
        // takes the whole React tree down with it (blank screen on navigating
        // away from the player, even though the route itself is fine).
        moduleRef.current?.quitMgba()
      } catch (err) {
        console.error('Failed to cleanly shut down the mGBA core', err)
      }
      moduleRef.current = null
      setIsReady(false)
      setIsPlaying(false)
    }
  }, [canvasRef, romBuffer, fileName, autoPlay])

  const play = useCallback(() => {
    if (!moduleRef.current) return
    moduleRef.current.resumeGame()
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    if (!moduleRef.current) return
    moduleRef.current.pauseGame()
    setIsPlaying(false)
  }, [])

  const reset = useCallback(() => {
    if (!moduleRef.current) return
    moduleRef.current.quickReload()
    setIsPlaying(true)
  }, [])

  const setSpeed = useCallback((multiplier: number) => {
    moduleRef.current?.setFastForwardMultiplier(multiplier)
  }, [])

  const saveState = useCallback((slot: number = DEFAULT_SAVE_SLOT) => {
    return moduleRef.current?.saveState(slot) ?? false
  }, [])

  const loadState = useCallback((slot: number = DEFAULT_SAVE_SLOT) => {
    return moduleRef.current?.loadState(slot) ?? false
  }, [])

  return { isReady, isPlaying, error, play, pause, reset, setSpeed, saveState, loadState }
}
