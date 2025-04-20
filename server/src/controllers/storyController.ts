import { Response } from 'express';
import { Request } from '../types/express';
import { Story } from '../models/Story';
import { Types } from 'mongoose';

export const createStory = async (req: Request, res: Response) => {
  try {
    const { title, genre, prompt, isPrivate, contributors } = req.body;
    const owner = req.user._id;

    const story = new Story({
      title,
      genre,
      prompt,
      isPrivate,
      contributors: isPrivate ? [owner, ...(contributors || [])] : [owner],
      owner
    });

    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ message: 'Error creating story', error });
  }
};

export const getStory = async (req: Request, res: Response) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('owner', 'name email profilePicture')
      .populate('contributors', 'name username email profilePicture')
      .populate({
        path: 'contributions',
        select: 'content author status evaluation createdAt',
        populate: {
          path: 'author',
          select: 'name email profilePicture'
        }
      });

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if story is private and user is authorized
    if (story.isPrivate && req.user?._id) {
      const isAuthorized = story.owner.equals(req.user._id) || 
                         story.contributors.some(contributor => contributor.equals(req.user._id));
      if (!isAuthorized) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching story', error });
  }
};

export const updateStory = async (req: Request, res: Response) => {
  try {
    const { title, genre, prompt, isPrivate, contributors } = req.body;
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user is authorized to update
    if (req.user?._id && !story.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    story.title = title || story.title;
    story.genre = genre || story.genre;
    story.prompt = prompt || story.prompt;
    story.isPrivate = isPrivate !== undefined ? isPrivate : story.isPrivate;
    story.contributors = isPrivate ? contributors : [];

    await story.save();
    res.json(story);
  } catch (error) {
    res.status(400).json({ message: 'Error updating story', error });
  }
};

export const deleteStory = async (req: Request, res: Response) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user is authorized to delete
    if (req.user?._id && !story.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    await story.deleteOne();
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting story', error });
  }
};

export const listStories = async (req: Request, res: Response) => {
  try {
    const query: {
      $or: Array<{
        isPrivate?: boolean;
        owner?: Types.ObjectId;
        contributors?: Types.ObjectId;
      }>;
    } = {
      $or: [
        { isPrivate: false }
      ]
    };

    // If user is authenticated, add their stories and contributions
    if (req.user?._id) {
      query.$or.push(
        { owner: req.user._id },
        { contributors: req.user._id }
      );
    }

    const stories = await Story.find(query)
      .populate('owner', 'username email name profilePicture')
      .populate('contributors', 'username email name profilePicture')
      .populate({
        path: 'contributions',
        select: 'content author status evaluation createdAt',
        populate: {
          path: 'author',
          select: 'username email name profilePicture'
        }
      })
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories', error });
  }
}; 