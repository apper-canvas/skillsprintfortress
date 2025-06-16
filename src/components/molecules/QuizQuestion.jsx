import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const QuizQuestion = ({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  showResult = false,
  isCorrect = false,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-surface-200 ${className}`}>
      <h3 className="font-display font-semibold text-surface-900 text-lg mb-6 break-words">
        {question.question}
      </h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrectAnswer = index === question.correctAnswer
          
          let buttonStyle = 'border-surface-200 hover:border-primary hover:bg-primary/5'
          let textStyle = 'text-surface-700'
          let iconName = null
          
          if (showResult) {
            if (isCorrectAnswer) {
              buttonStyle = 'border-success bg-success/10'
              textStyle = 'text-success'
              iconName = 'CheckCircle'
            } else if (isSelected && !isCorrectAnswer) {
              buttonStyle = 'border-error bg-error/10'
              textStyle = 'text-error'
              iconName = 'XCircle'
            } else {
              buttonStyle = 'border-surface-200 opacity-60'
              textStyle = 'text-surface-500'
            }
          } else if (isSelected) {
            buttonStyle = 'border-primary bg-primary/10'
            textStyle = 'text-primary'
          }
          
          return (
            <motion.button
              key={index}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 flex items-center justify-between ${buttonStyle}`}
              onClick={() => !showResult && onAnswerSelect(index)}
              disabled={showResult}
              whileHover={!showResult ? { scale: 1.01 } : {}}
              whileTap={!showResult ? { scale: 0.99 } : {}}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className={`font-medium break-words ${textStyle}`}>
                {option}
              </span>
              
              {showResult && iconName && (
                <ApperIcon 
                  name={iconName} 
                  size={20} 
                  className={isCorrectAnswer ? 'text-success' : 'text-error'}
                />
              )}
            </motion.button>
          )
        })}
      </div>
      
      {showResult && question.explanation && (
        <motion.div
          className="mt-4 p-4 bg-info/10 border border-info/20 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-start space-x-2">
            <ApperIcon name="Info" size={16} className="text-info mt-0.5 flex-shrink-0" />
            <p className="text-sm text-surface-700 break-words">
              {question.explanation}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default QuizQuestion