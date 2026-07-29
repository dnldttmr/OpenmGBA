import { Header } from './Header'
import { CanvasContainer } from './CanvasContainer'
import { ControlOverlay } from './ControlOverlay'
import { SettingsDrawer } from './SettingsDrawer'

export function AppLayout() {
  return (
    <div className="flex h-screen flex-col bg-neutral-950">
      <Header />
      <CanvasContainer />
      <ControlOverlay />
      <SettingsDrawer />
    </div>
  )
}
