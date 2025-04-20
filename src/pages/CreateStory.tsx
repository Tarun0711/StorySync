import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/RIchTextEditor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Book, Plus, Minus } from 'lucide-react';

const CreateStory = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [contributors, setContributors] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const addContributor = () => {
    setContributors([...contributors, '']);
  };
  
  const removeContributor = (index: number) => {
    const newContributors = [...contributors];
    newContributors.splice(index, 1);
    setContributors(newContributors);
  };
  
  const updateContributor = (index: number, value: string) => {
    const newContributors = [...contributors];
    newContributors[index] = value;
    setContributors(newContributors);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate creating a story
    setTimeout(() => {
      // In a real app, this would be an API call
      setIsSubmitting(false);
      navigate('/stories/1'); // Navigate to the newly created story
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="container px-4 mx-auto max-w-3xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif mb-2">Create a New Story</h1>
          <p className="text-gray-600">Start a collaborative story and invite others to contribute.</p>
        </div>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Story Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Story Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a captivating title"
                    required
                  />
                </div>
                
                {/* Genre */}
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select value={genre} onValueChange={setGenre} required>
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fantasy">Fantasy</SelectItem>
                      <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                      <SelectItem value="Mystery">Mystery</SelectItem>
                      <SelectItem value="Romance">Romance</SelectItem>
                      <SelectItem value="Horror">Horror</SelectItem>
                      <SelectItem value="Thriller">Thriller</SelectItem>
                      <SelectItem value="Historical">Historical</SelectItem>
                      <SelectItem value="Adventure">Adventure</SelectItem>
                      <SelectItem value="Cyberpunk">Cyberpunk</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Initial Prompt */}
                <div className="space-y-2 mb-8">
                  <Label htmlFor="prompt">Initial Prompt</Label>
                  <RichTextEditor
                    value={prompt}
                    onChange={setPrompt}
                    placeholder="Set the scene for your story (e.g., 'It was an ordinary day until Aanya found a shimmering blue portal behind her bookshelf.')"
                    className="min-h-[250px]"
                  />
                </div> 
                
                {/* Visibility Setting */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="private"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-story-purple focus:ring-story-purple"
                  />
                  <Label htmlFor="private" className="flex-grow">
                    Make this story private (only invited contributors can view and participate)
                  </Label>
                </div>
                
                {/* Contributors */}
                {isPrivate && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Invite Contributors</Label>
                      <Button 
                        type="button" 
                        onClick={addContributor}
                        variant="outline" 
                        size="sm"
                        className="text-story-purple border-story-purple hover:bg-story-purple/5"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Contributor
                      </Button>
                    </div>
                    
                    {contributors.map((contributor, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={contributor}
                          onChange={(e) => updateContributor(index, e.target.value)}
                          placeholder="Enter email address"
                          className="flex-grow"
                        />
                        {contributors.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeContributor(index)}
                            variant="outline"
                            size="icon"
                            className="flex-shrink-0 text-red-500 border-red-200 hover:bg-red-50"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit"
                    className="w-full bg-story-purple text-white hover:bg-story-purple/90"
                    disabled={isSubmitting}
                  >
                    <Book className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Creating Story...' : 'Create Story'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CreateStory;
