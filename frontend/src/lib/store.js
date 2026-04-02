import { create } from 'zustand';
import api from '../lib/api';
import { showToast } from '../components/ui/Toast';

export const useAppStore = create((set, get) => ({
  // Theme
  isDarkMode: true,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  // Sidebar
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Notifications
  notifications: [
    { id: 1, title: 'Welcome to StudyHub!', message: 'Join a group to start learning together.', read: false, createdAt: new Date() },
  ],
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  addNotification: (notification) => set((state) => ({
    notifications: [{ ...notification, id: Date.now(), read: false, createdAt: new Date() }, ...state.notifications]
  })),

  // Groups
  groups: [],
  myGroups: [],
  currentGroup: null,
  fetchGroups: async (query = '') => {
    try {
      const response = await api.get(`/groups?query=${query}`);
      set({ groups: response.data.content || response.data });
    } catch (error) {
      console.error('Fetch groups error:', error);
    }
  },
  fetchMyGroups: async () => {
    try {
      const response = await api.get('/groups/my');
      set({ myGroups: response.data });
    } catch (error) {
      console.error('Fetch my groups error:', error);
    }
  },
  fetchGroupDetails: async (id) => {
    try {
      const response = await api.get(`/groups/${id}`);
      set({ currentGroup: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch group details' };
    }
  },
  createGroup: async (groupData) => {
    try {
      const response = await api.post('/groups', groupData);
      get().fetchGroups();
      get().fetchMyGroups();
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create group' };
    }
  },
  joinGroup: async (id) => {
    try {
      await api.post(`/groups/${id}/join`);
      get().fetchGroups();
      get().fetchMyGroups();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to join group' };
    }
  },

  // Files
  fetchFiles: async (groupId, query = '', topic = '') => {
    try {
      const response = await api.get(`/groups/${groupId}/files?query=${query}&topic=${topic}`);
      set({ files: response.data.content || response.data });
    } catch (error) {
      console.error('Fetch files error:', error);
    }
  },
  uploadFile: async (groupId, formData) => {
    set({ loading: true });
    try {
      const response = await api.post(`/groups/${groupId}/files/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      get().fetchFiles(groupId);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Upload failed' };
    } finally {
      set({ loading: false });
    }
  },
  downloadFile: async (groupId, fileId, fileName) => {
    try {
      const response = await api.get(`/groups/${groupId}/files/${fileId}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Download failed' };
    }
  },
  voteFile: async (groupId, fileId, upvote) => {
    try {
      await api.post(`/groups/${groupId}/files/${fileId}/vote`, { upvote });
      get().fetchFiles(groupId);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Vote failed' };
    }
  },

  // Discussions
  fetchDiscussions: async (groupId, query = '', isSolved = null) => {
    try {
      let url = `/groups/${groupId}/discussions?query=${query}`;
      if (isSolved !== null) url += `&isSolved=${isSolved}`;
      const response = await api.get(url);
      set({ discussions: response.data.content || response.data });
    } catch (error) {
      console.error('Fetch discussions error:', error);
    }
  },
  createDiscussion: async (groupId, discussionData) => {
    try {
      await api.post(`/groups/${groupId}/discussions`, discussionData);
      get().fetchDiscussions(groupId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create discussion' };
    }
  },
  voteDiscussion: async (groupId, discussionId, upvote) => {
    try {
      await api.post(`/groups/${groupId}/discussions/${discussionId}/vote`, { upvote });
      get().fetchDiscussions(groupId);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Vote failed' };
    }
  },
  addReply: async (groupId, discussionId, content) => {
    try {
      await api.post(`/groups/${groupId}/discussions/${discussionId}/replies`, { content });
      get().fetchDiscussions(groupId);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Reply failed' };
    }
  },

  // Sessions
  fetchSessions: async (groupId) => {
    try {
      const response = await api.get(`/groups/${groupId}/sessions`);
      set({ sessions: response.data });
    } catch (error) {
      console.error('Fetch sessions error:', error);
    }
  },
  createSession: async (groupId, sessionData) => {
    try {
      await api.post(`/groups/${groupId}/sessions`, sessionData);
      get().fetchSessions(groupId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create session' };
    }
  },
  
  // User & Auth
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user, isAuthenticated: !!user });
  },
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({ token, isAuthenticated: !!token });
  },
  setLoading: (loading) => set({ loading }),

  login: async (credentials) => {
    set({ loading: true });
    try {
      const response = await api.post('/auth/login', credentials);
      // The response structure might be { token: '...', user: { ... } } or similar
      const { token, user } = response.data;
      
      // Safety check for response format
      const finalToken = token || response.data.accessToken;
      const finalUser = user || response.data;

      get().setToken(finalToken);
      get().setUser(finalUser);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    } finally {
      set({ loading: false });
    }
  },

  register: async (userData) => {
    set({ loading: true });
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Registration failed' 
      };
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    get().setToken(null);
    get().setUser(null);
    window.location.href = '/landing';
  },
  
  // Notifications
  notifications: [
    { id: 1, title: 'New message', message: 'You have a new message from Sarah', read: false, type: 'info' },
    { id: 2, title: 'Study group reminder', message: 'Math study group starts in 30 minutes', read: false, type: 'reminder' },
    { id: 3, title: 'File uploaded', message: 'Your notes have been uploaded', read: true, type: 'success' },
  ],
  
  addNotification: (notification) => set((state) => ({
    notifications: [{ ...notification, id: Date.now() }, ...state.notifications]
  })),
  
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  
  files: [],
  discussions: [],
  sessions: [],
  
  // Activity data for heatmap
  activityData: Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (364 - i));
    return {
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 10),
    };
  }),
}));
