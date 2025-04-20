import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Book, Star, Award, Edit, BadgeCheck } from 'lucide-react';
import { userService } from '@/services/api';
import { toast } from 'sonner';

interface Contribution {
  _id: string;
  content: string;
  author: string;
  story: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  evaluation?: {
    relevance: number;
    grammar: number;
    creativity: number;
    totalScore: number;
    feedback: string;
  };
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
  stories: any[];
  contributions: Contribution[];
  points: number;
  badges: any[];
  createdAt: string;
  updatedAt: string;
}

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await userService.getProfile(userId);
        setUser(userData);
        setError(null);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to load user profile';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const handleUpdateProfile = async (data: { name?: string; bio?: string; profilePicture?: string }) => {
    try {
      const updatedUser = await userService.updateProfile(data);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await userService.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to change password';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container px-4 mx-auto max-w-6xl py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-story-purple"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container px-4 mx-auto max-w-6xl py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="container px-4 mx-auto max-w-6xl py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-yellow-600">No user data available</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container px-4 mx-auto max-w-6xl py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with user info */}
          <div className="md:w-1/3">
            <Card className="border-0 shadow-md mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage 
                      src={user.profilePicture || `https://avatar.vercel.sh/${user._id}`} 
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-2xl font-bold font-serif">{user.name}</h2>
                  <p className="text-gray-500 mb-4">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-story-purple text-story-purple hover:bg-story-purple/5 mb-4"
                    onClick={() => {
                      // TODO: Implement edit profile modal
                      toast.info('Edit profile feature coming soon!');
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  
                  <div className="w-full space-y-4">
                    <div>
                      <p className="text-gray-600 text-sm">{user.bio || 'No bio available'}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-story-purple">
                          {user.points || 0}
                        </div>
                        <div className="text-gray-500 text-sm">Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-story-purple">
                          {user.contributions?.length || 0}
                        </div>
                        <div className="text-gray-500 text-sm">Contributions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-serif font-bold text-lg mb-4 flex items-center">
                  <Award className="mr-2 h-5 w-5 text-story-purple" />
                  Writing Badges
                </h3>
                
                <div className="space-y-4">
                  {user.badges?.length > 0 ? (
                    user.badges.map((badge: any) => (
                      <div key={badge.id} className="flex items-start gap-3 p-3 bg-story-purple/5 rounded-md">
                        <div className="pt-1">
                          <BadgeCheck className="h-5 w-5 text-story-purple" />
                        </div>
                        <div>
                          <h4 className="font-medium">{badge.name}</h4>
                          <p className="text-sm text-gray-600">{badge.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No badges earned yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="md:w-2/3">
            <Tabs defaultValue="contributions" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="contributions">Contributions</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              {/* Contributions Tab */}
              <TabsContent value="contributions" className="mt-0">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h3 className="font-serif font-bold text-lg mb-4 flex items-center">
                      <Book className="mr-2 h-5 w-5 text-story-purple" />
                      My Contributions
                    </h3>
                    
                    <div className="space-y-4">
                      {user.contributions?.length > 0 ? (
                        user.contributions.map((contribution: Contribution) => (
                          <div key={contribution._id} className="p-4 border rounded-md hover:border-story-purple/40 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <div 
                                  className="prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{ __html: contribution.content }}
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                  Status: <span className={`font-medium ${contribution.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                                    {contribution.status}
                                  </span>
                                </p>
                              </div>
                              {contribution.evaluation && (
                                <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                  <span>{contribution.evaluation.totalScore.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <span className="text-sm text-gray-500">
                                Contributed on {new Date(contribution.createdAt).toLocaleDateString()}
                              </span>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-story-purple border-story-purple/50 hover:bg-story-purple/5"
                                onClick={() => window.location.href = `/stories/${contribution.story}`}
                              >
                                View Story
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No contributions yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Performance Tab */}
              <TabsContent value="performance" className="mt-0">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h3 className="font-serif font-bold text-lg mb-4 flex items-center">
                      <Star className="mr-2 h-5 w-5 text-story-purple" />
                      Writing Performance
                    </h3>
                    
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Overall Score</span>
                        <span className="text-sm font-bold">
                          {user.contributions?.reduce((acc, curr) => acc + (curr.evaluation?.totalScore || 0), 0) / (user.contributions?.length || 1) || 0}/30
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-story-purple h-2 rounded-full" 
                          style={{ 
                            width: `${((user.contributions?.reduce((acc, curr) => acc + (curr.evaluation?.totalScore || 0), 0) / (user.contributions?.length || 1) || 0) / 30) * 100}%` 
                          }}
                        ></div>
                      </div>
                      
                      <div className="space-y-4">
                        {user.contributions?.length > 0 && user.contributions[0].evaluation ? (
                          Object.entries(user.contributions[0].evaluation)
                            .filter(([key]) => key !== 'totalScore' && key !== 'feedback')
                            .map(([category, score]) => (
                              <div key={category}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium capitalize">{category}</span>
                                  <span className="text-sm font-bold">{score}/10</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-story-purple h-2 rounded-full" 
                                    style={{ width: `${(score as number / 10) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))
                        ) : (
                          <p className="text-gray-500 text-sm">No performance data available</p>
                        )}
                      </div>
                    </div>
                    
                    {user.contributions?.length > 0 && user.contributions[0].evaluation?.feedback && (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Recent Feedback</h4>
                        <div className="text-sm text-gray-700">
                          <p>{user.contributions[0].evaluation.feedback}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfile;
