import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  badge, 
  earned = false, 
  size = 'medium',
  showShimmer = false,
  onClick,
  className = ''
}) => {
  const sizes = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  }
  
  const iconSizes = {
    small: 20,
    medium: 28,
    large: 36
  }
  
  const rarityColors = {
    common: 'from-surface-400 to-surface-500',
    uncommon: 'from-green-400 to-green-500',
    rare: 'from-blue-400 to-blue-500',
    epic: 'from-purple-400 to-purple-500',
    legendary: 'from-yellow-400 to-yellow-500'
  }
  
  return (
    <motion.div
      className={`${sizes[size]} relative cursor-pointer ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
      <div className={`
        w-full h-full rounded-full flex items-center justify-center relative overflow-hidden
        ${earned 
          ? `bg-gradient-to-br ${rarityColors[badge.rarity] || rarityColors.common} shadow-lg` 
          : 'bg-surface-200 opacity-50'
        }
      `}>
        <ApperIcon 
          name={badge.icon} 
          size={iconSizes[size]}
          className={earned ? 'text-white' : 'text-surface-400'}
        />
        
        {/* Shimmer effect for newly earned badges */}
        {earned && showShimmer && (
          <div className="absolute inset-0 shimmer rounded-full"></div>
        )}
        
        {/* Lock icon for unearned badges */}
        {!earned && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-300/80 rounded-full">
            <ApperIcon name="Lock" size={iconSizes[size] / 2} className="text-surface-500" />
          </div>
        )}
      </div>
      
      {/* Badge name tooltip */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-surface-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {badge.name}
        </div>
      </div>
    </motion.div>
  )
}

export default Badge