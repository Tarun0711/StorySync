import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Book, Clock, Users, Loader2 } from 'lucide-react';
import { storyService } from '@/services/api';
import { toast } from 'sonner';

interface Story {
  _id: string;
  title: string;
  genre: string;
  prompt: string;
  contributors: string[];
  contributions: string[];
  createdAt: string;
  updatedAt: string;
  paragraphs?: any[];
}

const Stories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await storyService.listStories();
        setStories(data);
      } catch (error) {
        console.error('Error fetching stories:', error);
        toast.error('Failed to fetch stories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);
  
  // Filter stories based on search term and genre
  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          story.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'all' || story.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const getGenreColor = (genre: string) => {
    // Map genres to colors
    const genreColors: { [key: string]: string } = {
      'Fantasy': 'purple',
      'Sci-Fi': 'blue',
      'Mystery': 'purple',
      'Romance': 'blue',
      'Cyberpunk': 'blue'
    };
    return genreColors[genre] || 'blue';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return '1 day ago';
    } else {
      return `${Math.round(diffInHours / 24)} days ago`;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container px-4 mx-auto max-w-6xl py-8 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-story-purple" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container px-4 mx-auto max-w-6xl py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-serif">Browse Stories</h1>
          <Button 
            asChild
            className="bg-story-purple text-white hover:bg-story-purple/90"
          >
            <Link to="/stories/create">
              <Book className="mr-2 h-4 w-4" />
              Start a New Story
            </Link>
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search stories by title or content"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="Fantasy">Fantasy</SelectItem>
                <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                <SelectItem value="Mystery">Mystery</SelectItem>
                <SelectItem value="Romance">Romance</SelectItem>
                <SelectItem value="Cyberpunk">Cyberpunk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map(story => {
            const genreColor = getGenreColor(story.genre);
            return (
              <Link to={`/stories/${story._id}`} key={story._id} className="group">
                <Card className="story-card h-full border-0 shadow-md transition-all hover:border-story-purple/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold font-serif group-hover:text-story-purple transition-colors line-clamp-1">
                        {story.title}
                      </h3>
                      <span className={`px-2 py-1 bg-story-${genreColor}/10 text-story-${genreColor} text-xs rounded-full`}>
                        {story.genre}
                      </span>
                    </div>
                    <div 
                      className="text-gray-600 mb-6 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: story.prompt }}
                    />
                    <div className="flex flex-wrap justify-between items-center gap-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{story.contributors.length} contributors</span>
                      </div>
                      <div>
                        {story.contributions?.length || 0} Paragraphs
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Updated {formatDate(story.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
        
        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold mb-2">No stories found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters, or be the first to create a story in this category!
            </p>
            <Button 
              asChild
              className="bg-story-purple text-white hover:bg-story-purple/90"
            >
              <Link to="/stories/create">
                Start a New Story
              </Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Stories;
