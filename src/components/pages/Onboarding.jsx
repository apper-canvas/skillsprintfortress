import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { userService } from '@/services'

const Onboarding = () => {
  const navigate = useNavigate()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [loading, setLoading] = useState(false)
  
  const categories = [
    {
      id: 'productivity',
      title: 'Productivity',
      icon: 'Briefcase',
      color: '#5B5FDE',
      description: 'Master time and task management skills to boost your efficiency'
    },
    {
      id: 'communication',
      title: 'Communication',
      icon: 'MessageSquare',
      color: '#8B5CF6',
      description: 'Build stronger relationships and express yourself clearly'
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      icon: 'Apple',
      color: '#10B981',
      description: 'Develop healthy eating habits and understand nutrition'
    },
    {
      id: 'investing',
      title: 'Investing',
      icon: 'TrendingUp',
      color: '#F59E0B',
      description: 'Grow your financial knowledge and investment skills'
    }
  ]
  
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }
  
  const handleContinue = async () => {
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category to continue')
      return
    }
    
    setLoading(true)
    try {
      await userService.createCleanUser(selectedCategories)
      toast.success('Welcome to SkillSprint! Let\'s start learning!')
      navigate('/home')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      toast.error('Failed to complete setup. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-surface-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display font-bold text-3xl text-surface-900 mb-2">
            Welcome to SkillSprint!
          </h1>
          <p className="text-surface-600 text-lg">
            What would you like to learn? Select the topics that interest you most.
          </p>
        </motion.div>
        
        {/* Progress indicator */}
        <motion.div
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <ApperIcon name="Check" size={16} className="text-white" />
            </div>
            <div className="w-12 h-1 bg-primary rounded"></div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">2</span>
            </div>
            <div className="w-12 h-1 bg-surface-200 rounded"></div>
            <div className="w-8 h-8 bg-surface-200 rounded-full flex items-center justify-center">
              <span className="text-surface-400 text-sm font-medium">3</span>
            </div>
          </div>
        </motion.div>
        
        {/* Category Selection */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {categories.map((category, index) => {
            const isSelected = selectedCategories.includes(category.id)
            
            return (
              <motion.div
                key={category.id}
                className={`bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-surface-200 hover:border-surface-300'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleCategoryToggle(category.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <ApperIcon 
                        name={category.icon} 
                        size={24} 
                        style={{ color: category.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-surface-900 text-lg">
                        {category.title}
                      </h3>
                      <p className="text-surface-600">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected 
                      ? 'bg-primary border-primary' 
                      : 'border-surface-300'
                  }`}>
                    {isSelected && (
                      <ApperIcon name="Check" size={14} className="text-white" />
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
        
        {/* Selection Summary */}
        {selectedCategories.length > 0 && (
          <motion.div
            className="bg-primary/10 rounded-xl p-4 mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-surface-700 text-center">
              <span className="font-medium">{selectedCategories.length}</span> topic
              {selectedCategories.length !== 1 ? 's' : ''} selected
            </p>
          </motion.div>
        )}
        
        {/* Action Buttons */}
        <motion.div
          className="flex flex-col space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            onClick={handleContinue}
            disabled={selectedCategories.length === 0 || loading}
            loading={loading}
            className="w-full py-3"
          >
            {loading ? 'Setting up your account...' : 'Continue to SkillSprint'}
          </Button>
          
          <button
            onClick={() => navigate('/login')}
            className="text-surface-600 hover:text-surface-800 text-sm transition-colors"
            disabled={loading}
          >
            Back to login
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Onboarding