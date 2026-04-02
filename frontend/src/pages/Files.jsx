import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { showToast } from '../components/ui/Toast';
import { 
  Upload, 
  Search, 
  File, 
  Download, 
  MoreVertical, 
  Trash2, 
  ThumbsUp, 
  ThumbsDown,
  Plus,
  FileText,
  Loader2,
  Calendar,
  Tag,
  ArrowUp,
  ArrowDown,
  Image,
  Video,
  Music,
  Archive,
  X,
  Users2 as UsersIcon
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { formatFileSize, formatDate, cn } from '../lib/utils';

export const Files = () => {
  const { files, myGroups, fetchFiles, fetchMyGroups, uploadFile, downloadFile, voteFile, loading } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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
      fetchFiles(selectedGroup, searchTerm);
    }
  }, [selectedGroup, searchTerm, fetchFiles]);

  const handleFileUpload = async (e) => {
    if (!selectedGroup) {
      showToast.error('Please select a group first');
      return;
    }

    const uploadedFiles = e.target.files || e.dataTransfer.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const formData = new FormData();
    formData.append('file', uploadedFiles[0]);
    
    const result = await uploadFile(selectedGroup, formData);
    if (result.success) {
      showToast.success('File uploaded successfully!');
    } else {
      showToast.error(result.error);
    }
  };

  const handleDownload = async (file) => {
    const result = await downloadFile(selectedGroup, file.id, file.name);
    if (result.success) {
      showToast.success('Download started');
    } else {
      showToast.error('Download failed');
    }
  };

  const handleVote = async (fileId, upvote) => {
    const result = await voteFile(selectedGroup, fileId, upvote);
    if (!result.success) {
      showToast.error('Vote failed');
    }
  };

  const getFileIcon = (fileName) => {
    const safeName = String(fileName || 'file').trim();
    const ext = safeName.includes('.') ? safeName.split('.').pop().toLowerCase() : '';
    const iconClasses = "w-8 h-8";
    
    if (['pdf'].includes(ext)) return <div className={`${iconClasses} bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center text-[10px] font-bold`}>PDF</div>;
    if (['doc', 'docx'].includes(ext)) return <div className={`${iconClasses} bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center text-[10px] font-bold`}>DOC</div>;
    if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) return <div className={`${iconClasses} bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center`}><Image className="w-5 h-5" /></div>;
    if (['mp4', 'mov', 'avi'].includes(ext)) return <div className={`${iconClasses} bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center`}><Video className="w-5 h-5" /></div>;
    if (['zip', 'rar', '7z'].includes(ext)) return <div className={`${iconClasses} bg-yellow-500/20 text-yellow-400 rounded-lg flex items-center justify-center`}><Archive className="w-5 h-5" /></div>;
    
    return <div className={`${iconClasses} bg-gray-500/20 text-gray-400 rounded-lg flex items-center justify-center`}><FileText className="w-5 h-5" /></div>;
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header & Group Selector */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Files & Resources</h1>
            <p className="text-gray-400 mt-1">Access shared study materials and contribute your own.</p>
            
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

          <div className="w-full lg:w-auto">
            <label 
              className={cn(
                "flex flex-col items-center justify-center w-full lg:w-80 h-32 border-2 border-dashed rounded-3xl cursor-pointer transition-all group relative overflow-hidden",
                isDragging ? "border-primary-500 bg-primary-500/10" : "border-white/10 hover:bg-white/5",
                !selectedGroup && "opacity-50 cursor-not-allowed"
              )}
              onDragOver={(e) => { e.preventDefault(); if (selectedGroup) setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (selectedGroup) handleFileUpload(e); }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                {loading ? (
                  <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-2" />
                ) : (
                  <Upload className="w-10 h-10 text-primary-500 group-hover:scale-110 transition-transform mb-2" />
                )}
                <p className="text-sm text-gray-400 font-medium">Click or drag to upload</p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOCX, PNG up to 20MB</p>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={loading || !selectedGroup}
              />
            </label>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Search files..." 
              className="pl-10 bg-transparent border-none focus:ring-0" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Files Grid */}
        {!selectedGroup ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <UsersIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Group Selected</h3>
            <p className="text-gray-400 mb-6">Join a study group to start sharing files.</p>
            <Button onClick={() => window.location.href = '/study-groups'}>
              Find Groups
            </Button>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No files found</h3>
            <p className="text-gray-400 mb-6">Be the first to share a resource in this group!</p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {files.map((file) => (
              (() => {
                const displayName = file.fileName || file.name || 'Untitled file';
                const displaySize = file.fileSize ?? file.size ?? 0;
                const uploaderName = file.uploadedBy?.name || file.uploadedBy || 'User';

                return (
              <motion.div
                key={file.id}
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className="group h-full relative overflow-hidden">
                  <CardHeader className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      {getFileIcon(displayName)}
                      <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 px-2 border border-white/5">
                        <button 
                          onClick={() => handleVote(file.id, true)}
                          className="p-1 hover:text-secondary-500 transition-colors"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold text-white px-1">{file.upvotes || 0}</span>
                        <button 
                          onClick={() => handleVote(file.id, false)}
                          className="p-1 hover:text-red-500 transition-colors"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <CardTitle className="text-lg group-hover:text-primary-500 transition-colors truncate">
                      {displayName}
                    </CardTitle>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      Added by <span className="text-gray-300">{uploaderName}</span> • {formatFileSize(displaySize)}
                    </p>
                  </CardHeader>

                  <CardContent className="p-5 pt-0">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {file.topic && (
                        <Badge variant="outline" className="text-[10px] bg-white/5 border-white/5 uppercase tracking-wider">
                          {file.topic}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[10px] bg-white/5 border-white/5 uppercase tracking-wider">
                        {formatDate(file.uploadedAt)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                      <Button 
                        onClick={() => handleDownload(file)}
                        variant="outline" 
                        className="flex-1 border-white/10 text-white hover:bg-primary-500 hover:border-primary-500"
                      >
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
                );
              })()
            ))}
          </div>
        )}
      </motion.div>
    </Layout>
  );
};
