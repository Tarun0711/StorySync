import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/RIchTextEditor';
import 'react-quill/dist/quill.snow.css';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Edit, 
  User, 
  MessageSquare, 
  Award, 
  ChevronDown, 
  ChevronUp,
  Star,
  Check,
  X
} from 'lucide-react';
import { AuthorDropdown } from '@/components/AuthorDropdown';
import AddContribution from './AddContribution';
import { storyService } from '@/services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Story {
  _id: string;
  title: string;
  genre: string;
  prompt: string;
  isPrivate: boolean;
  contributors: Array<{
    _id: string;
    name: string;
    email: string;
    username?: string;
    profilePicture: string;
  }>;
  owner: {
    _id: string;
    name: string;
    email: string;
    profilePicture: string;
  };
  contributions: Array<{
    _id: string;
    content: string;
    author: {
      _id: string;
      name: string;
      email: string;
      profilePicture: string;
    };
    status: string;
    evaluation?: {
      relevance: number;
      grammar: number;
      creativity: number;
      totalScore: number;
      feedback: string;
    };
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface Author {
  id: string;
  name: string;
  avatar: string;
  score: number;
  contributions: number;
  feedback: string;
  awards: number;
}

const StoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState<number | null>(null);
 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        if (!id) return;
        const data = await storyService.getStory(id);
        setStory(data);
      } catch (error) {
        console.error('Error fetching story:', error);
        toast.error('Failed to fetch story. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);
  
  // Function to toggle the feedback visibility
  const toggleFeedback = (paragraphId: number) => {
    if (showFeedback === paragraphId) {
      setShowFeedback(null);
    } else {
      setShowFeedback(paragraphId);
    }
  };
  
 

  if (loading) {
    return (
      <MainLayout>
        <div className="container px-4 mx-auto max-w-4xl py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-story-purple"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!story) {
    return (
      <MainLayout>
        <div className="container px-4 mx-auto max-w-4xl py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Story Not Found</h2>
            <Button asChild variant="outline" className="border-story-purple text-story-purple hover:bg-story-purple/5">
              <Link to="/stories">Back to Stories</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container px-4 mx-auto max-w-4xl py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold font-serif">{story.title}</h1>
                <span className="px-2 py-1 bg-story-purple/10 text-story-purple text-xs rounded-full">
                  {story.genre}
                </span>
              </div>
              <p className="text-gray-500 mt-1">{story.contributions.length} paragraphs • {story.contributors.length} contributors</p>
            </div>
            
            <Button onClick={() => navigate(`/stories/${id}/contribute`)} className="bg-story-purple text-white hover:bg-story-purple/90">
              <Edit className="mr-2 h-4 w-4" />
              Contribute
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="story" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="story">Story</TabsTrigger>
            <TabsTrigger value="contributors">Contributors</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          {/* Story Tab */}
          <TabsContent value="story" className="mt-0">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="story-content p-6 space-y-6">
                  {story.contributions.map((contribution, index) => (
                    <div key={contribution._id} className="space-y-2">
                      <div className="flex items-start gap-4">
                        <div className="pt-1">
                          <AuthorDropdown author={{
                            id: parseInt(contribution.author._id),
                            name: contribution.author.name,
                            avatar: contribution.author.profilePicture,
                            score: contribution.evaluation?.totalScore || 0,
                            contributions: 1,
                            feedback: contribution.evaluation?.feedback || null,
                            awards: 0
                          }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{contribution.author.name}</span>
                              <span className="text-gray-500 text-sm ml-2">
                                {new Date(contribution.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {contribution.evaluation?.totalScore !== undefined && (
                              <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                <span>{contribution.evaluation.totalScore.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          <p className="mt-2 text-gray-800">{contribution.content}</p>
                          
                          {contribution.evaluation?.feedback && (
                            <div className="mt-2">
                              <button
                                onClick={() => toggleFeedback(index)}
                                className="flex items-center text-sm text-story-purple hover:text-story-purple/80"
                              >
                                {showFeedback === index ? (
                                  <>
                                    <ChevronUp className="h-4 w-4 mr-1" />
                                    Hide AI Feedback
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                    Show AI Feedback
                                  </>
                                )}
                              </button>
                              
                              {showFeedback === index && (
                                <div className="mt-2 p-3 bg-story-purple/5 rounded-md text-sm">
                                  <p className="text-gray-700">{contribution.evaluation.feedback}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Contributors Tab */}
          <TabsContent value="contributors" className="mt-0">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-serif font-bold text-lg mb-4">Contributors</h3>
                <div className="space-y-4">
                  {story.contributors.map((contributor) => (
                    <div key={contributor._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-3">
                        <AuthorDropdown author={{
                          id: parseInt(contributor._id),
                          name: contributor.name,
                          avatar: contributor.profilePicture,
                          score: 0,
                          contributions: 1,
                          feedback: null,
                          awards: 0
                        }} />
                        <div>
                          <div className="font-medium">{contributor.name}</div> 
                          <div className="text-sm text-gray-500">1 paragraph</div>
                        </div>
                      </div>
                      <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span>0.0</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="mt-0">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-serif font-bold text-lg mb-4">Story Leaderboard</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Rank</th>
                        <th className="text-left py-2 px-4">Writer</th>
                        <th className="text-left py-2 px-4">Contributions</th>
                        <th className="text-left py-2 px-4">Relevance</th>
                        <th className="text-left py-2 px-4">Grammar</th>
                        <th className="text-left py-2 px-4">Creativity</th>
                        <th className="text-left py-2 px-4">Total Score</th>
                        <th className="text-left py-2 px-4">Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {story.contributions.map((contribution, index) => {
                        const evaluation = contribution.evaluation;
                        return (
                          <tr key={contribution._id} className="border-b last:border-b-0 hover:bg-gray-50">
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
                                <AuthorDropdown author={{
                                  id: parseInt(contribution.author._id),
                                  name: contribution.author.name,
                                  avatar: contribution.author.profilePicture,
                                  score: evaluation?.totalScore || 0,
                                  contributions: 1,
                                  feedback: evaluation?.feedback || null,
                                  awards: 0
                                }} />
                              </div>
                            </td>
                            <td className="py-3 px-4">1</td>
                            <td className="py-3 px-4">{evaluation?.relevance?.toFixed(1) || '0.0'}</td>
                            <td className="py-3 px-4">{evaluation?.grammar?.toFixed(1) || '0.0'}</td>
                            <td className="py-3 px-4">{evaluation?.creativity?.toFixed(1) || '0.0'}</td>
                            <td className="py-3 px-4">{evaluation?.totalScore?.toFixed(1) || '0.0'}</td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => toggleFeedback(index)}
                                className="flex items-center text-sm text-story-purple hover:text-story-purple/80"
                              >
                                {showFeedback === index ? (
                                  <>
                                    <ChevronUp className="h-4 w-4 mr-1" />
                                    Hide Feedback
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                    Show Feedback
                                  </>
                                )}
                              </button>
                              {showFeedback === index && evaluation?.feedback && (
                                <div className="mt-2 p-3 bg-story-purple/5 rounded-md text-sm">
                                  <p className="text-gray-700">{evaluation.feedback}</p>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default StoryDetail;
