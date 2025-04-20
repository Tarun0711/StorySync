import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User';
import Contribution from '../models/Contribution';


const router = express.Router();

// Middleware to verify JWT token
const auth = async (req: any, res: any, next: any) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = (decoded as any).userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get user profile
router.get('/profile/:userId', auth, async (req: any, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    console.log('Fetching profile for userId:', userId);
    const user = await User.findById(userId)
      .select('-password')
      .populate('stories')
      .populate('contributions');
    
    if (!user) { 
      return res.status(404).json({ message: 'User not found' });
    }

    // Get contributions separately
    const contributions = await Contribution.find({ author: userId });
    
    res.json({
      ...user.toObject(),
      contributions: contributions.map(contribution => contribution.toObject())
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    if (error instanceof Error) {
      res.status(500).json({ 
        message: 'Failed to fetch user profile',
        error: error.message 
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to fetch user profile',
        error: 'An unknown error occurred' 
      });
    }
  }
});

// Update user profile
router.put('/profile', auth, async (req: any, res) => {
  try {
    const { name, bio, profilePicture } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Change password
router.put('/change-password', auth, async (req: any, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});
router.get('/email/:email', auth, async (req: any, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Use regex to search for partial email matches
    const users = await User.find({ 
      email: { 
        $regex: new RegExp(email.toLowerCase(), 'i') 
      } 
    })
    .select('-password')
    .limit(5); // Limit to 5 results to prevent overwhelming response
    
    if (!users || users.length === 0) {
      return res.status(200).json({ 
        message: 'No users found',
        users: [] 
      });
    }

    res.json({ 
      message: 'Users found',
      users 
    });
  } catch (error) {
    console.error('Error searching users by email:', error);
    if (error instanceof Error) {
      res.status(500).json({ 
        message: 'Failed to search users',
        error: error.message 
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to search users',
        error: 'An unknown error occurred' 
      });
    }
  }
});

export default router; 