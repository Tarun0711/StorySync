import { storyService } from '@/services/api';

export interface Story {
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
  __v: number;
}

export const fetchAllStories = async (): Promise<Story[]> => {
  try {
    const stories = await storyService.listStories();
    return stories;
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
};

export const printStories = (stories: Story[]) => {
  console.log(JSON.stringify(stories, null, 2));
}; 