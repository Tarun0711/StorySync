import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

// Extend Express Request type to include user
declare module 'express' {
  interface Request {
    user?: {
      _id: Types.ObjectId;
    };
  }
}

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(); // Continue without authentication
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { _id: string };
    
    // Add user ID to request object
    req.user = {
      _id: new Types.ObjectId(decoded._id)
    };

    next();
  } catch (error) {
    // If token is invalid, just continue without authentication
    next();
  }
}; 