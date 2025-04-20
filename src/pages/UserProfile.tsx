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

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(userId)

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
                      src={user.avatar || `https://avatar.vercel.sh/${user.id}`} 
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-2xl font-bold font-serif">{user.name}</h2>
                  <p className="text-gray-500 mb-4">Member since {user.joinDate}</p>
                  
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
                          {user.totalScore?.toFixed(1) || '0.0'}
                        </div>
                        <div className="text-gray-500 text-sm">Total Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-story-purple">
                          {user.contributionsCount || 0}
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
            <Tabs defaultValue="stories" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="stories">Stories</TabsTrigger>
                <TabsTrigger value="scores">Performance</TabsTrigger>
                <TabsTrigger value="history">Score History</TabsTrigger>
              </TabsList>
              
              {/* Stories Tab */}
              <TabsContent value="stories" className="mt-0">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h3 className="font-serif font-bold text-lg mb-4 flex items-center">
                      <Book className="mr-2 h-5 w-5 text-story-purple" />
                      Stories I've Contributed To
                    </h3>
                    
                    <div className="space-y-4">
                      {user.stories?.length > 0 ? (
                        user.stories.map((story: any) => (
                          <div key={story.id} className="p-4 border rounded-md hover:border-story-purple/40 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-lg">{story.title}</h4>
                                <p className="text-sm text-gray-500">
                                  {story.genre} • {story.contributions} contribution{story.contributions > 1 ? 's' : ''}
                                </p>
                              </div>
                              <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                <span>{story.score?.toFixed(1) || '0.0'}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <span className="text-sm text-gray-500">
                                Last contributed {story.lastContribution || 'N/A'}
                              </span>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-story-purple border-story-purple/50 hover:bg-story-purple/5"
                                onClick={() => window.location.href = `/stories/${story.id}`}
                              >
                                Continue
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No stories contributed yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Scores Tab */}
              <TabsContent value="scores" className="mt-0">
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
                          {user.totalScore?.toFixed(1) || '0.0'}/30
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-story-purple h-2 rounded-full" 
                          style={{ width: `${((user.totalScore || 0) / 30) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-6">
                        Your overall score is <span className="font-medium text-story-purple">excellent</span>. You're in the top 15% of all writers on StorySync.
                      </div>
                      
                      <div className="space-y-4">
                        {user.scores?.length > 0 ? (
                          user.scores.map((score: any, index: number) => (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">{score.category}</span>
                                <span className="text-sm font-bold">{score.score?.toFixed(1) || '0.0'}/10</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-story-purple h-2 rounded-full" 
                                  style={{ width: `${((score.score || 0) / 10) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No performance data available</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-2">Writing Feedback</h4>
                      <div className="text-sm text-gray-700">
                        <p className="mb-2">Your greatest strength is grammar and syntax accuracy. You consistently produce well-structured sentences with minimal errors.</p>
                        <p>To improve further, focus on enhancing creativity in your storytelling. Try experimenting with more vivid descriptions and unique plot developments.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Score History Tab */}
              <TabsContent value="history" className="mt-0">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h3 className="font-serif font-bold text-lg mb-4 flex items-center">
                      <Award className="mr-2 h-5 w-5 text-story-purple" />
                      Score History
                    </h3>
                    
                    <div className="overflow-x-auto">
                      {user.scoreHistory?.length > 0 ? (
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-4">Date</th>
                              <th className="text-left py-2 px-4">Story</th>
                              <th className="text-left py-2 px-4">Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {user.scoreHistory.map((entry: any) => (
                              <tr key={entry.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                <td className="py-3 px-4">{entry.date || 'N/A'}</td>
                                <td className="py-3 px-4">{entry.story || 'N/A'}</td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                    <span>{entry.score?.toFixed(1) || '0.0'}</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-gray-500 text-sm">No score history available</p>
                      )}
                    </div>
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
