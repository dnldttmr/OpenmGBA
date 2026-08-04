import { LibraryScreen } from './screens/LibraryScreen'
import { PlayerScreen } from './screens/PlayerScreen'
import { useLibraryStore } from './store/libraryStore'
import { useHistorySync } from './hooks/useHistorySync'

function App() {
  const activeRomId = useLibraryStore((state) => state.activeRomId)
  useHistorySync()
  return activeRomId ? <PlayerScreen /> : <LibraryScreen />
}

export default App
