import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import StoryNotebook from '@/components/StoryNotebook';
import ReadingMode from '@/components/ReadingMode';
import { Edit, BookOpen } from 'lucide-react';
import { storyService } from '@/services/api';
import { toast } from 'sonner';

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

const ReadStory = () => {
  const { id } = useParams<{ id: string }>();
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

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
        <div className="mb-8 flex justify-between items-center">
          <Button 
            asChild
            variant="outline"
            className="border-story-purple text-story-purple hover:bg-story-purple/5"
          >
            <Link to="/stories">
              Back to Stories
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsReadingMode(true)}
              variant="outline"
              className="border-story-purple text-story-purple hover:bg-story-purple/5"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Reading Mode
            </Button>
            <Button 
              asChild
              variant="outline"
              className="border-story-purple text-story-purple hover:bg-story-purple/5"
            >
              <Link to={`/stories/${id}/details`}>
                <Edit className="mr-2 h-4 w-4" />
                Story Details
              </Link>
            </Button>
            <Button 
              asChild
              className="bg-story-purple text-white hover:bg-story-purple/90"
            >
              <Link to={`/stories/${id}/contribute`}>
                <Edit className="mr-2 h-4 w-4" />
                Add Contribution
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <span className="bg-story-purple/10 text-story-purple px-3 py-1 rounded-full text-sm">
              {story.genre}
            </span>
            {story.isPrivate && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                Private
              </span>
            )}
          </div>
          {story.prompt && (
            <div className="prose max-w-none mb-8">
              <h3 className="text-lg font-semibold mb-2">Story Prompt</h3>
              <div dangerouslySetInnerHTML={{ __html: story.prompt }} />
            </div>
          )}
        </div>

        <StoryNotebook 
          title={story.title}
          genre={story.genre}
          paragraphs={story.contributions.map((contribution, index) => ({
            id: index + 1,
            content: contribution.content,
            authorId: parseInt(contribution.author._id),
            authorName: contribution.author.name,
            createdAt: new Date(contribution.createdAt).toLocaleDateString(),
            score: contribution.evaluation?.totalScore || null
          }))}
        />
      </div>

      {isReadingMode && (
        <ReadingMode
          title={story.title}
          genre={story.genre}
          paragraphs={story.contributions.map((contribution, index) => ({
            id: index + 1,
            content: contribution.content,
            authorName: contribution.author.name
          }))}
          onClose={() => setIsReadingMode(false)}
        />
      )}
    </MainLayout>
  );
};

export default ReadStory;
