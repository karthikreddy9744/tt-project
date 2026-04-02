import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { ActivityHeatmap } from '../components/dashboard/ActivityHeatmap';
import { RecentFiles } from '../components/dashboard/RecentFiles';
import { ActiveDiscussions } from '../components/dashboard/ActiveDiscussions';
import { UpcomingSessions } from '../components/dashboard/UpcomingSessions';
import { SmartSuggestions } from '../components/dashboard/SmartSuggestions';
import { useAppStore } from '../lib/store';

export const Dashboard = () => {
  const { user, myGroups, fetchMyGroups, fetchFiles, fetchDiscussions, fetchSessions } = useAppStore();

  useEffect(() => {
    const loadDashboard = async () => {
      await fetchMyGroups();
    };
    loadDashboard();
  }, [fetchMyGroups]);

  useEffect(() => {
    if (myGroups && myGroups.length > 0) {
      const firstGroupId = myGroups[0].id;
      fetchFiles(firstGroupId);
      fetchDiscussions(firstGroupId);
      fetchSessions(firstGroupId);
    }
  }, [myGroups, fetchFiles, fetchDiscussions, fetchSessions]);
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
          </h1>
          <p className="text-gray-400">
            Here's what's happening in your study groups today.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Study Groups', value: '3', change: '+1 this week', color: 'bg-primary-500/20 text-primary-400 border-primary-500/30' },
            { label: 'Active Sessions', value: '2', change: 'Starting soon', color: 'bg-secondary-500/20 text-secondary-400 border-secondary-500/30' },
            { label: 'Files Shared', value: '12', change: '+3 today', color: 'bg-accent-500/20 text-accent-400 border-accent-500/30' },
            { label: 'Discussions', value: '8', change: '2 solved', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl border ${stat.color} glass-dark`}
            >
              <h3 className="text-white font-semibold text-2xl mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <span className="text-xs font-medium">{stat.change}</span>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ActivityHeatmap />
            <SmartSuggestions />
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            <RecentFiles />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ActiveDiscussions />
            <UpcomingSessions />
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};
