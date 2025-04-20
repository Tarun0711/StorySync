import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import StoryNotebook from '@/components/StoryNotebook';
import ReadingMode from '@/components/ReadingMode';
import { Edit, BookOpen } from 'lucide-react';

// Using the same mock data structure as before
const STORY = {
  id: 1,
  title: "The Portal to Valtor",
  genre: "Fantasy",
  paragraphs: [
    {
      id: 1,
      content: "It was an ordinary day until Aanya found a shimmering blue portal behind her bookshelf.",
      authorId: 0,
      authorName: "Admin",
      createdAt: "2025-03-15",
      score: null,
    },
    {
      id: 2,
      content: "Curiosity took over, and she stepped through it, landing in a world lit by twin suns and floating islands made of crystal.",
      authorId: 1,
      authorName: "Sneha",
      createdAt: "2025-03-16",
      score: 28.5,
    },
    {
      id: 3,
      content: "Aanya walked around and saw many people. She was confused and asked someone what place this is.",
      authorId: 2,
      authorName: "Rahul",
      createdAt: "2025-03-17",
      score: 18.5,
    },
  ],
};

const ReadStory = () => {
  const { id } = useParams<{ id: string }>();
  const [isReadingMode, setIsReadingMode] = useState(false);

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
          title={STORY.title}
          genre={STORY.genre}
          paragraphs={STORY.paragraphs}
        />
      </div>

      {isReadingMode && (
        <ReadingMode
          title={STORY.title}
          genre={STORY.genre}
          paragraphs={STORY.paragraphs}
          onClose={() => setIsReadingMode(false)}
        />
      )}
    </MainLayout>
  );
};

export default ReadStory;
