import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import LessonTimer from '@/components/organisms/LessonTimer'
import ApperIcon from '@/components/ApperIcon'
import { lessonService, userService } from '@/services'

const LessonView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [lessonData, userData] = await Promise.all([
          lessonService.getById(id),
          userService.getUser()
        ])
        
        setLesson(lessonData)
        setUser(userData)
      } catch (err) {
        setError(err.message || 'Failed to load lesson')
        toast.error('Failed to load lesson')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [id])
  
  const handleStartLesson = () => {
    setIsTimerActive(true)
  }
  
  const handleTimerComplete = () => {
    toast.success('Lesson time completed!')
  }
  
  const handleNextSection = () => {
    if (currentSection < lesson.content.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }
  
  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }
  
  const handleCompleteLesson = () => {
    navigate(`/quiz/${lesson.id}`)
  }
  
  const handleExit = () => {
    if (isTimerActive && currentSection > 0) {
      setShowExitModal(true)
    } else {
      navigate(-1)
    }
  }
  
  const confirmExit = () => {
    setShowExitModal(false)
    navigate(-1)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-surface-200 rounded"></div>
                <div className="h-6 bg-surface-200 rounded w-32"></div>
              </div>
              <div className="w-24 h-6 bg-surface-200 rounded"></div>
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="h-8 bg-surface-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-surface-200 rounded"></div>
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
              </div>
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
          <h2 className="text-xl font-bold text-surface-900 mb-2">Failed to load lesson</h2>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }
  
  const isCompleted = user?.completedLessons?.includes(lesson.id)
  const currentContent = lesson.content[currentSection]
  const progress = ((currentSection + 1) / lesson.content.length) * 100
  
  return (
    <>
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between pt-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="small"
                onClick={handleExit}
                className="p-2"
              >
                <ApperIcon name="X" size={20} />
              </Button>
              
              <div>
                <h1 className="font-display font-bold text-xl text-surface-900 break-words">
                  {lesson.title}
                </h1>
                <p className="text-sm text-surface-600">
                  {lesson.duration} min • {lesson.xpReward} XP
                </p>
              </div>
            </div>
            
            {isCompleted && (
              <div className="flex items-center space-x-1 text-success">
                <ApperIcon name="CheckCircle" size={20} />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </motion.div>
          
          {/* Timer */}
          {!isTimerActive ? (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ApperIcon name="Play" size={64} className="text-primary mx-auto mb-4" />
              <h2 className="font-display font-bold text-2xl text-surface-900 mb-2">
                Ready to Learn?
              </h2>
              <p className="text-surface-600 mb-6">
                This lesson will take approximately {lesson.duration} minutes to complete.
              </p>
              <Button
                variant="primary"
                size="large"
                onClick={handleStartLesson}
              >
                Start Lesson
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <LessonTimer
                duration={lesson.duration}
                isActive={isTimerActive}
                onComplete={handleTimerComplete}
              />
            </motion.div>
          )}
          
          {/* Lesson Content */}
          {isTimerActive && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Progress Bar */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-surface-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-surface-700">
                    Section {currentSection + 1} of {lesson.content.length}
                  </span>
                  <span className="text-sm text-surface-600">
                    {Math.round(progress)}%
                  </span>
                </div>
                
                <div className="w-full bg-surface-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
              
              {/* Content Section */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSection}
                  className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentContent.type === 'intro' && (
                    <div>
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                        <ApperIcon name="BookOpen" size={24} className="text-primary" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-surface-900 mb-4">
                        Introduction
                      </h3>
                      <p className="text-surface-700 leading-relaxed break-words">
                        {currentContent.text}
                      </p>
                    </div>
                  )}
                  
                  {currentContent.type === 'concept' && (
                    <div>
                      <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                        <ApperIcon name="Lightbulb" size={24} className="text-secondary" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-surface-900 mb-4">
                        {currentContent.title}
                      </h3>
                      <p className="text-surface-700 leading-relaxed break-words">
                        {currentContent.text}
                      </p>
                    </div>
                  )}
                  
                  {(currentContent.type === 'example' || currentContent.type === 'benefits' || 
                    currentContent.type === 'techniques' || currentContent.type === 'strategy' ||
                    currentContent.type === 'steps' || currentContent.type === 'habits' ||
                    currentContent.type === 'signs') && (
                    <div>
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                        <ApperIcon name="List" size={24} className="text-accent" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-surface-900 mb-4">
                        {currentContent.title}
                      </h3>
                      {currentContent.text && (
                        <p className="text-surface-700 leading-relaxed mb-4 break-words">
                          {currentContent.text}
                        </p>
                      )}
                      {currentContent.items && (
                        <ul className="space-y-3">
                          {currentContent.items.map((item, index) => (
                            <motion.li
                              key={index}
                              className="flex items-start space-x-3"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                <ApperIcon name="Check" size={12} className="text-success" />
                              </div>
                              <span className="text-surface-700 break-words">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                  
                  {(currentContent.type === 'action' || currentContent.type === 'practice') && (
                    <div>
                      <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mb-4">
                        <ApperIcon name="Target" size={24} className="text-success" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-surface-900 mb-4">
                        {currentContent.title}
                      </h3>
                      <p className="text-surface-700 leading-relaxed break-words">
                        {currentContent.text}
                      </p>
                    </div>
                  )}
                  
                  {currentContent.type === 'framework' && (
                    <div>
                      <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center mb-4">
                        <ApperIcon name="Layers" size={24} className="text-info" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-surface-900 mb-4">
                        {currentContent.title}
                      </h3>
                      <div className="space-y-3">
                        {currentContent.items.map((item, index) => (
                          <motion.div
                            key={index}
                            className="p-3 bg-surface-50 rounded-lg border-l-4 border-info"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="text-surface-700 break-words">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentContent.type === 'science' && (
                    <div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <ApperIcon name="Microscope" size={24} className="text-purple-600" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-surface-900 mb-4">
                        {currentContent.title}
                      </h3>
                      <p className="text-surface-700 leading-relaxed break-words">
                        {currentContent.text}
                      </p>
                    </div>
                  )}
                  
                  {currentContent.type === 'purpose' && (
                    <div>
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                        <ApperIcon name="Compass" size={24} className="text-indigo-600" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-surface-900 mb-4">
                        {currentContent.title}
                      </h3>
                      <ul className="space-y-3">
                        {currentContent.items.map((item, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start space-x-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <ApperIcon name="Check" size={12} className="text-indigo-600" />
                            </div>
                            <span className="text-surface-700 break-words">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {currentContent.type === 'guidelines' && (
                    <div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <ApperIcon name="FileText" size={24} className="text-blue-600" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-surface-900 mb-4">
                        {currentContent.title}
                      </h3>
                      <ul className="space-y-3">
                        {currentContent.items.map((item, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start space-x-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <ApperIcon name="Check" size={12} className="text-blue-600" />
                            </div>
                            <span className="text-surface-700 break-words">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Default fallback for any content type */}
                  {!['intro', 'concept', 'example', 'benefits', 'techniques', 'strategy', 'steps', 'habits', 'signs', 'action', 'practice', 'framework', 'science', 'purpose', 'guidelines'].includes(currentContent.type) && (
                    <div>
                      <div className="w-12 h-12 bg-surface-100 rounded-lg flex items-center justify-center mb-4">
                        <ApperIcon name="FileText" size={24} className="text-surface-600" />
                      </div>
                      {currentContent.title && (
                        <h3 className="font-display font-bold text-xl text-surface-900 mb-4">
                          {currentContent.title}
                        </h3>
                      )}
                      {currentContent.text && (
                        <p className="text-surface-700 leading-relaxed break-words">
                          {currentContent.text}
                        </p>
                      )}
                      {currentContent.items && (
                        <ul className="space-y-2 mt-4">
                          {currentContent.items.map((item, index) => (
                            <li key={index} className="text-surface-700 break-words">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handlePrevSection}
                  disabled={currentSection === 0}
                >
                  <ApperIcon name="ChevronLeft" size={16} className="mr-2" />
                  Previous
                </Button>
                
                {currentSection < lesson.content.length - 1 ? (
                  <Button
                    variant="primary"
                    onClick={handleNextSection}
                  >
                    Next
                    <ApperIcon name="ChevronRight" size={16} className="ml-2" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleCompleteLesson}
                  >
                    Take Quiz
                    <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowExitModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
                <div className="text-center">
                  <ApperIcon name="AlertTriangle" size={48} className="text-warning mx-auto mb-4" />
                  <h3 className="font-display font-bold text-lg text-surface-900 mb-2">
                    Exit Lesson?
                  </h3>
                  <p className="text-surface-600 mb-6">
                    Your progress will be lost if you exit now. Are you sure you want to leave?
                  </p>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowExitModal(false)}
                      className="flex-1"
                    >
                      Stay
                    </Button>
                    <Button
                      variant="primary"
                      onClick={confirmExit}
                      className="flex-1"
                    >
                      Exit
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default LessonView