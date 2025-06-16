import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const LessonCard = ({ lesson, isCompleted = false, className = '' }) => {
  const navigate = useNavigate()
  
  const difficultyInfo = {
    beginner: { color: 'text-green-600', bg: 'bg-green-100', label: 'Beginner' },
    intermediate: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Intermediate' },
    advanced: { color: 'text-red-600', bg: 'bg-red-100', label: 'Advanced' }
  }
  
  const difficulty = difficultyInfo[lesson.difficulty] || difficultyInfo.beginner
  
  const handleClick = () => {
    navigate(`/lesson/${lesson.id}`)
  }
  
  return (
    <motion.div
      className={`bg-white rounded-xl p-4 shadow-sm border border-surface-200 cursor-pointer ${className}`}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-surface-900 text-base mb-1 break-words">
            {lesson.title}
          </h3>
          <div className="flex items-center space-x-3 text-sm text-surface-600">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Clock" size={14} />
              <span>{lesson.duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Star" size={14} />
              <span>{lesson.xpReward} XP</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-3">
          {isCompleted && (
            <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <ApperIcon name="Check" size={14} className="text-white" />
            </div>
          )}
          <ApperIcon 
            name="ChevronRight" 
            size={16} 
            className="text-surface-400"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${difficulty.bg} ${difficulty.color}`}>
          {difficulty.label}
        </div>
        
        {!isCompleted && (
          <motion.div
            className="flex items-center space-x-1 text-primary"
            whileHover={{ x: 2 }}
          >
            <span className="text-sm font-medium">Start</span>
            <ApperIcon name="Play" size={14} />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default LessonCard