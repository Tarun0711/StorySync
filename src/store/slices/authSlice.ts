import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/services/api';
import { AppDispatch } from '@/store'; // make sure this is defined in your Redux store
import { clearAuthFromStorage, getStoredUser, saveAuthToStorage } from '../../utils/storage';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('token'),
  user: getStoredUser(),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      saveAuthToStorage(action.payload.token, action.payload.user);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      clearAuthFromStorage();
    },
  },
});

export const { setLoading, setError, setAuthenticated, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
