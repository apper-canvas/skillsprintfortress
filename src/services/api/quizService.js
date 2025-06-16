import { toast } from 'react-toastify'

const quizService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'passing_score', 'questions', 'lesson_id']
      }
      
      const response = await apperClient.fetchRecords('quiz', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data.map(quiz => ({
        id: quiz.Id,
        lessonId: quiz.lesson_id,
        passingScore: quiz.passing_score,
        questions: typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : quiz.questions
      }))
    } catch (error) {
      console.error("Error fetching quizzes:", error)
      toast.error("Failed to load quizzes")
      return []
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'passing_score', 'questions', 'lesson_id']
      }
      
      const response = await apperClient.getRecordById('quiz', id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Quiz not found')
      }
      
      const quiz = response.data
      return {
        id: quiz.Id,
        lessonId: quiz.lesson_id,
        passingScore: quiz.passing_score,
        questions: typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : quiz.questions
      }
    } catch (error) {
      console.error(`Error fetching quiz with ID ${id}:`, error)
      throw error
    }
  },

  async getByLessonId(lessonId) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'passing_score', 'questions', 'lesson_id'],
        where: [
          {
            FieldName: "lesson_id",
            Operator: "EqualTo",
            Values: [parseInt(lessonId)]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('quiz', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Quiz not found for this lesson')
      }
      
      if (response.data.length === 0) {
        throw new Error('Quiz not found for this lesson')
      }
      
      const quiz = response.data[0]
      return {
        id: quiz.Id,
        lessonId: quiz.lesson_id,
        passingScore: quiz.passing_score,
        questions: typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : quiz.questions
      }
    } catch (error) {
      console.error(`Error fetching quiz for lesson ${lessonId}:`, error)
      throw error
    }
  },

  async submitQuiz(lessonId, answers) {
    try {
      // Get the quiz for this lesson
      const quiz = await this.getByLessonId(lessonId)
      
      let correctAnswers = 0
      const results = quiz.questions.map((question, index) => {
        const isCorrect = answers[index] === question.correctAnswer
        if (isCorrect) correctAnswers++
        
        return {
          questionId: question.id,
          userAnswer: answers[index],
          correctAnswer: question.correctAnswer,
          isCorrect,
          explanation: question.explanation
        }
      })

      const score = Math.round((correctAnswers / quiz.questions.length) * 100)
      const passed = score >= quiz.passingScore

      return {
        score,
        passed,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        results
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
      throw error
    }
  },

  async create(quiz) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [
          {
            Name: `Quiz for Lesson ${quiz.lessonId}`,
            lesson_id: parseInt(quiz.lessonId),
            passing_score: quiz.passingScore,
            questions: typeof quiz.questions === 'object' ? JSON.stringify(quiz.questions) : quiz.questions
          }
        ]
      }
      
      const response = await apperClient.createRecord('quiz', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Failed to create quiz')
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          const created = successfulRecords[0].data
          toast.success('Quiz created successfully')
          return {
            id: created.Id,
            lessonId: created.lesson_id,
            passingScore: created.passing_score,
            questions: typeof created.questions === 'string' ? JSON.parse(created.questions) : created.questions
          }
        }
      }
      throw new Error('Failed to create quiz')
    } catch (error) {
      console.error("Error creating quiz:", error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const updateData = {
        Id: id
      }
      
      if (updates.lessonId !== undefined) updateData.lesson_id = parseInt(updates.lessonId)
      if (updates.passingScore !== undefined) updateData.passing_score = updates.passingScore
      if (updates.questions !== undefined) {
        updateData.questions = typeof updates.questions === 'object' ? JSON.stringify(updates.questions) : updates.questions
      }
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('quiz', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Failed to update quiz')
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          const updated = successfulUpdates[0].data
          toast.success('Quiz updated successfully')
          return {
            id: updated.Id,
            lessonId: updated.lesson_id,
            passingScore: updated.passing_score,
            questions: typeof updated.questions === 'string' ? JSON.parse(updated.questions) : updated.questions
          }
        }
      }
      throw new Error('Failed to update quiz')
    } catch (error) {
      console.error("Error updating quiz:", error)
      throw error
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [id]
      }
      
      const response = await apperClient.deleteRecord('quiz', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Quiz deleted successfully')
          return true
        }
      }
      return false
    } catch (error) {
      console.error("Error deleting quiz:", error)
      throw error
    }
  }
}

export default quizService