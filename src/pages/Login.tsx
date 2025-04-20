import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Book, LogIn } from 'lucide-react';
import { authService } from '@/services/api';
import { setAuthenticated } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch=useDispatch();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await authService.login(email, password);
      dispatch(setAuthenticated(true)); // ✅ Mark as authenticated

      navigate('/');

    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 text-center">
        <Link to="/" className="inline-flex items-center">
          <Book className="h-8 w-8 text-story-purple" />
          <span className="ml-2 text-2xl font-serif font-bold text-story-purple">StorySync</span>
        </Link>
      </div>
      
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold font-serif">Welcome Back</h1>
            <p className="text-gray-600 mt-1">Sign in to continue your writing journey</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-story-purple hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-story-purple text-white hover:bg-story-purple/90"
              disabled={isLoading}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-story-purple hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          By signing in, you agree to our{' '}
          <a href="#" className="text-story-purple hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-story-purple hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
