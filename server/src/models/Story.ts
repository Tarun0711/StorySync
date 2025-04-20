import mongoose from 'mongoose';

interface IStory {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  contributors: mongoose.Types.ObjectId[];
  status: 'draft' | 'published' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const storySchema = new mongoose.Schema<IStory>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contributors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'completed'],
    default: 'draft'
  }
}, {
  timestamps: true
});

const Story = mongoose.model<IStory>('Story', storySchema);

export default Story; 