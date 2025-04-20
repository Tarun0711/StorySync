import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userService } from '@/services/api';

export interface UserState {
  profile: {
    name: string;
    bio: string;
    profilePicture: string;
    stories: any[];
    contributions: any[];
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProfile: (state, action: PayloadAction<UserState['profile']>) => {
      state.profile = action.payload;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserState['profile']>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
});

export const { setLoading, setError, setProfile, updateProfile } = userSlice.actions;

// Thunk actions
export const fetchUserProfile = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    const profile = await userService.getProfile();
    dispatch(setProfile(profile));
  } catch (error: any) {
    dispatch(setError(error.message || 'Failed to fetch profile'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateUserProfile = (data: { name?: string; bio?: string; profilePicture?: string }) => 
  async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const updatedProfile = await userService.updateProfile(data);
      dispatch(updateProfile(updatedProfile));
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to update profile'));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const changePassword = (currentPassword: string, newPassword: string) => 
  async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await userService.changePassword(currentPassword, newPassword);
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to change password'));
    } finally {
      dispatch(setLoading(false));
    }
  };

export default userSlice.reducer; 