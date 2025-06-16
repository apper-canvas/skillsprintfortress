import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { navRoutes } from '@/config/routes'

const Layout = () => {
  const location = useLocation()
  
  // Check if current route should show bottom nav
  const showBottomNav = navRoutes.some(route => 
    location.pathname.startsWith(route.path.split(':')[0].replace('*', ''))
  )

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 px-4 py-2 z-40">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {navRoutes.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-surface-500 hover:text-surface-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon 
                        name={route.icon} 
                        size={24} 
                        className={isActive ? 'text-primary' : 'text-surface-500'}
                      />
                    </motion.div>
                    <span className={`text-xs mt-1 font-medium ${
                      isActive ? 'text-primary' : 'text-surface-500'
                    }`}>
                      {route.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}

export default Layout