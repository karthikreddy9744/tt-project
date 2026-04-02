import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { showToast } from '../components/ui/Toast';
import { cn, formatDate } from '../lib/utils';
import { 
  User, 
  Mail, 
  BookOpen, 
  Calendar, 
  Shield, 
  Edit2, 
  Save, 
  X,
  Camera,
  LogOut,
  Loader2
} from 'lucide-react';
import { useAppStore } from '../lib/store';

export const Profile = () => {
  const { user, setUser, logout, loading } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    institution: user?.institution || '',
  });

  const handleSave = async () => {
    // In a real app, this would call an API
    // For now, we'll simulate success
    showToast.success('Profile updated successfully!');
    setUser({ ...user, ...formData });
    setIsEditing(false);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">My Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" className="text-white border-white/10" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Basic Info */}
          <Card glass className="md:col-span-1 h-fit">
            <CardContent className="pt-8 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white/10 shadow-2xl mb-6">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                {isEditing && (
                  <button className="absolute bottom-6 right-0 p-2 bg-primary-500 rounded-full text-white shadow-lg hover:bg-primary-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
              <p className="text-primary-400 font-medium mb-6">{user?.institution || 'Student'}</p>
              
              <div className="w-full pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 uppercase tracking-wider font-bold text-[10px]">Joined</span>
                  <span className="text-gray-300 font-medium">{formatDate(user?.createdAt) || 'Recent'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 uppercase tracking-wider font-bold text-[10px]">Role</span>
                  <Badge className="bg-primary-500/20 text-primary-400 border-none">STUDENT</Badge>
                </div>
              </div>

              <Button 
                variant="ghost" 
                onClick={logout}
                className="w-full mt-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Right Column: Detailed Info */}
          <div className="md:col-span-2 space-y-6">
            <Card glass>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                    {isEditing ? (
                      <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      />
                    ) : (
                      <p className="text-white font-medium bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                        {user?.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <p className="text-gray-400 font-medium bg-white/5 px-4 py-3 rounded-xl border border-white/5 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {user?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Institution</label>
                  {isEditing ? (
                    <Input 
                      value={formData.institution} 
                      onChange={(e) => setFormData({...formData, institution: e.target.value})} 
                      icon={<BookOpen className="w-4 h-4" />}
                    />
                  ) : (
                    <p className="text-white font-medium bg-white/5 px-4 py-3 rounded-xl border border-white/5 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary-500" /> {user?.institution || 'Not set'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card glass>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-secondary-500" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

const Badge = ({ children, className }) => (
  <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider", className)}>
    {children}
  </span>
);

