import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import LessonCard from '@/components/molecules/LessonCard'
import ProgressRing from '@/components/atoms/ProgressRing'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { lessonService, userService } from '@/services'

const TopicDetail = () => {
  const { category } = useParams()
  const navigate = useNavigate()
  const [lessons, setLessons] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [lessonsData, userData] = await Promise.all([
          lessonService.getByCategory(category),
          userService.getUser()
        ])
        
        setLessons(lessonsData)
        setUser(userData)
      } catch (err) {
        setError(err.message || 'Failed to load topic data')
        toast.error('Failed to load topic data')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [category])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-surface-200 rounded"></div>
              <div className="h-8 bg-surface-200 rounded w-1/2"></div>
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="h-24 bg-surface-200 rounded"></div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4">
                  <div className="h-16 bg-surface-200 rounded"></div>
                </div>
              ))}
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
          <h2 className="text-xl font-bold text-surface-900 mb-2">Failed to load topic</h2>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }
  
  const categoryInfo = {
    productivity: {
      title: 'Productivity',
      icon: 'Briefcase',
      color: '#5B5FDE',
      description: 'Master time and task management skills to boost your efficiency and achieve more in less time.'
    },
    communication: {
      title: 'Communication',
      icon: 'MessageSquare',
      color: '#8B5CF6',
      description: 'Build stronger relationships through effective listening, speaking, and interpersonal skills.'
    },
    nutrition: {
      title: 'Nutrition',
      icon: 'Apple',
      color: '#10B981',
      description: 'Develop healthy eating habits and understand the fundamentals of balanced nutrition.'
    },
    investing: {
      title: 'Investing',
      icon: 'TrendingUp',
      color: '#F59E0B',
      description: 'Grow your financial knowledge and learn the basics of smart investing strategies.'
    }
  }
  
  const info = categoryInfo[category] || categoryInfo.productivity
  const completedLessons = lessons.filter(lesson => 
    user?.completedLessons?.includes(lesson.id)
  )
  const progress = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0
  const totalXP = lessons.reduce((sum, lesson) => sum + lesson.xpReward, 0)
  const earnedXP = completedLessons.reduce((sum, lesson) => sum + lesson.xpReward, 0)
  
  const nextLesson = lessons.find(lesson => 
    !user?.completedLessons?.includes(lesson.id)
  )
  
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <motion.div
          className="pt-6 pb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigate('/home')}
              className="p-2"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </Button>
            
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
              <h1 className="font-display font-bold text-2xl text-surface-900">
                {info.title}
              </h1>
              <p className="text-surface-600 text-sm">
                {lessons.length} lessons • {totalXP} total XP
              </p>
            </div>
          </div>
          
          <p className="text-surface-600 break-words">
            {info.description}
          </p>
        </motion.div>
        
        {/* Progress Overview */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-surface-900">
              Your Progress
            </h3>
            
            <ProgressRing
              progress={progress}
              size={60}
              color={info.color}
              showPercentage={true}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-surface-900 mb-1">
                {completedLessons.length}
              </div>
              <div className="text-sm text-surface-600">Completed</div>
            </div>
            
            <div>
              <div className="text-xl font-bold text-surface-900 mb-1">
                {lessons.length - completedLessons.length}
              </div>
              <div className="text-sm text-surface-600">Remaining</div>
            </div>
            
            <div>
              <div className="text-xl font-bold text-surface-900 mb-1">
                {earnedXP}
              </div>
              <div className="text-sm text-surface-600">XP Earned</div>
            </div>
          </div>
          
          {nextLesson && (
            <motion.div
              className="mt-4 pt-4 border-t border-surface-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="primary"
                onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                className="w-full"
              >
                <ApperIcon name="Play" size={16} className="mr-2" />
                Continue with "{nextLesson.title}"
              </Button>
            </motion.div>
          )}
          
          {progress === 100 && (
            <motion.div
              className="mt-4 pt-4 border-t border-surface-200 text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="flex items-center justify-center space-x-2 text-success mb-2">
                <ApperIcon name="Trophy" size={24} />
                <span className="font-bold text-lg">Category Complete!</span>
              </div>
              <p className="text-sm text-surface-600">
                You've mastered all {info.title.toLowerCase()} lessons. Great job!
              </p>
            </motion.div>
          )}
        </motion.div>
        
        {/* Lessons List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-display font-semibold text-lg text-surface-900 mb-4">
            All Lessons
          </h3>
          
          {lessons.length > 0 ? (
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <LessonCard
                    lesson={lesson}
                    isCompleted={user?.completedLessons?.includes(lesson.id)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ApperIcon name="BookOpen" size={48} className="text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 mb-2">
                No lessons available
              </h3>
              <p className="text-surface-600 mb-4">
                Check back soon for new {info.title.toLowerCase()} content!
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/home')}
              >
                Browse Other Topics
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default TopicDetail