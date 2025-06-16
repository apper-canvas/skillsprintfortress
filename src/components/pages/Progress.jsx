import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import BadgeShowcase from '@/components/organisms/BadgeShowcase'
import XPBar from '@/components/atoms/XPBar'
import ProgressRing from '@/components/atoms/ProgressRing'
import ApperIcon from '@/components/ApperIcon'
import { userService, lessonService } from '@/services'

const Progress = () => {
  const [user, setUser] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [userData, lessonsData] = await Promise.all([
          userService.getUser(),
          lessonService.getAll()
        ])
        
        setUser(userData)
        setLessons(lessonsData)
      } catch (err) {
        setError(err.message || 'Failed to load progress data')
        toast.error('Failed to load progress data')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
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
              <div className="h-48 bg-surface-200 rounded"></div>
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
          <h2 className="text-xl font-bold text-surface-900 mb-2">Failed to load progress</h2>
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
  
  // Calculate category progress
  const getCategoryProgress = (category) => {
    const categoryLessons = lessons.filter(lesson => lesson.category === category)
    const completedCount = categoryLessons.filter(lesson => 
      user?.completedLessons?.includes(lesson.id)
    ).length
    
    return {
      total: categoryLessons.length,
      completed: completedCount,
      progress: categoryLessons.length > 0 ? (completedCount / categoryLessons.length) * 100 : 0
    }
  }
  
  const categories = [
    { key: 'productivity', name: 'Productivity', icon: 'Briefcase', color: '#5B5FDE' },
    { key: 'communication', name: 'Communication', icon: 'MessageSquare', color: '#8B5CF6' },
    { key: 'nutrition', name: 'Nutrition', icon: 'Apple', color: '#10B981' },
    { key: 'investing', name: 'Investing', icon: 'TrendingUp', color: '#F59E0B' }
  ]
  
  const totalLessons = lessons.length
  const completedLessons = user?.completedLessons?.length || 0
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  
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
            Your Progress
          </h1>
          <p className="text-surface-600">
            Track your learning journey and achievements
          </p>
        </motion.div>
        
        {/* Overall Stats */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {user?.currentLevel || 1}
              </div>
              <div className="text-sm text-surface-600">Current Level</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary mb-1">
                {user?.totalXP || 0}
              </div>
              <div className="text-sm text-surface-600">Total XP</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">
                {user?.currentStreak || 0}
              </div>
              <div className="text-sm text-surface-600">Day Streak</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-1">
                {completedLessons}
              </div>
              <div className="text-sm text-surface-600">Lessons Done</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-surface-900">Overall Progress</span>
              <span className="text-sm text-surface-600">
                {completedLessons} / {totalLessons} lessons
              </span>
            </div>
            <XPBar 
              currentXP={overallProgress}
              nextLevelXP={100}
              showNumbers={false}
            />
          </div>
        </motion.div>
        
        {/* Category Progress */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-display font-semibold text-lg text-surface-900 mb-4">
            Progress by Category
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category, index) => {
              const stats = getCategoryProgress(category.key)
              
              return (
                <motion.div
                  key={category.key}
                  className="text-center p-4 rounded-lg border border-surface-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex justify-center mb-3">
                    <ProgressRing
                      progress={stats.progress}
                      size={60}
                      color={category.color}
                      showPercentage={true}
                    />
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <ApperIcon 
                      name={category.icon} 
                      size={16}
                      style={{ color: category.color }}
                    />
                    <span className="font-medium text-surface-900 text-sm">
                      {category.name}
                    </span>
                  </div>
                  
                  <div className="text-xs text-surface-600">
                    {stats.completed} / {stats.total} complete
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
        
        {/* Badge Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BadgeShowcase user={user} />
        </motion.div>
        
        {/* Empty State for no progress */}
        {completedLessons === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <ApperIcon name="BarChart3" size={48} className="text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">
              Start your learning journey
            </h3>
            <p className="text-surface-600 mb-4">
              Complete your first lesson to see your progress here
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
            >
              Browse Topics
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Progress