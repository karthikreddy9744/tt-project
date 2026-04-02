import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Menu,
  Settings,
  LogOut,
  Check,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

export const Navbar = () => {
  const { toggleSidebar, notifications, markNotificationRead, user, logout } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id) => {
    markNotificationRead(id);
  };

  return (
    <header className="sticky top-0 z-30 glass-dark border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden text-white hover:bg-white/10"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="relative max-w-md">
            <Input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 w-64 lg:w-96"
              icon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="text-white hover:bg-white/10 relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 glass-dark border border-white/20 rounded-2xl shadow-xl"
                >
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-400">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            'p-4 border-b border-white/10 cursor-pointer transition-colors',
                            'hover:bg-white/5',
                            !notification.read && 'bg-primary-500/10'
                          )}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={cn(
                              'w-2 h-2 rounded-full mt-2',
                              notification.read ? 'bg-gray-500' : 'bg-primary-500'
                            )} />
                            <div className="flex-1">
                              <p className="text-white font-medium text-sm">
                                {notification.title}
                              </p>
                              <p className="text-gray-400 text-xs mt-1">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-white hover:bg-white/10"
            >
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold text-xs border border-primary-500/30">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </Button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 glass-dark border border-white/20 rounded-2xl shadow-xl"
                >
                  <div className="p-4 border-b border-white/10">
                    <p className="text-white font-medium">{user?.name || 'Guest'}</p>
                    <p className="text-gray-400 text-sm truncate">{user?.email || 'No email'}</p>
                  </div>
                  <div className="py-2">
                    <button 
                      onClick={() => window.location.href = '/profile'}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
