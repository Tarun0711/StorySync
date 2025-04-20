import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, Search, Trophy, Star, BarChart, Calendar, Book, Users } from 'lucide-react';
import { fetchAllStories, Story } from '@/utils/storyUtils';
import { toast } from 'sonner';

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadStories = async () => {
      try {
        const fetchedStories = await fetchAllStories();
        setStories(fetchedStories);
      } catch (error) {
        console.error('Error loading stories:', error);
        toast.error('Failed to load stories');
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);
  
  // Filter stories based on search term
  const filteredStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate global leaderboard from real data
  const globalLeaderboard = stories.reduce((acc: any[], story) => {
    story.contributors.forEach(contributor => {
      const existingContributor = acc.find(c => c._id === contributor._id);
      const contributions = story.contributions.filter(c => c.author._id === contributor._id);
      const totalScore = contributions.reduce((sum, c) => sum + (c.evaluation?.totalScore || 0), 0);
      
      if (existingContributor) {
        existingContributor.totalScore += totalScore;
        existingContributor.contributions += contributions.length;
        existingContributor.avgScore = existingContributor.totalScore / existingContributor.contributions;
      } else {
        acc.push({
          _id: contributor._id,
          name: contributor.name,
          avatar: contributor.profilePicture,
          totalScore,
          contributions: contributions.length,
          avgScore: contributions.length > 0 ? totalScore / contributions.length : 0
        });
      }
    });
    return acc;
  }, []).sort((a, b) => b.totalScore - a.totalScore);

  // Calculate monthly leaderboard (last 30 days)
  const monthlyLeaderboard = stories.reduce((acc: any[], story) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    story.contributors.forEach(contributor => {
      const contributions = story.contributions.filter(c => 
        c.author._id === contributor._id && 
        new Date(c.createdAt) >= thirtyDaysAgo
      );
      
      if (contributions.length > 0) {
        const totalScore = contributions.reduce((sum, c) => sum + (c.evaluation?.totalScore || 0), 0);
        const existingContributor = acc.find(c => c._id === contributor._id);
        
        if (existingContributor) {
          existingContributor.totalScore += totalScore;
          existingContributor.contributions += contributions.length;
          existingContributor.avgScore = existingContributor.totalScore / existingContributor.contributions;
        } else {
          acc.push({
            _id: contributor._id,
            name: contributor.name,
            avatar: contributor.profilePicture,
            totalScore,
            contributions: contributions.length,
            avgScore: totalScore / contributions.length
          });
        }
      }
    });
    return acc;
  }, []).sort((a, b) => b.totalScore - a.totalScore);

  // Filter leaderboards based on search term
  const filteredGlobalLeaderboard = globalLeaderboard.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredMonthlyLeaderboard = monthlyLeaderboard.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="container px-4 mx-auto max-w-6xl py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-story-purple"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container px-4 mx-auto max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif mb-2">Writer Leaderboards</h1>
          <p className="text-gray-600">Discover top contributors and their writing achievements.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Leaderboard */}
          <div className="md:w-2/3">
            <Tabs defaultValue="global" className="w-full">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <TabsList>
                  <TabsTrigger value="global">Global</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="stories">Stories</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-10 w-full md:w-64"
                      placeholder="Search writers or stories"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Global Leaderboard Tab */}
              <TabsContent value="global" className="mt-0">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-serif font-bold text-lg">All-Time Leaders</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Rank</th>
                            <th className="text-left py-2 px-4">Writer</th>
                            <th className="text-left py-2 px-4 hidden sm:table-cell">Contributions</th>
                            <th className="text-left py-2 px-4">Avg. Score</th>
                            <th className="text-left py-2 px-4">Total Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredGlobalLeaderboard.map((user, index) => (
                            <tr key={user._id} className="border-b last:border-b-0 hover:bg-gray-50">
                              <td className="py-3 px-4">
                                {index === 0 ? (
                                  <div className="inline-flex items-center justify-center w-6 h-6 bg-yellow-400 text-white rounded-full text-xs font-bold">1</div>
                                ) : index === 1 ? (
                                  <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-300 text-white rounded-full text-xs font-bold">2</div>
                                ) : index === 2 ? (
                                  <div className="inline-flex items-center justify-center w-6 h-6 bg-amber-600 text-white rounded-full text-xs font-bold">3</div>
                                ) : (
                                  <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{index + 1}</div>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <span>{user.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 hidden sm:table-cell">{user.contributions}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                  <span>{user.avgScore.toFixed(1)}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-medium">{user.totalScore.toFixed(1)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {filteredGlobalLeaderboard.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No writers found matching your search.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Monthly Leaderboard Tab */}
              <TabsContent value="monthly" className="mt-0">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-story-purple" />
                      <h3 className="font-serif font-bold text-lg">Monthly Leaders</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Rank</th>
                            <th className="text-left py-2 px-4">Writer</th>
                            <th className="text-left py-2 px-4 hidden sm:table-cell">Contributions</th>
                            <th className="text-left py-2 px-4">Avg. Score</th>
                            <th className="text-left py-2 px-4">Total Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMonthlyLeaderboard.map((user, index) => (
                            <tr key={user._id} className="border-b last:border-b-0 hover:bg-gray-50">
                              <td className="py-3 px-4">
                                {index === 0 ? (
                                  <div className="inline-flex items-center justify-center w-6 h-6 bg-yellow-400 text-white rounded-full text-xs font-bold">1</div>
                                ) : index === 1 ? (
                                  <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-300 text-white rounded-full text-xs font-bold">2</div>
                                ) : index === 2 ? (
                                  <div className="inline-flex items-center justify-center w-6 h-6 bg-amber-600 text-white rounded-full text-xs font-bold">3</div>
                                ) : (
                                  <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{index + 1}</div>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <span>{user.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 hidden sm:table-cell">{user.contributions}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                  <span>{user.avgScore.toFixed(1)}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-medium">{user.totalScore.toFixed(1)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {filteredMonthlyLeaderboard.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No writers found matching your search.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Stories Tab */}
              <TabsContent value="stories" className="mt-0">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Book className="h-5 w-5 text-story-purple" />
                      <h3 className="font-serif font-bold text-lg">All Stories</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {filteredStories.map((story) => (
                        <div key={story._id} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-medium">{story.title}</h4>
                            <span className="px-2 py-1 bg-story-purple/10 text-story-purple text-xs rounded-full">
                              {story.genre}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{story.contributors.length} contributors</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1" />
                              <span>
                                {story.contributions.reduce((acc, curr) => 
                                  acc + (curr.evaluation?.totalScore || 0), 0
                                ).toFixed(1)} total score
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Updated {new Date(story.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {filteredStories.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No stories found matching your search.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="md:w-1/3">
            <Card className="border-0 shadow-md mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart className="h-5 w-5 text-story-purple" />
                  <h3 className="font-serif font-bold text-lg">StorySync Stats</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="text-gray-600">Total Writers</div>
                    <div className="font-medium">{new Set(stories.flatMap(s => s.contributors.map(c => c._id))).size}</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="text-gray-600">Total Stories</div>
                    <div className="font-medium">{stories.length}</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="text-gray-600">Total Contributions</div>
                    <div className="font-medium">{stories.reduce((acc, story) => acc + story.contributions.length, 0)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="text-gray-600">Average Score</div>
                    <div className="font-medium flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span>
                        {(
                          stories.reduce((acc, story) => 
                            acc + story.contributions.reduce((sum, c) => 
                              sum + (c.evaluation?.totalScore || 0), 0
                            ), 0
                          ) / stories.reduce((acc, story) => 
                            acc + story.contributions.length, 0
                          ) || 0
                        ).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Leaderboard;
