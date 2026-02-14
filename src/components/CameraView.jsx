import { useRef, useEffect, useState } from 'react'
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
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError('Camera API not available. Please use HTTPS or localhost.')
          return
        }
        
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
            `${prediction.class} ${Math.round(prediction.score * 100)}%`,
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
