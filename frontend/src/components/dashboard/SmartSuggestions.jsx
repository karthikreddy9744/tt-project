import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Users, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

export const SmartSuggestions = () => {
  const suggestions = [
    {
      id: 1,
      type: 'study_group',
      title: 'Join Physics Study Group',
      description: 'Based on your recent activity in physics discussions',
      icon: <Users className="w-5 h-5" />,
      action: 'Join Group',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      id: 2,
      type: 'resource',
      title: 'Advanced Calculus Resources',
      description: 'Popular files in your study areas',
      icon: <BookOpen className="w-5 h-5" />,
      action: 'View Resources',
      color: 'bg-green-500/20 text-green-400 border-green-500/30'
    },
    {
      id: 3,
      type: 'session',
      title: 'Algorithm Practice Session',
      description: 'Starting in 2 hours - limited spots available',
      icon: <TrendingUp className="w-5 h-5" />,
      action: 'Reserve Spot',
      color: 'bg-accent-500/20 text-accent-400 border-accent-500/30'
    }
  ];

  return (
    <Card glass padding="lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-2xl border ${suggestion.color} bg-white/5 hover:bg-white/10 transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${suggestion.color.split(' ')[0]}`}>
                    {suggestion.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">
                      {suggestion.title}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-white/20 hover:bg-white/10"
                >
                  {suggestion.action}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
