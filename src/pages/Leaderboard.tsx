
import { useState } from 'react';
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
import { Award, Search, Trophy, Star, BarChart, Calendar } from 'lucide-react';

// Mock data for leaderboard
const GLOBAL_LEADERBOARD = [
  { id: 1, name: "Sneha", avatar: "", totalScore: 87.5, contributions: 4, avgScore: 21.9 },
  { id: 2, name: "Rahul", avatar: "", totalScore: 78.2, contributions: 5, avgScore: 15.6 },
  { id: 3, name: "Priya", avatar: "", totalScore: 76.5, contributions: 3, avgScore: 25.5 },
  { id: 4, name: "Vikram", avatar: "", totalScore: 74.8, contributions: 6, avgScore: 12.5 },
  { id: 5, name: "Ananya", avatar: "", totalScore: 71.3, contributions: 4, avgScore: 17.8 },
  { id: 6, name: "Rohan", avatar: "", totalScore: 68.9, contributions: 3, avgScore: 23.0 },
  { id: 7, name: "Neha", avatar: "", totalScore: 67.2, contributions: 5, avgScore: 13.4 },
  { id: 8, name: "Arjun", avatar: "", totalScore: 64.5, contributions: 3, avgScore: 21.5 },
  { id: 9, name: "Meera", avatar: "", totalScore: 62.8, contributions: 4, avgScore: 15.7 },
  { id: 10, name: "Karan", avatar: "", totalScore: 60.1, contributions: 3, avgScore: 20.0 },
];

// Mock data for top stories
const TOP_STORIES = [
  { id: 1, title: "The Portal to Valtor", genre: "Fantasy", contributors: 8, avgScore: 24.3 },
  { id: 2, title: "Neon Nights", genre: "Cyberpunk", contributors: 7, avgScore: 23.8 },
  { id: 3, title: "The Last Starfighter", genre: "Sci-Fi", contributors: 12, avgScore: 22.5 },
  { id: 4, title: "Whispers in the Dark", genre: "Mystery", contributors: 6, avgScore: 21.9 },
  { id: 5, title: "Hearts Under the Cherry Trees", genre: "Romance", contributors: 10, avgScore: 21.6 },
];

// Mock data for monthly leaderboard
const MONTHLY_LEADERBOARD = [
  { id: 3, name: "Priya", avatar: "", totalScore: 56.5, contributions: 2, avgScore: 28.3 },
  { id: 1, name: "Sneha", avatar: "", totalScore: 53.5, contributions: 2, avgScore: 26.8 },
  { id: 6, name: "Rohan", avatar: "", totalScore: 48.5, contributions: 2, avgScore: 24.3 },
  { id: 8, name: "Arjun", avatar: "", totalScore: 45.2, contributions: 2, avgScore: 22.6 },
  { id: 2, name: "Rahul", avatar: "", totalScore: 42.8, contributions: 3, avgScore: 14.3 },
];

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all-time');
  
  // Filter leaderboard based on search term
  const filteredGlobalLeaderboard = GLOBAL_LEADERBOARD.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredMonthlyLeaderboard = MONTHLY_LEADERBOARD.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-10 w-full md:w-64"
                      placeholder="Search writers"
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
                            <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
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
                                    <AvatarImage src={`https://avatar.vercel.sh/${user.id}`} />
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
                      <h3 className="font-serif font-bold text-lg">April 2025 Leaders</h3>
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
                            <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
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
                                    <AvatarImage src={`https://avatar.vercel.sh/${user.id}`} />
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
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="md:w-1/3">
            {/* Top Stories Section */}
            <Card className="border-0 shadow-md mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart className="h-5 w-5 text-story-purple" />
                  <h3 className="font-serif font-bold text-lg">Top-Rated Stories</h3>
                </div>
                
                <div className="space-y-4">
                  {TOP_STORIES.map((story, index) => (
                    <div key={story.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                      <div className="flex items-start gap-2">
                        <div className="font-medium text-xl text-gray-400 w-6 text-center">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{story.title}</div>
                          <div className="text-sm text-gray-500">{story.genre} • {story.contributors} contributors</div>
                        </div>
                      </div>
                      <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span>{story.avgScore.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Stats Card */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-story-purple" />
                  <h3 className="font-serif font-bold text-lg">StorySync Stats</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="text-gray-600">Total Writers</div>
                    <div className="font-medium">374</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="text-gray-600">Total Stories</div>
                    <div className="font-medium">128</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="text-gray-600">Total Contributions</div>
                    <div className="font-medium">1,547</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="text-gray-600">Average Score</div>
                    <div className="font-medium flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span>19.3</span>
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
