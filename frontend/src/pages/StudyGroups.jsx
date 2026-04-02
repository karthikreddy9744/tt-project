import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { showToast } from '../components/ui/Toast';
import { 
  Users, 
  Search, 
  Plus, 
  ArrowRight, 
  Activity, 
  Shield, 
  Filter,
  Users2 as UsersIcon
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { cn } from '../lib/utils';

export const StudyGroups = () => {
  const { groups, myGroups, fetchGroups, fetchMyGroups, createGroup, joinGroup, loading } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' or 'my'
  const [newGroup, setNewGroup] = useState({ name: '', subject: '', description: '', privacy: 'PUBLIC' });

  useEffect(() => {
    fetchGroups();
    fetchMyGroups();
  }, [fetchGroups, fetchMyGroups]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGroups(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchGroups]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const result = await createGroup(newGroup);
    if (result.success) {
      showToast.success('Study group created successfully!');
      setShowCreateModal(false);
      setNewGroup({ name: '', subject: '', description: '', privacy: 'PUBLIC' });
      setActiveTab('my');
    } else {
      showToast.error(result.error);
    }
  };

  const handleJoinGroup = async (id) => {
    const result = await joinGroup(id);
    if (result.success) {
      showToast.success('Joined group successfully!');
      setActiveTab('my');
    } else {
      showToast.error(result.error);
    }
  };

  const displayedGroups = activeTab === 'my' ? myGroups : groups;

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Study Groups</h1>
            <p className="text-gray-400 mt-1">Explore and join groups that match your interests.</p>
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search subjects..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Create Group</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('discover')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
              activeTab === 'discover' 
                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
              activeTab === 'my' 
                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            My Groups
          </button>
        </div>

        {displayedGroups.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <UsersIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No groups found</h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'my' 
                ? "You haven't joined any groups yet." 
                : "Try adjusting your search or create a new group."}
            </p>
            <Button 
              onClick={() => activeTab === 'my' ? setActiveTab('discover') : setShowCreateModal(true)} 
              variant="outline" 
              className="text-white border-white/10"
            >
              {activeTab === 'my' ? "Discover Groups" : "Create New Group"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedGroups.map((group) => (
              <motion.div
                key={group.id}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className="h-full group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors" />
                  
                  <CardHeader className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="flex gap-2">
                        {group.privacy === 'PRIVATE' && (
                          <Badge variant="outline" className="bg-slate-800 border-white/10 text-gray-400">
                            <Shield className="w-3 h-3 mr-1" /> Private
                          </Badge>
                        )}
                        {myGroups.some(mg => mg.id === group.id) && (
                          <Badge className="bg-secondary-500/20 text-secondary-500 border-secondary-500/30">
                            Member
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary-500 transition-colors">
                      {group.name}
                    </CardTitle>
                    <p className="text-sm text-primary-400 font-medium">{group.subject}</p>
                  </CardHeader>

                  <CardContent className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                    <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                      {group.description}
                    </p>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Members</p>
                          <p className="text-white font-bold">{group.memberCount || 0}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Created</p>
                          <p className="text-white font-bold text-xs truncate">
                            {new Date(group.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {myGroups.some(mg => mg.id === group.id) ? (
                        <Button 
                          variant="outline" 
                          className="w-full border-primary-500/20 text-primary-500 hover:bg-primary-500 hover:text-white group"
                        >
                          Enter Group <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleJoinGroup(group.id)}
                          className="w-full bg-primary-500 text-white hover:bg-primary-600"
                        >
                          Join Group <Plus className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Create Group Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Study Group"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <Input
            label="Group Name"
            required
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            placeholder="e.g. Advanced Algorithms"
          />
          <Input
            label="Subject"
            required
            value={newGroup.subject}
            onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })}
            placeholder="e.g. Computer Science"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary-500 transition-all text-white placeholder-gray-500 min-h-[100px]"
              required
              value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              placeholder="What is this group about?"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Privacy</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary-500 transition-all text-white"
              value={newGroup.privacy}
              onChange={(e) => setNewGroup({ ...newGroup, privacy: e.target.value })}
            >
              <option value="PUBLIC" className="bg-slate-900">Public - Anyone can join</option>
              <option value="PRIVATE" className="bg-slate-900">Private - Invite only</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 text-white hover:bg-white/5"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Group
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};
