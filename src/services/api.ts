import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
 
  signup: async (name: string, username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, username, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const userService = {
  getProfile: async (userId?: string) => {
    const response = await api.get(`/user/profile/${userId}`);
    return response.data;
  },

  getUserByEmail: async (email: string) => {
    const response = await api.get(`/user/email/${email}`);
    return response.data;
  },

  updateProfile: async (data: { name?: string; bio?: string; profilePicture?: string }) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/user/change-password', { currentPassword, newPassword });
    return response.data;
  },
};

export const storyService = {
  createStory: async (data: {
    title: string;
    genre: string;
    prompt: string;
    isPrivate: boolean;
    contributors: string[];
  }) => {
    const response = await api.post('/stories', data);
    return response.data;
  },

  getStory: async (storyId: string) => {
    const response = await api.get(`/stories/${storyId}`);
    return response.data;
  },

  updateStory: async (storyId: string, data: {
    title?: string;
    genre?: string;
    prompt?: string;
    isPrivate?: boolean;
    contributors?: string[];
  }) => {
    const response = await api.put(`/stories/${storyId}`, data);
    return response.data;
  },

  deleteStory: async (storyId: string) => {
    const response = await api.delete(`/stories/${storyId}`);
    return response.data;
  },

  listStories: async () => {
    const response = await api.get('/stories');
    return response.data;
  },
};

export const contributionService = {
  analyzeContribution: async (contribution: string, previousContent?: string) => {
    const response = await api.post('/contributions/analyze', { contribution, previousContent });
    return response.data;
  },

  addContribution: async (storyId: string, payload: { content: string; evaluation: any }) => {
    const response = await api.post(`/contributions/stories/${storyId}/contributions`, payload);
    return response.data;
  }
};

export const adminService = {
  getContributions: async () => {
    const response = await api.get('/contributions');
    return response.data;
  },

  deleteContribution: async (contributionId: string) => {
    const response = await api.delete(`/contributions/${contributionId}`);
    return response.data;
  }
}; 