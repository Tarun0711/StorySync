import mongoose from 'mongoose';

interface IContribution {
  content: string;
  author: mongoose.Types.ObjectId;
  story: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  evaluation?: {
    relevance: number;
    grammar: number;
    creativity: number;
    totalScore: number;
    feedback: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const contributionSchema = new mongoose.Schema<IContribution>({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  evaluation: {
    relevance: { type: Number },
    grammar: { type: Number },
    creativity: { type: Number },
    totalScore: { type: Number },
    feedback: { type: String }
  }
}, {
  timestamps: true
});

const Contribution = mongoose.model<IContribution>('Contribution', contributionSchema);

export default Contribution; 