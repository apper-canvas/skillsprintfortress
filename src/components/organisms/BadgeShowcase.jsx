import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from '@/components/atoms/Badge'
import { badgeService } from '@/services'
import ApperIcon from '@/components/ApperIcon'

const BadgeShowcase = ({ user, className = '' }) => {
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBadge, setSelectedBadge] = useState(null)
  
  useEffect(() => {
    const loadBadges = async () => {
      try {
        const allBadges = await badgeService.getAll()
        setBadges(allBadges)
      } catch (error) {
        console.error('Failed to load badges:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadBadges()
  }, [])
  
  const earnedBadges = badges.filter(badge => user?.badges?.includes(badge.id))
  const unearnedBadges = badges.filter(badge => !user?.badges?.includes(badge.id))
  
  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-surface-200 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-surface-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-16 h-16 bg-surface-200 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <>
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-surface-200 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-surface-900 text-lg">
            Badge Collection
          </h3>
          <span className="text-sm text-surface-600">
            {earnedBadges.length} / {badges.length}
          </span>
        </div>
        
        {earnedBadges.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-surface-700 mb-3 text-sm">Earned</h4>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {earnedBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: index * 0.1, 
                    type: "spring", 
                    stiffness: 200 
                  }}
                >
                  <Badge
                    badge={badge}
                    earned={true}
                    size="medium"
                    showShimmer={index === earnedBadges.length - 1}
                    onClick={() => setSelectedBadge(badge)}
                    className="group"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {unearnedBadges.length > 0 && (
          <div>
            <h4 className="font-medium text-surface-700 mb-3 text-sm">Locked</h4>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {unearnedBadges.slice(0, 12).map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge
                    badge={badge}
                    earned={false}
                    size="medium"
                    onClick={() => setSelectedBadge(badge)}
                    className="group"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {badges.length === 0 && (
          <div className="text-center py-8">
            <ApperIcon name="Award" size={48} className="text-surface-300 mx-auto mb-3" />
            <p className="text-surface-500">No badges available</p>
          </div>
        )}
      </div>
      
      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedBadge(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
                <Badge
                  badge={selectedBadge}
                  earned={user?.badges?.includes(selectedBadge.id)}
                  size="large"
                  className="mx-auto mb-4"
                />
                
                <h3 className="font-display font-bold text-surface-900 text-xl mb-2">
                  {selectedBadge.name}
                </h3>
                
                <p className="text-surface-600 mb-4 break-words">
                  {selectedBadge.description}
                </p>
                
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${
                    selectedBadge.rarity === 'common' ? 'bg-surface-400' :
                    selectedBadge.rarity === 'uncommon' ? 'bg-green-400' :
                    selectedBadge.rarity === 'rare' ? 'bg-blue-400' : 
                    selectedBadge.rarity === 'epic' ? 'bg-purple-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className="text-sm text-surface-600 capitalize">
                    {selectedBadge.rarity}
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setSelectedBadge(null)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default BadgeShowcase