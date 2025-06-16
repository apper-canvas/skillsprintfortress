import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StreakDisplay = ({ streak = 0, size = 'medium', className = '' }) => {
  const sizes = {
    small: {
      container: 'px-3 py-2',
      icon: 20,
      text: 'text-sm',
      number: 'text-base'
    },
    medium: {
      container: 'px-4 py-3',
      icon: 24,
      text: 'text-base',
      number: 'text-lg'
    },
    large: {
      container: 'px-6 py-4',
      icon: 28,
      text: 'text-lg',
      number: 'text-xl'
    }
  }
  
  const config = sizes[size]
  
  // Calculate flame intensity based on streak
  const getFlameColor = () => {
    if (streak === 0) return 'text-surface-400'
    if (streak < 3) return 'text-orange-400'
    if (streak < 7) return 'text-orange-500'
    if (streak < 30) return 'text-red-500'
    return 'text-red-600'
  }
  
  const getFlameAnimation = () => {
    if (streak === 0) return {}
    return {
      animate: { 
        scale: [1, 1.1, 1],
        rotate: [0, 2, -2, 0]
      },
      transition: { 
        repeat: Infinity, 
        duration: 2,
        ease: "easeInOut"
      }
    }
  }
  
  return (
    <div className={`bg-white rounded-xl ${config.container} border border-surface-200 shadow-sm ${className}`}>
      <div className="flex items-center space-x-3">
        <motion.div
          {...getFlameAnimation()}
        >
          <ApperIcon 
            name="Flame" 
            size={config.icon}
            className={getFlameColor()}
          />
        </motion.div>
        
        <div>
          <div className="flex items-baseline space-x-1">
            <motion.span 
              className={`font-bold text-surface-900 ${config.number}`}
              key={streak}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {streak}
            </motion.span>
            <span className={`text-surface-600 ${config.text}`}>
              day{streak !== 1 ? 's' : ''}
            </span>
          </div>
          <p className={`text-surface-500 ${config.text}`}>
            {streak === 0 ? 'Start your streak!' : 'Learning streak'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StreakDisplay