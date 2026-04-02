import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  Calendar,
  User,
  X,
  Moon,
  Sun,
  LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../lib/store';
import { Button } from '../ui/Button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Study Groups', href: '/study-groups', icon: Users },
  { name: 'Discussions', href: '/discussions', icon: MessageSquare },
  { name: 'Files', href: '/files', icon: FileText },
  { name: 'Sessions', href: '/sessions', icon: Calendar },
  { name: 'Profile', href: '/profile', icon: User },
];

export const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar, isDarkMode, toggleTheme, user, logout } = useAppStore();
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : -320,
        }}
        className={cn(
          'fixed left-0 top-0 h-full w-80 z-50 lg:translate-x-0',
          'glass-dark border-r border-white/10'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">StudyHub</h1>
                <p className="text-xs text-gray-400">Learn Together</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-white hover:bg-white/10"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 relative',
                      'text-gray-300 hover:text-white hover:bg-white/10',
                      isActive && 'bg-primary-500/20 text-white border border-primary-500/30'
                    )}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 w-1 h-8 bg-primary-500 rounded-r-full"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold border border-primary-500/30">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || 'Not signed in'}</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={logout}
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl px-4"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span className="font-medium text-sm">Sign Out</span>
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
