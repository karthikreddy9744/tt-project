import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, CheckCircle, Clock } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/utils';

export const ActiveDiscussions = () => {
  const { discussions } = useAppStore();

  const getAuthorName = (author) => {
    if (!author) return 'User';
    if (typeof author === 'string') return author;
    return author.name || author.email || 'User';
  };

  return (
    <Card glass padding="lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Active Discussions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {discussions.slice(0, 3).map((discussion, index) => (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-white font-medium">{discussion.title}</h4>
                    {discussion.isSolved && (
                      <span className="flex items-center text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-lg">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Solved
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {discussion.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <img
                          src={discussion.authorAvatar}
                          alt={getAuthorName(discussion.author)}
                          className="w-4 h-4 rounded-full mr-1"
                        />
                        {getAuthorName(discussion.author)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(discussion.createdAt)}
                      </span>
                      <span>{(discussion.replies || []).length} replies</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-gray-400">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{discussion.upvotes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
            View All Discussions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
