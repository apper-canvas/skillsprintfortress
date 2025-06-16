import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import TopicCard from '@/components/molecules/TopicCard'
import StreakDisplay from '@/components/molecules/StreakDisplay'
import DailyGoalWidget from '@/components/organisms/DailyGoalWidget'
import XPBar from '@/components/atoms/XPBar'
import ApperIcon from '@/components/ApperIcon'
import { userService, lessonService } from '@/services'

const Home = () => {
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
        setError(err.message || 'Failed to load data')
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-surface-200 rounded w-1/2"></div>
            <div className="h-4 bg-surface-200 rounded w-3/4"></div>
          </div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-16 bg-surface-200 rounded"></div>
              </div>
            ))}
          </div>
          
          {/* Topics skeleton */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-20 bg-surface-200 rounded"></div>
              </div>
            ))}
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
          <h2 className="text-xl font-bold text-surface-900 mb-2">Something went wrong</h2>
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
  
  // Calculate topic progress
  const getTopicStats = (category) => {
    const categoryLessons = lessons.filter(lesson => lesson.category === category)
    const completedCount = categoryLessons.filter(lesson => 
      user?.completedLessons?.includes(lesson.id)
    ).length
    
    return {
      lessonCount: categoryLessons.length,
      completedCount
    }
  }
  
  const topics = ['productivity', 'communication', 'nutrition', 'investing']
  
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <motion.div
          className="text-center pt-6 pb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display font-bold text-3xl text-surface-900 mb-2">
            Welcome to SkillSprint
          </h1>
          <p className="text-surface-600">
            Learn practical skills in just 5 minutes a day
          </p>
        </motion.div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StreakDisplay streak={user?.currentStreak || 0} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-xl p-4 shadow-sm border border-surface-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg text-surface-900">
                    Level {user?.currentLevel || 1}
                  </p>
                  <p className="text-sm text-surface-600">
                    {user?.totalXP || 0} XP total
                  </p>
                </div>
              </div>
              <XPBar 
                currentXP={user?.totalXP || 0}
                showNumbers={false}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Daily Goal Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DailyGoalWidget 
            user={user}
            onUserUpdate={handleUserUpdate}
          />
        </motion.div>
        
        {/* Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-display font-semibold text-xl text-surface-900 mb-4">
            Choose Your Learning Path
          </h2>
          
          <div className="space-y-4">
            {topics.map((topic, index) => {
              const stats = getTopicStats(topic)
              return (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <TopicCard
                    category={topic}
                    lessonCount={stats.lessonCount}
                    completedCount={stats.completedCount}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.div>
        
        {topics.every(topic => getTopicStats(topic).lessonCount === 0) && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <ApperIcon name="BookOpen" size={48} className="text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">
              No lessons available yet
            </h3>
            <p className="text-surface-600">
              Check back soon for new learning content!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Home