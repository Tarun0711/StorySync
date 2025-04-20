import { useState } from 'react';
import { useParams } from 'react-router-dom';
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

// Mock data for the story
const STORY = {
  id: 1,
  title: "The Portal to Valtor",
  genre: "Fantasy",
  contributors: [
    { id: 1, name: "Sneha", avatar: "", score: 28.5 },
    { id: 2, name: "Rahul", avatar: "", score: 18.5 },
  ],
  paragraphs: [
    {
      id: 1,
      content: "It was an ordinary day until Aanya found a shimmering blue portal behind her bookshelf.",
      authorId: 0,
      authorName: "Admin",
      createdAt: "2025-03-15",
      score: null,
      feedback: null,
    },
    {
      id: 2,
      content: "Curiosity took over, and she stepped through it, landing in a world lit by twin suns and floating islands made of crystal.",
      authorId: 1,
      authorName: "Sneha",
      createdAt: "2025-03-16",
      score: 28.5,
      feedback: "Beautiful continuation. Strong imagery and perfect narrative flow.",
    },
    {
      id: 3,
      content: "Aanya walked around and saw many people. She was confused and asked someone what place this is.",
      authorId: 2,
      authorName: "Rahul",
      createdAt: "2025-03-17",
      score: 18.5,
      feedback: "Try to describe the setting more vividly. Instead of saying 'many people', describe them. Great effort though!",
    },
  ],
  leaderboard: [
    { id: 1, name: "Sneha", score: 28.5, contributions: 1 },
    { id: 2, name: "Rahul", score: 18.5, contributions: 1 },
  ]
};

const StoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [newContribution, setNewContribution] = useState('');
  const [showFeedback, setShowFeedback] = useState<number | null>(null);
  const [isSubmittingContribution, setIsSubmittingContribution] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<any | null>(null);
  
  // Function to toggle the feedback visibility
  const toggleFeedback = (paragraphId: number) => {
    if (showFeedback === paragraphId) {
      setShowFeedback(null);
    } else {
      setShowFeedback(paragraphId);
    }
  };
  
  // Mock function to simulate submitting a contribution and getting AI feedback
  const submitContribution = () => {
    if (!newContribution.trim()) return;
    
    setIsSubmittingContribution(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Mock AI evaluation results
      const mockEvaluation = {
        relevance: 7.5,
        grammar: 8.0,
        creativity: 7.0,
        totalScore: 22.5,
        feedback: "Good continuation of the story. Consider adding more descriptive elements to enhance the imagery. Your narrative flows well with the previous paragraphs."
      };
      
      setAiEvaluation(mockEvaluation);
      setIsSubmittingContribution(false);
    }, 2000);
  };
  
  // Function to accept the AI evaluation and add contribution
  const acceptEvaluation = () => {
    // In a real app, this would save to database
    setAiEvaluation(null);
    setNewContribution('');
    // Would update the story with the new paragraph
  };
  
  // Function to cancel the contribution
  const cancelContribution = () => {
    setAiEvaluation(null);
    setNewContribution('');
  };

  return (
    <MainLayout>
      <div className="container px-4 mx-auto max-w-4xl py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold font-serif">{STORY.title}</h1>
                <span className="px-2 py-1 bg-story-purple/10 text-story-purple text-xs rounded-full">
                  {STORY.genre}
                </span>
              </div>
              <p className="text-gray-500 mt-1">{STORY.paragraphs.length} paragraphs • {STORY.contributors.length} contributors</p>
            </div>
            
            <Button className="bg-story-purple text-white hover:bg-story-purple/90">
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
                  {STORY.paragraphs.map((paragraph, index) => (
                    <div key={paragraph.id} className="space-y-2">
                      <div className="flex items-start gap-4">
                        <div className="pt-1">
                          <AuthorDropdown author={{
                            id: paragraph.authorId,
                            name: paragraph.authorName,
                            avatar: "",
                            score: paragraph.score,
                            contributions: 1, 
                            feedback: paragraph.feedback,
                            awards: 0
                          }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{paragraph.authorName}</span>
                              <span className="text-gray-500 text-sm ml-2">{paragraph.createdAt}</span>
                            </div>
                            {paragraph.score !== null && (
                              <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                <span>{paragraph.score.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          <p className="mt-2 text-gray-800">{paragraph.content}</p>
                          
                          {paragraph.feedback !== null && (
                            <div className="mt-2">
                              <button
                                onClick={() => toggleFeedback(paragraph.id)}
                                className="flex items-center text-sm text-story-purple hover:text-story-purple/80"
                              >
                                {showFeedback === paragraph.id ? (
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
                              
                              {showFeedback === paragraph.id && (
                                <div className="mt-2 p-3 bg-story-purple/5 rounded-md text-sm">
                                  <p className="text-gray-700">{paragraph.feedback}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add new contribution */}
                <div className="border-t p-6 bg-gray-50">
                  {!aiEvaluation ? (
                    <div>
                      <h3 className="font-serif font-bold text-lg mb-3">Add your contribution</h3>
                      <div className="mb-4">
                        <RichTextEditor
                          value={newContribution}
                          onChange={setNewContribution}
                          placeholder="Continue the story..."
                          className="min-h-[200px]"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          onClick={submitContribution}
                          disabled={isSubmittingContribution || !newContribution.trim()}
                          className="bg-story-purple text-white hover:bg-story-purple/90"
                        >
                          {isSubmittingContribution ? 'Analyzing...' : 'Submit for Evaluation'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <h3 className="font-serif font-bold text-lg mb-3">AI Evaluation Results</h3>
                      <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-story-purple">{aiEvaluation.relevance.toFixed(1)}/10</div>
                            <div className="text-sm text-gray-500">Relevance</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-story-purple">{aiEvaluation.grammar.toFixed(1)}/10</div>
                            <div className="text-sm text-gray-500">Grammar</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-story-purple">{aiEvaluation.creativity.toFixed(1)}/10</div>
                            <div className="text-sm text-gray-500">Creativity</div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Total Score</span>
                            <span className="text-sm font-bold">{aiEvaluation.totalScore.toFixed(1)}/30</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-story-purple h-2 rounded-full" 
                              style={{ width: `${(aiEvaluation.totalScore / 30) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-md">
                          <h4 className="text-sm font-medium mb-1">Feedback:</h4>
                          <p className="text-sm text-gray-700">{aiEvaluation.feedback}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3">
                        <Button 
                          variant="outline" 
                          onClick={cancelContribution}
                          className="border-red-500 text-red-500 hover:bg-red-50"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button 
                          onClick={acceptEvaluation}
                          className="bg-story-purple text-white hover:bg-story-purple/90"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Accept & Add Contribution
                        </Button>
                      </div>
                    </div>
                  )}
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
                  {STORY.contributors.map((contributor) => (
                    <div key={contributor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-3">
                        <AuthorDropdown author={{
                          id: contributor.id,
                          name: contributor.name,
                          avatar: "",
                          score: contributor.score,
                          contributions: 1,
                          feedback: '0',
                          awards: 0
                        }} />
                        <div>
                          <div className="font-medium">{contributor.name}</div> 
                          <div className="text-sm text-gray-500">1 paragraph</div>
                        </div>
                      </div>
                      <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span>{contributor.score.toFixed(1)}</span>
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
                        <th className="text-left py-2 px-4">Avg. Score</th>
                        <th className="text-left py-2 px-4">Total Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STORY.leaderboard.map((entry, index) => (
                        <tr key={entry.id} className="border-b last:border-b-0 hover:bg-gray-50">
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
                                id: entry.id,
                                name: entry.name,
                                avatar: "",
                                score: entry.score,
                                contributions: entry.contributions,
                                feedback: '0',
                                awards: 0
                              }} />
                            </div>
                          </td>
                          <td className="py-3 px-4">{entry.contributions}</td>
                          <td className="py-3 px-4">{entry.score.toFixed(1)}</td>
                          <td className="py-3 px-4">{entry.score.toFixed(1)}</td>
                        </tr>
                      ))}
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
