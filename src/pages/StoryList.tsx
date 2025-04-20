import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { fetchAllStories, printStories, Story } from '@/utils/storyUtils';
import { toast } from 'sonner';

const StoryList = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const fetchedStories = await fetchAllStories();
        setStories(fetchedStories);
        printStories(fetchedStories);
      } catch (error) {
        console.error('Error loading stories:', error);
        toast.error('Failed to load stories');
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="container px-4 mx-auto max-w-6xl py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-story-purple"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container px-4 mx-auto max-w-6xl py-8">
        <h1 className="text-3xl font-bold font-serif mb-8">All Stories</h1>
        <div className="space-y-4">
          {stories.map((story) => (
            <div key={story._id} className="p-4 border rounded-lg">
              <h2 className="text-xl font-bold">{story.title}</h2>
              <p className="text-gray-600">Genre: {story.genre}</p>
              <p className="text-gray-600">Contributors: {story.contributors.length}</p>
              <p className="text-gray-600">Contributions: {story.contributions.length}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default StoryList; 