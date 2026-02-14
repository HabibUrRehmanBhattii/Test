import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directories
const dirs = [
  'src',
  'src/components',
  'public'
];

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created: ${dir}`);
  }
});

// Create main.jsx
const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
fs.writeFileSync(path.join(__dirname, 'src', 'main.jsx'), mainJsx);
console.log('Created: src/main.jsx');

// Create index.css
const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
}
`;
fs.writeFileSync(path.join(__dirname, 'src', 'index.css'), indexCss);
console.log('Created: src/index.css');

// Create App.jsx
const appJsx = `import { useState } from 'react'
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
`;
fs.writeFileSync(path.join(__dirname, 'src', 'App.jsx'), appJsx);
console.log('Created: src/App.jsx');

// Create CameraView.jsx
const cameraViewJsx = `import { useRef, useEffect, useState } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs'

export default function CameraView({ count, setCount, isCountingEnabled }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [model, setModel] = useState(null)
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [error, setError] = useState(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true)
        const loadedModel = await cocoSsd.load()
        setModel(loadedModel)
        setIsModelLoading(false)
      } catch (err) {
        setError('Failed to load AI model: ' + err.message)
        setIsModelLoading(false)
      }
    }
    loadModel()
  }, [])

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        setError('Camera access denied: ' + err.message)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const detectObjects = async () => {
      if (
        !model ||
        !videoRef.current ||
        !canvasRef.current ||
        videoRef.current.readyState !== 4 ||
        !isCountingEnabled
      ) {
        animationFrameRef.current = requestAnimationFrame(detectObjects)
        return
      }

      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      try {
        const predictions = await model.detect(video)
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        let detectedCount = 0
        predictions.forEach(prediction => {
          const [x, y, width, height] = prediction.bbox
          
          ctx.strokeStyle = '#00ff00'
          ctx.lineWidth = 3
          ctx.strokeRect(x, y, width, height)
          
          ctx.fillStyle = '#00ff00'
          ctx.font = '18px Arial'
          ctx.fillText(
            \`\${prediction.class} \${Math.round(prediction.score * 100)}%\`,
            x,
            y > 20 ? y - 5 : y + 20
          )
          
          detectedCount++
        })
        
        setCount(detectedCount)
      } catch (err) {
        console.error('Detection error:', err)
      }

      animationFrameRef.current = requestAnimationFrame(detectObjects)
    }

    if (model && isCountingEnabled) {
      detectObjects()
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [model, isCountingEnabled, setCount])

  return (
    <div className="relative flex-1 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg">
        <div className="text-center">
          <div className="text-sm font-medium">Count</div>
          <div className="text-3xl font-bold">{count}</div>
        </div>
      </div>

      {isModelLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-xl mb-2">Loading AI Model...</div>
            <div className="text-sm text-gray-300">Please wait</div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-red-600 text-white p-4 rounded-lg max-w-md">
            <div className="font-bold mb-2">Error</div>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      )}
    </div>
  )
}
`;
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'CameraView.jsx'), cameraViewJsx);
console.log('Created: src/components/CameraView.jsx');

// Create Controls.jsx
const controlsJsx = `export default function Controls({ count, setCount, isCountingEnabled, setIsCountingEnabled }) {
  const handleIncrement = () => setCount(prev => prev + 1)
  const handleDecrement = () => setCount(prev => Math.max(0, prev - 1))
  const handleReset = () => setCount(0)
  const toggleCounting = () => setIsCountingEnabled(prev => !prev)

  return (
    <div className="bg-gray-800 p-4 space-y-4">
      <div className="flex items-center justify-center gap-4 mb-2">
        <button
          onClick={toggleCounting}
          className={\`px-6 py-3 rounded-lg font-semibold transition-colors \${
            isCountingEnabled
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }\`}
        >
          {isCountingEnabled ? 'Pause Counting' : 'Resume Counting'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={handleDecrement}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-colors active:scale-95"
        >
          <span className="text-2xl">-</span>
        </button>
        
        <button
          onClick={handleReset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 rounded-lg transition-colors active:scale-95"
        >
          Reset
        </button>
        
        <button
          onClick={handleIncrement}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition-colors active:scale-95"
        >
          <span className="text-2xl">+</span>
        </button>
      </div>

      <div className="text-center text-gray-400 text-sm">
        Manual override controls
      </div>
    </div>
  )
}
`;
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'Controls.jsx'), controlsJsx);
console.log('Created: src/components/Controls.jsx');

// Create a simple SVG favicon
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#2563eb"/>
  <circle cx="50" cy="50" r="30" fill="white"/>
  <text x="50" y="65" font-size="40" font-weight="bold" text-anchor="middle" fill="#2563eb">P</text>
</svg>`;
fs.writeFileSync(path.join(__dirname, 'public', 'favicon.ico'), faviconSvg);
console.log('Created: public/favicon.ico');

console.log('\\nSetup complete! Run: npm run dev');
