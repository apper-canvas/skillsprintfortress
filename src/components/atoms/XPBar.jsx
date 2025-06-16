import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const XPBar = ({ 
  currentXP = 0, 
  nextLevelXP = 1000, 
  showNumbers = true,
  className = ''
}) => {
  const [displayXP, setDisplayXP] = useState(0)
  const progress = (currentXP % 1000) / (nextLevelXP - (Math.floor(currentXP / 1000) * 1000)) * 100
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayXP(currentXP)
    }, 100)
    return () => clearTimeout(timer)
  }, [currentXP])
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        {showNumbers && (
          <>
            <span className="text-sm font-medium text-surface-600">
              {displayXP % 1000} XP
            </span>
            <span className="text-sm font-medium text-surface-600">
              {Math.floor(currentXP / 1000) * 1000 + 1000} XP
            </span>
          </>
        )}
      </div>
      
      <div className="w-full bg-surface-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shimmer"></div>
        </motion.div>
      </div>
    </div>
  )
}

export default XPBar