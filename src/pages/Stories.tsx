
import { useState } from 'react';
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
import { Search, Book, Clock, Users } from 'lucide-react';

// Mock data for stories
const MOCK_STORIES = [
  {
    id: 1,
    title: "The Portal to Valtor",
    genre: "Fantasy",
    genreColor: "purple",
    excerpt: "It was an ordinary day until Aanya found a shimmering blue portal behind her bookshelf. Curiosity took over, and she stepped through it, landing in a world lit by twin suns and floating islands made of crystal.",
    contributors: 8,
    paragraphs: 4,
    updatedAt: "2 hours ago",
  },
  {
    id: 2,
    title: "The Last Starfighter",
    genre: "Sci-Fi",
    genreColor: "blue",
    excerpt: "Commander Jaxon stared at the burning wreckage of his ship, the last defense against the Krill armada. With Earth's defenses crippled, he had one final, desperate plan.",
    contributors: 12,
    paragraphs: 15,
    updatedAt: "1 day ago",
  },
  {
    id: 3,
    title: "Whispers in the Dark",
    genre: "Mystery",
    genreColor: "purple",
    excerpt: "Detective Sarah Morgan knew the abandoned Blackwood Manor held secrets, but she never expected to find the diary. As she flipped through its yellowed pages, the temperature in the room plummeted.",
    contributors: 6,
    paragraphs: 9,
    updatedAt: "3 days ago",
  },
  {
    id: 4,
    title: "Hearts Under the Cherry Trees",
    genre: "Romance",
    genreColor: "blue",
    excerpt: "Mei had sworn she would never return to her hometown, but her grandmother's letter changed everything. Now standing under the cherry blossoms, she wondered if he still remembered their promise.",
    contributors: 10,
    paragraphs: 12,
    updatedAt: "1 week ago",
  },
  {
    id: 5,
    title: "The Ancient Prophecy",
    genre: "Fantasy",
    genreColor: "purple",
    excerpt: "The old scroll crumbled in Professor Harrington's hands, but he had already translated enough to know the prophecy was true. The five stones would need to be united before the solstice.",
    contributors: 15,
    paragraphs: 20,
    updatedAt: "2 days ago",
  },
  {
    id: 6,
    title: "Neon Nights",
    genre: "Cyberpunk",
    genreColor: "blue",
    excerpt: "Rain pattered against the neon-lit streets of New Tokyo as Rio adjusted her cybernetic arm. The data chip hidden in her synthetic skin was worth more than the entire city district.",
    contributors: 7,
    paragraphs: 8,
    updatedAt: "5 hours ago",
  },
];

const Stories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  
  // Filter stories based on search term and genre
  const filteredStories = MOCK_STORIES.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          story.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'all' || story.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

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
          {filteredStories.map(story => (
            <Link to={`/stories/${story.id}`} key={story.id} className="group">
              <Card className="story-card h-full border-0 shadow-md transition-all hover:border-story-purple/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold font-serif group-hover:text-story-purple transition-colors line-clamp-1">
                      {story.title}
                    </h3>
                    <span className={`px-2 py-1 bg-story-${story.genreColor}/10 text-story-${story.genreColor} text-xs rounded-full`}>
                      {story.genre}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {story.excerpt}
                  </p>
                  <div className="flex flex-wrap justify-between items-center gap-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{story.contributors} contributors</span>
                    </div>
                    <div>
                      {story.paragraphs} paragraphs
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Updated {story.updatedAt}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
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
