import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import ProgressRing from '@/components/atoms/ProgressRing'

const TopicCard = ({ category, lessonCount, completedCount, className = '' }) => {
  const navigate = useNavigate()
  const progress = lessonCount > 0 ? (completedCount / lessonCount) * 100 : 0
  
  const categoryInfo = {
    productivity: {
      title: 'Productivity',
      icon: 'Briefcase',
      color: '#5B5FDE',
      description: 'Master time and task management'
    },
    communication: {
      title: 'Communication',
      icon: 'MessageSquare',
      color: '#8B5CF6',
      description: 'Build stronger relationships'
    },
    nutrition: {
      title: 'Nutrition',
      icon: 'Apple',
      color: '#10B981',
      description: 'Develop healthy eating habits'
    },
    investing: {
      title: 'Investing',
      icon: 'TrendingUp',
      color: '#F59E0B',
      description: 'Grow your financial knowledge'
    }
  }
  
  const info = categoryInfo[category] || categoryInfo.productivity
  
  const handleClick = () => {
    navigate(`/topic/${category}`)
  }
  
  return (
    <motion.div
      className={`bg-white rounded-xl p-6 shadow-sm border border-surface-200 cursor-pointer ${className}`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${info.color}20` }}
          >
            <ApperIcon 
              name={info.icon} 
              size={24} 
              style={{ color: info.color }}
            />
          </div>
          <div>
            <h3 className="font-display font-semibold text-surface-900 text-lg">
              {info.title}
            </h3>
            <p className="text-surface-600 text-sm">
              {info.description}
            </p>
          </div>
        </div>
        
        <ProgressRing 
          progress={progress}
          size={50}
          strokeWidth={4}
          color={info.color}
          showPercentage={false}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-surface-600">
            {completedCount}/{lessonCount} lessons
          </span>
          {progress === 100 && (
            <div className="flex items-center space-x-1 text-success">
              <ApperIcon name="CheckCircle" size={16} />
              <span className="text-sm font-medium">Complete</span>
            </div>
          )}
        </div>
        
        <ApperIcon 
          name="ChevronRight" 
          size={20} 
          className="text-surface-400"
        />
      </div>
    </motion.div>
  )
}

export default TopicCard