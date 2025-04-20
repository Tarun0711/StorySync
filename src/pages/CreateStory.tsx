import { useState, useEffect, useCallback } from 'react';
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
import { Book, Plus, Minus, Check, X, Search } from 'lucide-react';
import { storyService, userService } from '@/services/api';
import { toast } from 'sonner';

const CreateStory = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [contributors, setContributors] = useState<string[]>(['']);
  const [contributorValidation, setContributorValidation] = useState<{ [key: string]: { isValid: boolean; name?: string } }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState<{ _id: string; email: string; name: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: { _id: string; email: string; name: string } }>({});
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
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
  
  const searchUsers = async (email: string, index: number) => {
    if (!email.trim()) {
      setSearchResults([]);
      setContributorValidation(prev => ({ ...prev, [index]: { isValid: false } }));
      return;
    }

    setIsSearching(true);
    try {
      const response = await userService.getUserByEmail(email.trim());
      setSearchResults(response.users);
      
      // Check if the current email matches any of the search results
      const exactMatch = response.users.find(user => 
        user.email.toLowerCase() === email.trim().toLowerCase()
      );
      
      if (exactMatch) {
        setSelectedUsers(prev => ({ ...prev, [index]: exactMatch }));
        setContributorValidation(prev => ({
          ...prev,
          [index]: { isValid: true, name: exactMatch.name }
        }));
      } else {
        setContributorValidation(prev => ({
          ...prev,
          [index]: { isValid: false }
        }));
      }
    } catch (error) {
      setSearchResults([]);
      setContributorValidation(prev => ({
        ...prev,
        [index]: { isValid: false }
      }));
    } finally {
      setIsSearching(false);
    }
  };

  const debounce = useCallback((func: Function, delay: number) => {
    return (...args: any[]) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      const timeout = setTimeout(() => {
        func(...args);
      }, delay);
      setSearchTimeout(timeout);
    };
  }, [searchTimeout]);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleContributorChange = async (index: number, value: string) => {
    const newContributors = [...contributors];
    newContributors[index] = value;
    setContributors(newContributors);
    
    // Clear validation when input is empty
    if (!value.trim()) {
      setContributorValidation(prev => ({ ...prev, [index]: { isValid: false } }));
      setSearchResults([]);
      return;
    }

    // Use debounced search
    debounce(() => searchUsers(value, index), 500)();
  };

  const handleUserSelect = (index: number, user: { _id: string; email: string; name: string }) => {
    const newContributors = [...contributors];
    newContributors[index] = user.email;
    setContributors(newContributors);
    setSelectedUsers(prev => ({ ...prev, [index]: user }));
    setContributorValidation(prev => ({
      ...prev,
      [index]: { isValid: true, name: user.name }
    }));
    setSearchResults([]);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const contributorIds = Object.values(selectedUsers).map(user => user._id);
      const storyData = {
        title,
        genre,
        prompt,
        isPrivate,
        contributors: contributorIds
      };

      const response = await storyService.createStory(storyData);
      toast.success('Story created successfully!');
      navigate(`/stories/${response._id}`);
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Failed to create story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="relative flex-grow">
                            <Input
                              value={contributor}
                              onChange={(e) => handleContributorChange(index, e.target.value)}
                              placeholder="Search by email"
                              className={`pr-10 ${contributorValidation[index]?.isValid ? 'border-green-500' : contributor ? 'border-red-500' : ''}`}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              {isSearching && <Search className="h-4 w-4 text-gray-400 animate-pulse" />}
                              {contributor && !isSearching && (
                                contributorValidation[index]?.isValid ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500" />
                                )
                              )}
                            </div>
                          </div>
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
                        
                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                            {searchResults.map((user) => (
                              <div
                                key={user._id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleUserSelect(index, user)}
                              >
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {contributorValidation[index]?.isValid && (
                          <p className="text-sm text-green-600">
                            {contributorValidation[index].name} will be added as a contributor
                          </p>
                        )}
                        {contributor && !contributorValidation[index]?.isValid && !isSearching && (
                          <p className="text-sm text-red-600">
                            No user found with this email
                          </p>
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
