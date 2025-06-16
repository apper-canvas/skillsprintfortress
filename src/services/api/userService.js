import { toast } from 'react-toastify'

const userService = {
  async getUser() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'current_level', 'total_xp', 'current_streak', 'daily_goal', 'completed_lessons', 'badges', 'daily_progress', 'last_lesson_date', 'preferred_categories'],
        PagingInfo: {
          Limit: 1
        }
      }
      
      const response = await apperClient.fetchRecords('User1', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        // Return default user if no user found
        return {
          id: 'user_001',
          currentLevel: 1,
          totalXP: 0,
          currentStreak: 0,
          dailyGoal: 2,
          completedLessons: [],
          badges: [],
          dailyProgress: 0,
          lastLessonDate: new Date().toISOString().split('T')[0],
          preferredCategories: []
        }
      }
      
      if (response.data.length === 0) {
        // Create default user if none exists
        return await this.createDefaultUser()
      }
      
      const user = response.data[0]
      return {
        id: user.Id,
        currentLevel: user.current_level || 1,
        totalXP: user.total_xp || 0,
        currentStreak: user.current_streak || 0,
        dailyGoal: user.daily_goal || 2,
        completedLessons: user.completed_lessons ? user.completed_lessons.split(',').filter(Boolean) : [],
        badges: user.badges ? user.badges.split(',').filter(Boolean) : [],
        dailyProgress: user.daily_progress || 0,
        lastLessonDate: user.last_lesson_date || new Date().toISOString().split('T')[0],
        preferredCategories: user.preferred_categories ? user.preferred_categories.split(',').filter(Boolean) : []
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      // Return default user on error
      return {
        id: 'user_001',
        currentLevel: 1,
        totalXP: 0,
        currentStreak: 0,
        dailyGoal: 2,
        completedLessons: [],
        badges: [],
        dailyProgress: 0,
        lastLessonDate: new Date().toISOString().split('T')[0],
        preferredCategories: []
      }
    }
  },

  async createDefaultUser() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [
          {
            Name: 'Default User',
            current_level: 1,
            total_xp: 0,
            current_streak: 0,
            daily_goal: 2,
            completed_lessons: '',
            badges: '',
            daily_progress: 0,
            last_lesson_date: new Date().toISOString().split('T')[0],
            preferred_categories: 'productivity,communication'
          }
        ]
      }
      
      const response = await apperClient.createRecord('User1', params)
      
      if (!response.success) {
        console.error(response.message)
        // Return default values if creation fails
        return {
          id: 'user_001',
          currentLevel: 1,
          totalXP: 0,
          currentStreak: 0,
          dailyGoal: 2,
          completedLessons: [],
          badges: [],
          dailyProgress: 0,
          lastLessonDate: new Date().toISOString().split('T')[0],
          preferredCategories: ['productivity', 'communication']
        }
      }
      
      if (response.results && response.results[0].success) {
        const created = response.results[0].data
        return {
          id: created.Id,
          currentLevel: created.current_level,
          totalXP: created.total_xp,
          currentStreak: created.current_streak,
          dailyGoal: created.daily_goal,
          completedLessons: [],
          badges: [],
          dailyProgress: created.daily_progress,
          lastLessonDate: created.last_lesson_date,
          preferredCategories: ['productivity', 'communication']
        }
      }
      
      throw new Error('Failed to create default user')
    } catch (error) {
      console.error("Error creating default user:", error)
      return {
        id: 'user_001',
        currentLevel: 1,
        totalXP: 0,
        currentStreak: 0,
        dailyGoal: 2,
        completedLessons: [],
        badges: [],
        dailyProgress: 0,
        lastLessonDate: new Date().toISOString().split('T')[0],
        preferredCategories: ['productivity', 'communication']
      }
    }
  },

  async updateUser(updates) {
    try {
      const currentUser = await this.getUser()
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const updateData = {
        Id: currentUser.id
      }
      
      if (updates.currentLevel !== undefined) updateData.current_level = updates.currentLevel
      if (updates.totalXP !== undefined) updateData.total_xp = updates.totalXP
      if (updates.currentStreak !== undefined) updateData.current_streak = updates.currentStreak
      if (updates.dailyGoal !== undefined) updateData.daily_goal = updates.dailyGoal
      if (updates.completedLessons !== undefined) {
        updateData.completed_lessons = Array.isArray(updates.completedLessons) 
          ? updates.completedLessons.join(',') 
          : updates.completedLessons
      }
      if (updates.badges !== undefined) {
        updateData.badges = Array.isArray(updates.badges) 
          ? updates.badges.join(',') 
          : updates.badges
      }
      if (updates.dailyProgress !== undefined) updateData.daily_progress = updates.dailyProgress
      if (updates.lastLessonDate !== undefined) updateData.last_lesson_date = updates.lastLessonDate
      if (updates.preferredCategories !== undefined) {
        updateData.preferred_categories = Array.isArray(updates.preferredCategories) 
          ? updates.preferredCategories.join(',') 
          : updates.preferredCategories
      }
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('User1', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return currentUser
      }
      
      if (response.results && response.results[0].success) {
        const updated = response.results[0].data
        return {
          id: updated.Id,
          currentLevel: updated.current_level,
          totalXP: updated.total_xp,
          currentStreak: updated.current_streak,
          dailyGoal: updated.daily_goal,
          completedLessons: updated.completed_lessons ? updated.completed_lessons.split(',').filter(Boolean) : [],
          badges: updated.badges ? updated.badges.split(',').filter(Boolean) : [],
          dailyProgress: updated.daily_progress,
          lastLessonDate: updated.last_lesson_date,
          preferredCategories: updated.preferred_categories ? updated.preferred_categories.split(',').filter(Boolean) : []
        }
      }
      
      return currentUser
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Failed to update user")
      throw error
    }
  },

  async addXP(amount) {
    try {
      const currentUser = await this.getUser()
      const newXP = currentUser.totalXP + amount
      const newLevel = Math.floor(newXP / 1000) + 1
      
      const updatedUser = await this.updateUser({
        totalXP: newXP,
        currentLevel: newLevel
      })
      
      toast.success(`+${amount} XP earned!`)
      return updatedUser
    } catch (error) {
      console.error("Error adding XP:", error)
      throw error
    }
  },

  async completeLesson(lessonId) {
    try {
      const currentUser = await this.getUser()
      
      if (!currentUser.completedLessons.includes(lessonId)) {
        const updatedCompletedLessons = [...currentUser.completedLessons, lessonId]
        
        const updatedUser = await this.updateUser({
          completedLessons: updatedCompletedLessons,
          lastLessonDate: new Date().toISOString().split('T')[0]
        })
        
        toast.success('Lesson completed!')
        return updatedUser
      }
      
      return currentUser
    } catch (error) {
      console.error("Error completing lesson:", error)
      throw error
    }
  },

  async updateStreak() {
    try {
      const currentUser = await this.getUser()
      
      const updatedUser = await this.updateUser({
        currentStreak: currentUser.currentStreak + 1
      })
      
      toast.success('Streak updated!')
      return updatedUser
    } catch (error) {
      console.error("Error updating streak:", error)
      throw error
    }
  },

  async earnBadge(badgeId) {
    try {
      const currentUser = await this.getUser()
      
      if (!currentUser.badges.includes(badgeId)) {
        const updatedBadges = [...currentUser.badges, badgeId]
        
        const updatedUser = await this.updateUser({
          badges: updatedBadges
        })
        
        toast.success('New badge earned!')
        return updatedUser
      }
      
      return currentUser
    } catch (error) {
      console.error("Error earning badge:", error)
      throw error
    }
  },

  async setDailyGoal(goal) {
    try {
      const updatedUser = await this.updateUser({
        dailyGoal: goal
      })
      
      toast.success(`Daily goal set to ${goal} sessions`)
      return updatedUser
    } catch (error) {
      console.error("Error setting daily goal:", error)
throw error
    }
  },

  async createCleanUser(selectedCategories = []) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [
          {
            Name: 'New User',
            current_level: 1,
            total_xp: 0,
            current_streak: 0,
            daily_goal: 2,
            completed_lessons: '',
            badges: '',
            daily_progress: 0,
            last_lesson_date: new Date().toISOString().split('T')[0],
            preferred_categories: selectedCategories.join(',')
          }
        ]
      }
      
      const response = await apperClient.createRecord('User1', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Failed to create user')
      }
      
      if (response.results && response.results[0].success) {
        const created = response.results[0].data
        toast.success('Account created successfully!')
        return {
          id: created.Id,
          currentLevel: created.current_level,
          totalXP: created.total_xp,
          currentStreak: created.current_streak,
          dailyGoal: created.daily_goal,
          completedLessons: [],
          badges: [],
          dailyProgress: created.daily_progress,
          lastLessonDate: created.last_lesson_date,
          preferredCategories: selectedCategories
        }
      }
      
      throw new Error('Failed to create clean user')
    } catch (error) {
      console.error("Error creating clean user:", error)
      throw error
    }
  },

  async updatePreferences(categories) {
    try {
      const updatedUser = await this.updateUser({
        preferredCategories: categories
      })
      
      toast.success('Preferences updated successfully!')
      return updatedUser
    } catch (error) {
      console.error("Error updating preferences:", error)
      throw error
    }
  }
}

export default userService