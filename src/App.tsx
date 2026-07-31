import { LibraryScreen } from './screens/LibraryScreen'
import { PlayerScreen } from './screens/PlayerScreen'
import { useLibraryStore } from './store/libraryStore'

function App() {
  const activeRomId = useLibraryStore((state) => state.activeRomId)
  return activeRomId ? <PlayerScreen /> : <LibraryScreen />
}

export default App
