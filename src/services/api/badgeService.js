import { toast } from 'react-toastify'

const badgeService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'description', 'icon', 'requirement', 'rarity']
      }
      
      const response = await apperClient.fetchRecords('badge', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data.map(badge => ({
        id: badge.Id,
        name: badge.Name,
        description: badge.description,
        icon: badge.icon,
        requirement: typeof badge.requirement === 'string' ? JSON.parse(badge.requirement) : badge.requirement,
        rarity: badge.rarity
      }))
    } catch (error) {
      console.error("Error fetching badges:", error)
      toast.error("Failed to load badges")
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
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'description', 'icon', 'requirement', 'rarity']
      }
      
      const response = await apperClient.getRecordById('badge', id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Badge not found')
      }
      
      const badge = response.data
      return {
        id: badge.Id,
        name: badge.Name,
        description: badge.description,
        icon: badge.icon,
        requirement: typeof badge.requirement === 'string' ? JSON.parse(badge.requirement) : badge.requirement,
        rarity: badge.rarity
      }
    } catch (error) {
      console.error(`Error fetching badge with ID ${id}:`, error)
      throw error
    }
  },

  async checkEligibility(userId, userStats) {
    try {
      const allBadges = await this.getAll()
      const eligibleBadges = []
      
      allBadges.forEach(badge => {
        const { type, value } = badge.requirement
        let isEligible = false
        
        switch (type) {
          case 'streak':
            isEligible = userStats.current_streak >= value
            break
          case 'lessons_completed':
            isEligible = userStats.completed_lessons?.split(',').length >= value
            break
          case 'category_complete':
            // Check if all lessons in a category are completed
            isEligible = userStats.categoryProgress?.[value] === 100
            break
          case 'xp_earned':
            isEligible = userStats.total_xp >= value
            break
          case 'level_reached':
            isEligible = userStats.current_level >= value
            break
          default:
            isEligible = false
        }
        
        if (isEligible && !userStats.badges?.split(',').includes(badge.id)) {
          eligibleBadges.push({ ...badge })
        }
      })
      
      return eligibleBadges
    } catch (error) {
      console.error("Error checking badge eligibility:", error)
      return []
    }
  },

  async create(badge) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [
          {
            Name: badge.name,
            description: badge.description,
            icon: badge.icon,
            requirement: typeof badge.requirement === 'object' ? JSON.stringify(badge.requirement) : badge.requirement,
            rarity: badge.rarity
          }
        ]
      }
      
      const response = await apperClient.createRecord('badge', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Failed to create badge')
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
          toast.success('Badge created successfully')
          return {
            id: created.Id,
            name: created.Name,
            description: created.description,
            icon: created.icon,
            requirement: typeof created.requirement === 'string' ? JSON.parse(created.requirement) : created.requirement,
            rarity: created.rarity
          }
        }
      }
      throw new Error('Failed to create badge')
    } catch (error) {
      console.error("Error creating badge:", error)
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
      
      if (updates.name !== undefined) updateData.Name = updates.name
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.icon !== undefined) updateData.icon = updates.icon
      if (updates.requirement !== undefined) {
        updateData.requirement = typeof updates.requirement === 'object' ? JSON.stringify(updates.requirement) : updates.requirement
      }
      if (updates.rarity !== undefined) updateData.rarity = updates.rarity
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('badge', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Failed to update badge')
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
          toast.success('Badge updated successfully')
          return {
            id: updated.Id,
            name: updated.Name,
            description: updated.description,
            icon: updated.icon,
            requirement: typeof updated.requirement === 'string' ? JSON.parse(updated.requirement) : updated.requirement,
            rarity: updated.rarity
          }
        }
      }
      throw new Error('Failed to update badge')
    } catch (error) {
      console.error("Error updating badge:", error)
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
      
      const response = await apperClient.deleteRecord('badge', params)
      
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
          toast.success('Badge deleted successfully')
          return true
        }
      }
      return false
    } catch (error) {
      console.error("Error deleting badge:", error)
      throw error
    }
  }
}

export default badgeService