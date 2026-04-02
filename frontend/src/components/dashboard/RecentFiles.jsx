import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ThumbsUp, Clock } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatFileSize, formatDate } from '../../lib/utils';

export const RecentFiles = () => {
  const { files } = useAppStore();

  const getUploaderName = (uploadedBy) => {
    if (!uploadedBy) return 'User';
    if (typeof uploadedBy === 'string') return uploadedBy;
    return uploadedBy.name || uploadedBy.email || 'User';
  };

  const getFileIcon = (type) => {
    const iconClasses = "w-8 h-8";
    switch (type) {
      case 'pdf':
        return <div className={`${iconClasses} bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center`}>PDF</div>;
      case 'doc':
        return <div className={`${iconClasses} bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center`}>DOC</div>;
      case 'image':
        return <div className={`${iconClasses} bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center`}>IMG</div>;
      default:
        return <FileText className={iconClasses + " text-gray-400"} />;
    }
  };

  return (
    <Card glass padding="lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Recent Files
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {files.slice(0, 4).map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center space-x-4">
                {getFileIcon(file.type || file.fileType)}
                <div>
                  <h4 className="text-white font-medium">{file.name || file.fileName || 'Untitled file'}</h4>
                  <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(file.uploadedAt)}
                    </span>
                    <span>{formatFileSize(file.size || file.fileSize || 0)}</span>
                    <span>by {getUploaderName(file.uploadedBy)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-gray-400">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">{file.upvotes}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
            View All Files
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
