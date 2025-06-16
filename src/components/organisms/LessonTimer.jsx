import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const LessonTimer = ({ 
  duration = 5, 
  isActive = false, 
  onComplete,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60) // Convert to seconds
  const [isPaused, setIsPaused] = useState(!isActive)
  
  const totalSeconds = duration * 60
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100
  
  useEffect(() => {
    setIsPaused(!isActive)
  }, [isActive])
  
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [isPaused, timeLeft, onComplete])
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const toggleTimer = () => {
    setIsPaused(!isPaused)
  }
  
  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-surface-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Clock" size={20} className="text-surface-600" />
          <span className="font-medium text-surface-900">
            {formatTime(timeLeft)}
          </span>
        </div>
        
        <button
          onClick={toggleTimer}
          className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
        >
          <ApperIcon 
            name={isPaused ? "Play" : "Pause"} 
            size={16} 
            className="text-surface-600"
          />
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-surface-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-2 text-xs text-surface-500">
        <span>Started</span>
        <span>{formatTime(totalSeconds)} total</span>
      </div>
    </div>
  )
}

export default LessonTimer