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
  paragraphs: Array<{
    id: number;
    content: string;
    authorId: number;
    authorName: string;
    createdAt: string;
    score: number | null;
  }>;
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
        
        <StoryNotebook 
          title={story.title}
          genre={story.genre}
          paragraphs={story.paragraphs}
        />
      </div>

      {isReadingMode && (
        <ReadingMode
          title={story.title}
          genre={story.genre}
          paragraphs={story.paragraphs}
          onClose={() => setIsReadingMode(false)}
        />
      )}
    </MainLayout>
  );
};

export default ReadStory;
