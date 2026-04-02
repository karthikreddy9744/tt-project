import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, Video, MessageSquare } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/utils';

export const UpcomingSessions = () => {
  const { sessions } = useAppStore();

  const upcomingSessions = sessions
    .filter(session => new Date(session.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 3);

  const getSessionTypeIcon = (type) => {
    switch (type) {
      case 'study':
        return <Users className="w-4 h-4" />;
      case 'discussion':
        return <MessageSquare className="w-4 h-4" />;
      case 'practice':
        return <Video className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTimeRemaining = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;
    
    if (diff < 0) return 'Started';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes} min${minutes > 1 ? 's' : ''}`;
    }
  };

  return (
    <Card glass padding="lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Upcoming Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-white font-medium">{session.title}</h4>
                    <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-lg">
                      {session.type}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {session.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(session.startTime)}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {session.participants}/{session.maxParticipants}
                    </span>
                    <span className="flex items-center">
                      <img
                        src={session.hostAvatar}
                        alt={session.host}
                        className="w-4 h-4 rounded-full mr-1"
                      />
                      {session.host}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-xs text-primary-400 font-medium">
                    {getTimeRemaining(session.startTime)}
                  </span>
                  <Button
                    size="sm"
                    variant={session.isJoined ? "secondary" : "primary"}
                    className="text-xs"
                  >
                    {session.isJoined ? 'Joined' : 'Join'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
            View All Sessions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
