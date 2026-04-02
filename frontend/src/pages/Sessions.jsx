import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { showToast } from '../components/ui/Toast';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  BookOpen, 
  MessageSquare, 
  Plus, 
  ArrowRight, 
  Play, 
  Shield, 
  Search, 
  Filter,
  Timer,
  User,
  Loader2,
  Users2 as UsersIcon
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { formatDate, cn } from '../lib/utils';

export const Sessions = () => {
  const { sessions, myGroups, fetchSessions, fetchMyGroups, createSession, loading } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSession, setNewSession] = useState({ 
    title: '', 
    description: '', 
    startTime: '', 
    endTime: '',
    type: 'STUDY' 
  });

  useEffect(() => {
    fetchMyGroups();
  }, [fetchMyGroups]);

  useEffect(() => {
    if (myGroups.length > 0 && !selectedGroup) {
      setSelectedGroup(myGroups[0].id);
    }
  }, [myGroups, selectedGroup]);

  useEffect(() => {
    if (selectedGroup) {
      fetchSessions(selectedGroup);
    }
  }, [selectedGroup, fetchSessions]);

  const handleCreateSession = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedGroup) return;

    const result = await createSession(selectedGroup, newSession);
    if (result.success) {
      showToast.success('Session scheduled!');
      setShowCreateModal(false);
      setNewSession({ title: '', description: '', startTime: '', endTime: '', type: 'STUDY' });
    } else {
      showToast.error(result.error);
    }
  };

  const getSessionTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'study':
        return <BookOpen className="w-4 h-4" />;
      case 'discussion':
        return <MessageSquare className="w-4 h-4" />;
      case 'practice':
        return <Video className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getSessionTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'study':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'discussion':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'practice':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTimeRemaining = (startTime) => {
    const now = currentTime;
    const start = new Date(startTime);
    const diff = start - now;
    
    if (diff < 0) return { text: 'Started', status: 'started' };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (days > 0) return { text: `${days}d ${hours}h`, status: 'upcoming' };
    if (hours > 0) return { text: `${hours}h ${minutes}m`, status: 'upcoming' };
    if (minutes > 0) return { text: `${minutes}m ${seconds}s`, status: 'soon' };
    return { text: `${seconds}s`, status: 'imminent' };
  };

  const getSessionStatus = (session) => {
    const now = currentTime;
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'live';
    return 'ended';
  };

  const filteredSessions = (sessions || []).filter(session => {
    const status = getSessionStatus(session);
    if (filter === 'upcoming') return status === 'upcoming';
    if (filter === 'live') return status === 'live';
    if (filter === 'ended') return status === 'ended';
    return true;
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const statusA = getSessionStatus(a);
    const statusB = getSessionStatus(b);
    
    const statusPriority = { live: 0, upcoming: 1, ended: 2 };
    if (statusPriority[statusA] !== statusPriority[statusB]) {
      return statusPriority[statusA] - statusPriority[statusB];
    }
    
    return new Date(a.startTime) - new Date(b.startTime);
  });

  const handleJoinSession = (jitsiLink) => {
    if (jitsiLink) {
      window.open(jitsiLink, '_blank');
      showToast.success('Joining study room...');
    } else {
      showToast.error('Link not available');
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Study Sessions</h1>
            <p className="text-gray-400 mt-1">Join live rooms or schedule future collaboration sessions.</p>
            
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-medium text-gray-400">Current Group:</span>
              <select 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-primary-500"
                value={selectedGroup || ''}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                {myGroups.map(group => (
                  <option key={group.id} value={group.id} className="bg-slate-900">
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button onClick={() => setShowCreateModal(true)} disabled={!selectedGroup}>
            <Plus className="w-4 h-4 mr-2" /> Schedule Session
          </Button>
        </div>

        {/* Filters */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 w-fit">
          {['all', 'live', 'upcoming', 'ended'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-6 py-2 rounded-lg text-xs font-bold capitalize transition-all",
                filter === f ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" : "text-gray-400 hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {!selectedGroup ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <UsersIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Group Selected</h3>
            <p className="text-gray-400 mb-6">Join a study group to participate in live sessions.</p>
            <Button onClick={() => window.location.href = '/study-groups'}>
              Find Groups
            </Button>
          </div>
        ) : sortedSessions.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No sessions found</h3>
            <p className="text-gray-400 mb-6">Schedule a session to start learning together!</p>
            <Button onClick={() => setShowCreateModal(true)}>
              Schedule First Session
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedSessions.map((session, index) => {
              const status = getSessionStatus(session);
              const timeRemaining = getTimeRemaining(session.startTime);
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card glass hover padding="lg">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                      <div className={cn(
                        "p-4 rounded-2xl shrink-0",
                        getSessionTypeColor(session.type)
                      )}>
                        {getSessionTypeIcon(session.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-white truncate">{session.title}</h3>
                          {status === 'live' && (
                            <Badge className="bg-red-500/20 text-red-500 border-none animate-pulse">
                              LIVE
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-1">{session.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(session.startTime).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4 text-primary-500" />
                            <span className="text-gray-300">Organized by {session.organizerName || 'User'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                        <span className={cn(
                          "text-sm font-bold",
                          timeRemaining.status === 'imminent' ? 'text-red-400' : 
                          timeRemaining.status === 'soon' ? 'text-yellow-400' : 
                          'text-primary-400'
                        )}>
                          {status === 'ended' ? 'Session Ended' : timeRemaining.text}
                        </span>
                        
                        {status === 'live' ? (
                          <Button 
                            className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => handleJoinSession(session.jitsiLink)}
                          >
                            <Video className="w-4 h-4 mr-2" /> Join Now
                          </Button>
                        ) : status === 'upcoming' ? (
                          <Button variant="outline" className="w-full md:w-auto border-white/10 text-white" disabled>
                            Waiting...
                          </Button>
                        ) : (
                          <Button variant="ghost" className="w-full md:w-auto text-gray-500" disabled>
                            Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Schedule Study Session"
      >
        <form onSubmit={handleCreateSession} className="space-y-4">
          <Input
            label="Title"
            required
            value={newSession.title}
            onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
            placeholder="e.g. Physics Midterm Review"
          />
          <Textarea
            label="Description"
            required
            value={newSession.description}
            onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
            placeholder="What will you study?"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="datetime-local"
              required
              value={newSession.startTime}
              onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
            />
            <Input
              label="End Time"
              type="datetime-local"
              required
              value={newSession.endTime}
              onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Session Type</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500"
              value={newSession.type}
              onChange={(e) => setNewSession({ ...newSession, type: e.target.value })}
            >
              <option value="STUDY" className="bg-slate-900">Study Session</option>
              <option value="DISCUSSION" className="bg-slate-900">Discussion</option>
              <option value="PRACTICE" className="bg-slate-900">Practice Test</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1 text-white border-white/10" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              Schedule
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};
