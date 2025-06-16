import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { userService } from '@/services'

const DailyGoalWidget = ({ user, onUserUpdate, className = '' }) => {
  const [dailyProgress, setDailyProgress] = useState(user?.dailyProgress || 0)
  const [loading, setLoading] = useState(false)
  
  const dailyGoal = user?.dailyGoal || 2
  const progress = Math.min((dailyProgress / dailyGoal) * 100, 100)
  const isCompleted = dailyProgress >= dailyGoal
  
  useEffect(() => {
    setDailyProgress(user?.dailyProgress || 0)
  }, [user])
  
  const handleGoalAdjustment = async (newGoal) => {
    if (newGoal < 1 || newGoal > 10) return
    
    setLoading(true)
    try {
      const updatedUser = await userService.setDailyGoal(newGoal)
      onUserUpdate(updatedUser)
      toast.success(`Daily goal updated to ${newGoal} sessions`)
    } catch (error) {
      toast.error('Failed to update daily goal')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-surface-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-surface-900 text-lg">
          Daily Goal
        </h3>
        
        {isCompleted && (
          <motion.div
            className="flex items-center space-x-1 text-success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <ApperIcon name="CheckCircle" size={20} />
            <span className="text-sm font-medium">Complete!</span>
          </motion.div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-surface-600">
            {dailyProgress} / {dailyGoal} sessions
          </span>
          <span className="text-sm font-medium text-surface-700">
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="w-full bg-surface-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              isCompleted 
                ? 'bg-gradient-to-r from-success to-green-400' 
                : 'bg-gradient-to-r from-primary to-secondary'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
      
      {/* Goal Adjustment */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-surface-600">
          Sessions per day
        </span>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="small"
            onClick={() => handleGoalAdjustment(dailyGoal - 1)}
            disabled={loading || dailyGoal <= 1}
            className="w-8 h-8 p-0 rounded-full"
          >
            <ApperIcon name="Minus" size={16} />
          </Button>
          
          <span className="font-semibold text-surface-900 min-w-[2rem] text-center">
            {dailyGoal}
          </span>
          
          <Button
            variant="ghost"
            size="small"
            onClick={() => handleGoalAdjustment(dailyGoal + 1)}
            disabled={loading || dailyGoal >= 10}
            className="w-8 h-8 p-0 rounded-full"
          >
            <ApperIcon name="Plus" size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DailyGoalWidget