import { Navigate, Route, Routes } from 'react-router-dom'
import { LibraryScreen } from './screens/LibraryScreen'
import { PlayerScreen } from './screens/PlayerScreen'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LibraryScreen />} />
      <Route path="/game-boy-advance" element={<LibraryScreen />} />
      <Route path="/game-boy-advance/game/:romId" element={<PlayerScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
