import { toast } from 'react-toastify'

const lessonService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'category', 'title', 'duration', 'content', 'xp_reward', 'difficulty']
      }
      
      const response = await apperClient.fetchRecords('lesson', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      // Transform database fields to match UI expectations
      return response.data.map(lesson => ({
        id: lesson.Id,
        category: lesson.category,
        title: lesson.title,
        duration: lesson.duration,
        content: typeof lesson.content === 'string' ? JSON.parse(lesson.content) : lesson.content,
        xpReward: lesson.xp_reward,
        difficulty: lesson.difficulty
      }))
    } catch (error) {
      console.error("Error fetching lessons:", error)
      toast.error("Failed to load lessons")
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
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'category', 'title', 'duration', 'content', 'xp_reward', 'difficulty']
      }
      
      const response = await apperClient.getRecordById('lesson', id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Lesson not found')
      }
      
      const lesson = response.data
      return {
        id: lesson.Id,
        category: lesson.category,
        title: lesson.title,
        duration: lesson.duration,
        content: typeof lesson.content === 'string' ? JSON.parse(lesson.content) : lesson.content,
        xpReward: lesson.xp_reward,
        difficulty: lesson.difficulty
      }
    } catch (error) {
      console.error(`Error fetching lesson with ID ${id}:`, error)
      throw error
    }
  },

  async getByCategory(category) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'category', 'title', 'duration', 'content', 'xp_reward', 'difficulty'],
        where: [
          {
            FieldName: "category",
            Operator: "ExactMatch",
            Values: [category]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('lesson', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data.map(lesson => ({
        id: lesson.Id,
        category: lesson.category,
        title: lesson.title,
        duration: lesson.duration,
        content: typeof lesson.content === 'string' ? JSON.parse(lesson.content) : lesson.content,
        xpReward: lesson.xp_reward,
        difficulty: lesson.difficulty
      }))
    } catch (error) {
      console.error("Error fetching lessons by category:", error)
      toast.error("Failed to load lessons")
      return []
    }
  },

  async create(lesson) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [
          {
            Name: lesson.title,
            category: lesson.category,
            title: lesson.title,
            duration: lesson.duration,
            content: typeof lesson.content === 'object' ? JSON.stringify(lesson.content) : lesson.content,
            xp_reward: lesson.xpReward,
            difficulty: lesson.difficulty
          }
        ]
      }
      
      const response = await apperClient.createRecord('lesson', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Failed to create lesson')
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
          toast.success('Lesson created successfully')
          return {
            id: created.Id,
            category: created.category,
            title: created.title,
            duration: created.duration,
            content: typeof created.content === 'string' ? JSON.parse(created.content) : created.content,
            xpReward: created.xp_reward,
            difficulty: created.difficulty
          }
        }
      }
      throw new Error('Failed to create lesson')
    } catch (error) {
      console.error("Error creating lesson:", error)
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
      
      if (updates.title !== undefined) {
        updateData.Name = updates.title
        updateData.title = updates.title
      }
      if (updates.category !== undefined) updateData.category = updates.category
      if (updates.duration !== undefined) updateData.duration = updates.duration
      if (updates.content !== undefined) {
        updateData.content = typeof updates.content === 'object' ? JSON.stringify(updates.content) : updates.content
      }
      if (updates.xpReward !== undefined) updateData.xp_reward = updates.xpReward
      if (updates.difficulty !== undefined) updateData.difficulty = updates.difficulty
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('lesson', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Failed to update lesson')
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
          toast.success('Lesson updated successfully')
          return {
            id: updated.Id,
            category: updated.category,
            title: updated.title,
            duration: updated.duration,
            content: typeof updated.content === 'string' ? JSON.parse(updated.content) : updated.content,
            xpReward: updated.xp_reward,
            difficulty: updated.difficulty
          }
        }
      }
      throw new Error('Failed to update lesson')
    } catch (error) {
      console.error("Error updating lesson:", error)
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
      
      const response = await apperClient.deleteRecord('lesson', params)
      
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
          toast.success('Lesson deleted successfully')
          return true
        }
      }
      return false
    } catch (error) {
      console.error("Error deleting lesson:", error)
      throw error
    }
  }
}

export default lessonService