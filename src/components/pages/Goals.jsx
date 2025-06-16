import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { userService } from '@/services'

const Goals = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const userData = await userService.getUser()
        setUser(userData)
      } catch (err) {
        setError(err.message || 'Failed to load user data')
        toast.error('Failed to load user data')
      } finally {
        setLoading(false)
      }
    }
    
    loadUser()
  }, [])
  
  const handleGoalUpdate = async (newGoal) => {
    if (newGoal < 1 || newGoal > 10) return
    
    setUpdating(true)
    try {
      const updatedUser = await userService.setDailyGoal(newGoal)
      setUser(updatedUser)
      toast.success(`Daily goal updated to ${newGoal} sessions`)
    } catch (error) {
      toast.error('Failed to update daily goal')
    } finally {
      setUpdating(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-200 rounded w-1/3"></div>
            <div className="bg-white rounded-xl p-6">
              <div className="h-32 bg-surface-200 rounded"></div>
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="h-24 bg-surface-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h2 className="text-xl font-bold text-surface-900 mb-2">Failed to load goals</h2>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
  
  const dailyGoal = user?.dailyGoal || 2
  const currentStreak = user?.currentStreak || 0
  const dailyProgress = user?.dailyProgress || 0
  
  // Generate goal options
  const goalOptions = [1, 2, 3, 5]
  
  // Mock streak calendar data (last 30 days)
  const generateStreakCalendar = () => {
    const calendar = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Simulate completed days based on current streak
      const isCompleted = i < currentStreak
      
      calendar.push({
        date: date.getDate(),
        month: date.getMonth(),
        isCompleted,
        isToday: i === 0
      })
    }
    
    return calendar
  }
  
  const streakCalendar = generateStreakCalendar()
  const progressPercentage = Math.min((dailyProgress / dailyGoal) * 100, 100)
  
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <motion.div
          className="text-center pt-6 pb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display font-bold text-2xl text-surface-900 mb-2">
            Learning Goals
          </h1>
          <p className="text-surface-600">
            Set your daily targets and track your consistency
          </p>
        </motion.div>
        
        {/* Current Progress */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-surface-900">
              Today's Progress
            </h3>
            
            {dailyProgress >= dailyGoal && (
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
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-surface-600">
                {dailyProgress} / {dailyGoal} sessions completed
              </span>
              <span className="text-sm font-medium text-surface-700">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            
            <div className="w-full bg-surface-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  dailyProgress >= dailyGoal 
                    ? 'bg-gradient-to-r from-success to-green-400' 
                    : 'bg-gradient-to-r from-primary to-secondary'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary mb-1">
                {currentStreak}
              </div>
              <div className="text-sm text-surface-600">Current Streak</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-secondary mb-1">
                {dailyGoal}
              </div>
              <div className="text-sm text-surface-600">Daily Goal</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-accent mb-1">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-sm text-surface-600">Today's Progress</div>
            </div>
          </div>
        </motion.div>
        
        {/* Goal Setting */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-display font-semibold text-lg text-surface-900 mb-4">
            Daily Session Goal
          </h3>
          
          <p className="text-surface-600 mb-6">
            Choose how many 5-minute sessions you want to complete each day
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {goalOptions.map((goal) => (
              <motion.button
                key={goal}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  dailyGoal === goal
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-surface-200 hover:border-primary/50 text-surface-700'
                }`}
                onClick={() => handleGoalUpdate(goal)}
                disabled={updating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl font-bold mb-1">{goal}</div>
                <div className="text-sm">
                  session{goal !== 1 ? 's' : ''}
                </div>
                <div className="text-xs text-surface-500 mt-1">
                  {goal * 5} min/day
                </div>
              </motion.button>
            ))}
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-surface-600">
            <ApperIcon name="Info" size={16} />
            <span>Start small and build consistency over time</span>
          </div>
        </motion.div>
        
        {/* Streak Calendar */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-surface-900">
              30-Day Activity
            </h3>
            
            <div className="flex items-center space-x-2">
              <ApperIcon name="Flame" size={20} className="text-accent" />
              <span className="font-medium text-surface-900">
                {currentStreak} day streak
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-10 gap-1 mb-4">
            {streakCalendar.map((day, index) => (
              <motion.div
                key={index}
                className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs font-medium ${
                  day.isToday
                    ? 'border-2 border-primary bg-primary/20 text-primary'
                    : day.isCompleted
                    ? 'bg-success text-white'
                    : 'bg-surface-200 text-surface-500'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                {day.date}
              </motion.div>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-success rounded-sm"></div>
                <span className="text-surface-600">Completed</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-surface-200 rounded-sm"></div>
                <span className="text-surface-600">Missed</span>
              </div>
            </div>
            
            <div className="text-surface-500">
              Last 30 days
            </div>
          </div>
        </motion.div>
        
        {/* Motivational Section */}
        <motion.div
          className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center">
            <ApperIcon name="Target" size={48} className="text-primary mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-surface-900 mb-2">
              {currentStreak >= 7 
                ? "Amazing consistency!" 
                : currentStreak >= 3 
                ? "You're building momentum!" 
                : "Every expert was once a beginner"}
            </h3>
            <p className="text-surface-600 mb-4">
              {currentStreak >= 7 
                ? "Keep up this fantastic streak and watch your skills compound!"
                : currentStreak >= 3 
                ? "You're developing a great learning habit. Keep it up!"
                : "Start today and build your learning streak one session at a time."}
            </p>
            
            {dailyProgress < dailyGoal && (
              <Button
                variant="primary"
                onClick={() => window.history.back()}
              >
                <ApperIcon name="BookOpen" size={16} className="mr-2" />
                Continue Learning
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Goals