import { useState } from 'react'
import CameraView from './components/CameraView'
import Controls from './components/Controls'

function App() {
  const [count, setCount] = useState(0)
  const [isCountingEnabled, setIsCountingEnabled] = useState(true)

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Pill Counter</h1>
      </header>
      
      <main className="flex-1 flex flex-col">
        <CameraView 
          count={count}
          setCount={setCount}
          isCountingEnabled={isCountingEnabled}
        />
        
        <Controls
          count={count}
          setCount={setCount}
          isCountingEnabled={isCountingEnabled}
          setIsCountingEnabled={setIsCountingEnabled}
        />
      </main>
    </div>
  )
}

export default App
