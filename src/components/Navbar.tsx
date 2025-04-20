import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Book, User, Award, Menu, X, BellDot } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {  logoutUser } from '@/store/slices/authThunk';
import { fetchUserProfile } from '@/store/slices/userSlice';
import type { RootState } from '@/store';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotifications] = useState(true);
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
  const { profile, loading } = useAppSelector((state: RootState) => state.user);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate =useNavigate()
  
  const handleLogin = () => {
    navigate('/login')
    // dispatch(login('test@example.com', 'password')); // Replace with actual credentials
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Book className="h-8 w-8 text-story-purple" />
                <span className="ml-2 text-xl font-serif font-bold text-story-purple">StorySync</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/stories" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-story-purple"
              >
                Browse Stories
              </Link>
              <Link 
                to="/leaderboard" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-story-purple"
              >
                Leaderboard
              </Link>
            </div>
          </div>
          
          {/* Desktop User Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <BellDot className="h-5 w-5 text-gray-600" />
                      {hasNotifications && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">Notifications</h4>
                      <div className="text-sm text-gray-500">
                        New contributions to your stories will appear here
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Link 
                  to={`/profile/${user?.id}`} 
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-story-purple"
                >
                  <User className="h-5 w-5 mr-1" />
                  <span>{profile?.name || 'Profile'}</span>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-story-purple text-story-purple hover:bg-story-purple hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleLogin}
                  className="border-story-purple text-story-purple hover:bg-story-purple hover:text-white"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="bg-story-purple text-white hover:bg-story-purple/90"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-story-purple"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/stories"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-story-purple"
              onClick={toggleMenu}
            >
              Browse Stories
            </Link>
            <Link
              to="/leaderboard"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-story-purple"
              onClick={toggleMenu}
            >
              Leaderboard
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to={`/profile/${user?.id}`}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-story-purple"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-story-purple"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-4 py-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleLogin();
                    toggleMenu();
                  }}
                  className="border-story-purple text-story-purple hover:bg-story-purple hover:text-white"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="bg-story-purple text-white hover:bg-story-purple/90"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
