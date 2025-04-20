import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    enum: ['Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Horror', 'Thriller', 'Historical', 'Adventure', 'Cyberpunk', 'Other']
  },
  prompt: {
    type: String,
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  contributors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contributions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contribution'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
storySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Story = mongoose.model('Story', storySchema); 