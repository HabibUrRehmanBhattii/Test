export default function Controls({ count, setCount, isCountingEnabled, setIsCountingEnabled }) {
  const handleIncrement = () => setCount(prev => prev + 1)
  const handleDecrement = () => setCount(prev => Math.max(0, prev - 1))
  const handleReset = () => setCount(0)
  const toggleCounting = () => setIsCountingEnabled(prev => !prev)

  return (
    <div className="bg-gray-800 p-4 space-y-4">
      <div className="flex items-center justify-center gap-4 mb-2">
        <button
          onClick={toggleCounting}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            isCountingEnabled
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
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
