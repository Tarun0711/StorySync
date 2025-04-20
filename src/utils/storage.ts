export const saveAuthToStorage = (token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  export const clearAuthFromStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
  export const getStoredUser = () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  };
  