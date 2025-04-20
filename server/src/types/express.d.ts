import { Request as ExpressRequest } from 'express';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface User {
      _id: Types.ObjectId;
      email: string;
    }

    interface Request {
      user: User;
    }
  }
}

export interface Request extends ExpressRequest {
  user: Express.User;
} 