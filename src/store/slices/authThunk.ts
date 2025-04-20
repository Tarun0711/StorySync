import { AppDispatch } from '@/store';
import { authService } from '@/services/api';
import { loginSuccess, logout, setAuthenticated, setError, setLoading } from './authSlice';

const handleThunk = async (
  dispatch: AppDispatch,
  callback: () => Promise<void>
) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    await callback();
  } catch (error: any) {
    dispatch(setError(error.message || 'Something went wrong'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const login = (email: string, password: string) => async (dispatch: AppDispatch) =>
  handleThunk(dispatch, async () => {
    const response = await authService.login(email, password);
    dispatch(loginSuccess({ user: response.user, token: response.token }));
    dispatch(setAuthenticated(true));
    window.location.reload();

  });

export const signup = (name: string, username: string, email: string, password: string) => async (dispatch: AppDispatch) =>
  handleThunk(dispatch, async () => {
    const response = await authService.signup(name, username, email, password);
    dispatch(loginSuccess({ user: response.user, token: response.token }));
    dispatch(setAuthenticated(true));
    window.location.reload();
  });

export const logoutUser = () => async (dispatch: AppDispatch) =>
  handleThunk(dispatch, async () => {
    await authService.logout();
    dispatch(logout());
  });
