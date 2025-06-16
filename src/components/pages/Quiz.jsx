import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import QuizQuestion from '@/components/molecules/QuizQuestion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { quizService, userService, badgeService } from '@/services'

const Quiz = () => {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [quizResults, setQuizResults] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [newBadges, setNewBadges] = useState([])
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [quizData, userData] = await Promise.all([
          quizService.getByLessonId(lessonId),
          userService.getUser()
        ])
        
        setQuiz(quizData)
        setUser(userData)
        setAnswers(new Array(quizData.questions.length).fill(null))
      } catch (err) {
        setError(err.message || 'Failed to load quiz')
        toast.error('Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [lessonId])
  
  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }
  
  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }
  
  const handleSubmitQuiz = async () => {
    // Check if all questions are answered
    if (answers.some(answer => answer === null)) {
      toast.error('Please answer all questions before submitting')
      return
    }
    
    setSubmitting(true)
    try {
      // Submit quiz
      const results = await quizService.submitQuiz(lessonId, answers)
      setQuizResults(results)
      
      if (results.passed) {
        // Mark lesson as completed and add XP
        const [updatedUser] = await Promise.all([
          userService.completeLesson(lessonId),
          userService.addXP(quiz.questions.length * 50) // 50 XP per question
        ])
        
        // Check for new badges
        const eligibleBadges = await badgeService.checkEligibility(user.id, {
          ...updatedUser,
          completedLessons: [...(updatedUser.completedLessons || []), lessonId]
        })
        
        // Award new badges
        for (const badge of eligibleBadges) {
          await userService.earnBadge(badge.id)
        }
        
        setNewBadges(eligibleBadges)
        setUser(updatedUser)
        
        toast.success(`Quiz passed! +${quiz.questions.length * 50} XP earned`)
      } else {
        toast.error('Quiz not passed. Review the explanations and try again!')
      }
      
      setShowResults(true)
    } catch (error) {
      toast.error('Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }
  
  const handleRetakeQuiz = () => {
    setCurrentQuestion(0)
    setAnswers(new Array(quiz.questions.length).fill(null))
    setShowResults(false)
    setQuizResults(null)
  }
  
  const handleContinue = () => {
    if (quizResults?.passed) {
      navigate('/home')
    } else {
      handleRetakeQuiz()
    }
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
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="h-8 bg-surface-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-surface-200 rounded"></div>
                ))}
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
          <h2 className="text-xl font-bold text-surface-900 mb-2">Failed to load quiz</h2>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }
  
  if (showResults && quizResults) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {/* Header */}
          <motion.div
            className="text-center pt-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <ApperIcon 
                name={quizResults.passed ? "Trophy" : "XCircle"} 
                size={64} 
                className={`mx-auto mb-4 ${
                  quizResults.passed ? 'text-success' : 'text-warning'
                }`} 
              />
            </motion.div>
            
            <h1 className="font-display font-bold text-2xl text-surface-900 mb-2">
              {quizResults.passed ? 'Quiz Completed!' : 'Keep Learning!'}
            </h1>
            
            <p className="text-surface-600 mb-6">
              You scored {quizResults.score}% ({quizResults.correctAnswers}/{quizResults.totalQuestions} correct)
            </p>
            
            {quizResults.passed && newBadges.length > 0 && (
              <motion.div
                className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ApperIcon name="Award" size={20} className="text-accent" />
                  <span className="font-bold text-surface-900">New Badge{newBadges.length > 1 ? 's' : ''} Earned!</span>
                </div>
                <div className="flex justify-center space-x-2">
                  {newBadges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      className="text-center"
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.7 + index * 0.2, type: "spring" }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mb-1">
                        <ApperIcon name={badge.icon} size={20} className="text-white" />
                      </div>
                      <span className="text-xs text-surface-600">{badge.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Results Summary */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-display font-semibold text-lg text-surface-900 mb-4">
              Quiz Results
            </h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div>
                <div className={`text-2xl font-bold mb-1 ${
                  quizResults.passed ? 'text-success' : 'text-warning'
                }`}>
                  {quizResults.score}%
                </div>
                <div className="text-sm text-surface-600">Final Score</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-success mb-1">
                  {quizResults.correctAnswers}
                </div>
                <div className="text-sm text-surface-600">Correct</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-error mb-1">
                  {quizResults.totalQuestions - quizResults.correctAnswers}
                </div>
                <div className="text-sm text-surface-600">Incorrect</div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border-l-4 ${
              quizResults.passed 
                ? 'bg-success/10 border-success text-success' 
                : 'bg-warning/10 border-warning text-warning'
            }`}>
              <div className="flex items-center space-x-2">
                <ApperIcon 
                  name={quizResults.passed ? "CheckCircle" : "AlertCircle"} 
                  size={20} 
                />
                <span className="font-medium">
                  {quizResults.passed 
                    ? `Passed! (${quiz.passingScore}% required)` 
                    : `Not passed (${quiz.passingScore}% required)`
                  }
                </span>
              </div>
            </div>
          </motion.div>
          
          {/* Question Review */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-display font-semibold text-lg text-surface-900">
              Question Review
            </h3>
            
            {quiz.questions.map((question, index) => {
              const result = quizResults.results[index]
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <QuizQuestion
                    question={question}
                    selectedAnswer={result.userAnswer}
                    showResult={true}
                    isCorrect={result.isCorrect}
                  />
                </motion.div>
              )
            })}
          </motion.div>
          
          {/* Actions */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {!quizResults.passed && (
              <Button
                variant="outline"
                onClick={handleRetakeQuiz}
                className="flex-1"
              >
                <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                Retake Quiz
              </Button>
            )}
            
            <Button
              variant="primary"
              onClick={handleContinue}
              className="flex-1"
            >
              {quizResults.passed ? (
                <>
                  <ApperIcon name="Home" size={16} className="mr-2" />
                  Continue Learning
                </>
              ) : (
                <>
                  <ApperIcon name="ArrowRight" size={16} className="mr-2" />
                  Try Again
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }
  
const currentQuestionData = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const allQuestionsAnswered = answers.every(answer => answer !== null)
  const isScenarioQuiz = quiz.questions.some(q => q.type === 'scenario')
  
  return (
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
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </Button>
            
            <div>
              <h1 className="font-display font-bold text-xl text-surface-900">
                {isScenarioQuiz ? 'Challenge Scenarios' : 'Knowledge Check'}
              </h1>
              <p className="text-sm text-surface-600">
                {currentQuestionData.type === 'scenario' ? 'Scenario' : 'Question'} {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
          </div>
          
          <div className="text-sm text-surface-600">
            {quiz.passingScore}% to pass
          </div>
        </motion.div>
        
        {/* Progress Bar */}
        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-surface-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-surface-700">
              Progress
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
        </motion.div>
        
        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuizQuestion
              question={currentQuestionData}
              selectedAnswer={answers[currentQuestion]}
              onAnswerSelect={handleAnswerSelect}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            <ApperIcon name="ChevronLeft" size={16} className="mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-2">
            {quiz.questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentQuestion
                    ? 'bg-primary scale-125'
                    : answers[index] !== null
                    ? 'bg-success'
                    : 'bg-surface-300'
                }`}
              />
            ))}
          </div>
          
          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              variant="primary"
              onClick={handleNextQuestion}
              disabled={answers[currentQuestion] === null}
            >
              Next
              <ApperIcon name="ChevronRight" size={16} className="ml-2" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmitQuiz}
              disabled={!allQuestionsAnswered}
              loading={submitting}
            >
              Submit Quiz
              <ApperIcon name="Send" size={16} className="ml-2" />
            </Button>
          )}
        </motion.div>
        
        {/* Answer Indicator */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-surface-600">
            {answers.filter(answer => answer !== null).length} of {quiz.questions.length} questions answered
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Quiz