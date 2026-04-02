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
  MessageSquare, 
  Search, 
  Plus, 
  ArrowUp, 
  CheckCircle, 
  Clock, 
  ChevronDown,
  ChevronUp,
  User,
  ThumbsUp,
  Loader2,
  Users2 as UsersIcon
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { formatDate, cn } from '../lib/utils';

export const Discussions = () => {
  const { discussions, myGroups, fetchDiscussions, fetchMyGroups, createDiscussion, voteDiscussion, addReply, loading } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'solved', 'unsolved'
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '', tags: '' });

  const getUserName = (userLike) => {
    if (!userLike) return 'User';
    if (typeof userLike === 'string') return userLike;
    return userLike.name || userLike.email || 'User';
  };

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
      const isSolvedParam = filter === 'solved' ? true : filter === 'unsolved' ? false : null;
      fetchDiscussions(selectedGroup, searchTerm, isSolvedParam);
    }
  }, [selectedGroup, searchTerm, filter, fetchDiscussions]);

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    if (!selectedGroup) return;

    const result = await createDiscussion(selectedGroup, {
      ...newDiscussion,
      tags: newDiscussion.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
    if (result.success) {
      showToast.success('Discussion started!');
      setShowNewModal(false);
      setNewDiscussion({ title: '', content: '', tags: '' });
    } else {
      showToast.error(result.error);
    }
  };

  const handleReply = async (discussionId) => {
    if (!selectedGroup) return;
    if (replyContent.trim()) {
      const result = await addReply(selectedGroup, discussionId, replyContent);
      if (result.success) {
        showToast.success('Reply posted!');
        setReplyContent('');
      } else {
        showToast.error(result.error);
      }
    } else {
      showToast.error('Please enter a reply');
    }
  };

  const handleVote = async (discussionId, upvote) => {
    if (!selectedGroup) return;
    const result = await voteDiscussion(selectedGroup, discussionId, upvote);
    if (!result.success) {
      showToast.error('Vote failed');
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Discussions</h1>
            <p className="text-gray-400 mt-1">Ask questions, share knowledge, and learn from others.</p>
            
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
          <Button onClick={() => setShowNewModal(true)} disabled={!selectedGroup}>
            <Plus className="w-4 h-4 mr-2" /> New Discussion
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input 
              placeholder="Search discussions..." 
              className="pl-12 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            {['all', 'unsolved', 'solved'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all",
                  filter === f ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" : "text-gray-400 hover:text-white"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {!selectedGroup ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <UsersIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Group Selected</h3>
              <p className="text-gray-400 mb-6">Join a study group to start participating in discussions.</p>
              <Button onClick={() => window.location.href = '/study-groups'}>
                Find Groups
              </Button>
            </div>
          ) : discussions.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No discussions found</h3>
              <p className="text-gray-400 mb-6">Be the first to start a conversation!</p>
              <Button onClick={() => setShowNewModal(true)} variant="outline" className="text-white border-white/10">
                Start Discussion
              </Button>
            </div>
          ) : (
            discussions.map((discussion) => (
              <motion.div
                key={discussion.id}
                className={cn(
                  "glass-card overflow-hidden transition-all duration-300",
                  expandedId === discussion.id ? "ring-2 ring-primary-500/50" : "hover:bg-white/5"
                )}
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === discussion.id ? null : discussion.id)}
                >
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center gap-1">
                      <button 
                        className="p-2 rounded-xl hover:bg-primary-500/20 text-gray-400 hover:text-primary-500 transition-colors" 
                        onClick={(e) => { e.stopPropagation(); handleVote(discussion.id, true); }}
                      >
                        <ArrowUp className="w-5 h-5" />
                      </button>
                      <span className="text-lg font-bold text-white">{discussion.upvotes || 0}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {discussion.isSolved && (
                          <Badge variant="outline" className="bg-secondary-500/10 border-secondary-500/20 text-secondary-500">
                            <CheckCircle className="w-3 h-3 mr-1" /> Solved
                          </Badge>
                        )}
                        {(discussion.tags || []).map(tag => (
                          <Badge key={tag} variant="outline" className="text-[10px] bg-white/5 border-white/5 uppercase tracking-wider">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 truncate">
                        {discussion.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                        {discussion.content}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold text-[10px]">
                              {getUserName(discussion.author).charAt(0)}
                            </div>
                            <span className="text-gray-300">{getUserName(discussion.author)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(discussion.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4" />
                            <span>{(discussion.replies || []).length} replies</span>
                          </div>
                        </div>
                        
                        <div className="text-primary-500">
                          {expandedId === discussion.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === discussion.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 bg-black/20"
                    >
                      <div className="p-6 space-y-6">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {discussion.content}
                          </p>
                        </div>

                        <div className="space-y-4 pl-6 border-l-2 border-white/5">
                          {(discussion.replies || []).map(reply => (
                            <div key={reply.id} className={cn(
                              "flex gap-4 p-3 rounded-xl",
                              reply.isAccepted && "bg-secondary-500/5 border border-secondary-500/20"
                            )}>
                              <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold text-xs shrink-0">
                                {getUserName(reply.author).charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-xs font-bold text-white">
                                    {getUserName(reply.author)} <span className="text-gray-500 font-normal ml-2">{formatDate(reply.createdAt)}</span>
                                  </p>
                                  {reply.isAccepted && (
                                    <Badge className="bg-secondary-500/20 text-secondary-500 border-none h-5 px-1.5">
                                      <CheckCircle className="w-3 h-3" />
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-4">
                          <Input 
                            placeholder="Write a reply..." 
                            className="flex-1"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleReply(discussion.id)}
                          />
                          <Button size="sm" onClick={() => handleReply(discussion.id)}>Reply</Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* New Discussion Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Start New Discussion"
      >
        <form onSubmit={handleCreateDiscussion} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Title</label>
            <Input
              required
              value={newDiscussion.title}
              onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
              placeholder="What do you want to discuss?"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Content</label>
            <Textarea
              required
              value={newDiscussion.content}
              onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
              placeholder="Provide more details..."
              className="min-h-[150px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Tags (comma separated)</label>
            <Input
              value={newDiscussion.tags}
              onChange={(e) => setNewDiscussion({ ...newDiscussion, tags: e.target.value })}
              placeholder="e.g. math, calculus, help"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-white border-white/10 hover:bg-white/5"
              onClick={() => setShowNewModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Post Discussion
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};
