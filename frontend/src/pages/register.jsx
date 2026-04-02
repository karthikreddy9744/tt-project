import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Loader2, BookOpen } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { showToast } from '../components/ui/Toast';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
  });
  const { register, loading } = useAppStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast.error('Passwords do not match');
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      institution: formData.institution,
    });

    if (result.success) {
      showToast.success('Registration successful! You can now sign in.');
      navigate('/login');
    } else {
      showToast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-secondary-500/10 rounded-full blur-[100px] animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-dark border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join the community of collaborative learners</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              icon={<User className="w-4 h-4 text-gray-400" />}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@university.edu"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail className="w-4 h-4 text-gray-400" />}
              required
            />
            <Input
              label="Institution"
              name="institution"
              type="text"
              placeholder="University Name"
              value={formData.institution}
              onChange={handleChange}
              icon={<BookOpen className="w-4 h-4 text-gray-400" />}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock className="w-4 h-4 text-gray-400" />}
              required
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<Lock className="w-4 h-4 text-gray-400" />}
              required
            />

            <Button
              type="submit"
              className="w-full h-12 text-lg mt-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
