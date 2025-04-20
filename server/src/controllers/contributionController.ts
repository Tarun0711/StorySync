import { HfInference } from '@huggingface/inference';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Story } from '../models/Story';
import Contribution from '../models/Contribution';
import { Types } from 'mongoose';
import User from '../models/User';

dotenv.config();

// Initialize Hugging Face Inference client with explicit API key
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || '');

interface EvaluationResult {
  relevance: number;
  grammar: number;
  creativity: number;
  totalScore: number;
  feedback: string;
}

export const analyzeContribution = async (req: Request, res: Response) => {
  try {
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error('Hugging Face API key is not configured');
    }

    const { contribution, previousContent } = req.body;

    if (!contribution) {
      return res.status(400).json({ error: 'Contribution text is required' });
    }

    // Prepare the prompt for the AI model
    const prompt = `
      Analyze the following story contribution:
      
      Previous content: ${previousContent || 'No previous content'}
      
      New contribution: ${contribution}
      
      Please evaluate this contribution on the following aspects:
      1. Relevance (0-10): How well does it connect with the previous content?
      2. Grammar (0-10): How well-written is it?
      3. Creativity (0-10): How original and imaginative is it?
      
      Also provide constructive feedback.
    `;

    // Get AI analysis using a more accessible model
    const response = await hf.textGeneration({
      model: 'gpt2', // Using GPT-2 as it's more readily available
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
      },
    });

    // Parse the AI response to extract scores and feedback
    const aiResponse = response.generated_text;
    
    // Extract scores using regex
    const relevanceMatch = aiResponse.match(/Relevance:?\s*(\d+(?:\.\d+)?)/i);
    const grammarMatch = aiResponse.match(/Grammar:?\s*(\d+(?:\.\d+)?)/i);
    const creativityMatch = aiResponse.match(/Creativity:?\s*(\d+(?:\.\d+)?)/i);
    
    // Extract feedback (everything after the last score)
    const feedbackMatch = aiResponse.match(/(?:Feedback|Analysis):?\s*([\s\S]*)$/i);

    const evaluation: EvaluationResult = {
      relevance: parseFloat(relevanceMatch?.[1] || '7.5'),
      grammar: parseFloat(grammarMatch?.[1] || '8.0'),
      creativity: parseFloat(creativityMatch?.[1] || '7.0'),
      totalScore: 0,
      feedback: feedbackMatch?.[1]?.trim() || 'No feedback available'
    };

    // Calculate total score
    evaluation.totalScore = evaluation.relevance + evaluation.grammar + evaluation.creativity;

    res.json(evaluation);
  } catch (error) {
    console.error('Error analyzing contribution:', error);
    res.status(500).json({ error: 'Failed to analyze contribution' });
  }
};

export const addContribution = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { content, evaluation } = req.body;
    const storyId = req.params.id;
    const authorId = req.user._id;

    // Validate story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user is authorized to contribute
    if (story.isPrivate) {
      const isAuthorized = story.owner.equals(authorId) || 
                         story.contributors.some(contributor => contributor.equals(authorId));
      if (!isAuthorized) {
        return res.status(403).json({ message: 'Unauthorized to contribute to this story' });
      }
    }

    // Create new contribution with evaluation scores
    const contribution = new Contribution({
      content,
      author: authorId,
      story: storyId,
      status: 'pending',
      evaluation: evaluation ? {
        relevance: evaluation.relevance,
        grammar: evaluation.grammar,
        creativity: evaluation.creativity,
        totalScore: evaluation.totalScore,
        feedback: evaluation.feedback
      } : null
    });

    await contribution.save();

    // Add contribution to story's contributions array
    story.contributions.push(contribution._id);
    await story.save();

    // Update user's points and badges if evaluation exists
    if (evaluation) {
      // Calculate average points (out of 10)
      const averagePoints = (evaluation.relevance + evaluation.grammar + evaluation.creativity) / 3;
      
      // Prepare badges to add
      const badgesToAdd = [];
      if (evaluation.relevance === 10) badgesToAdd.push('Relevant');
      if (evaluation.grammar === 10) badgesToAdd.push('Grammarian');
      if (evaluation.creativity === 10) badgesToAdd.push('Creative');
      
      // Update user's points and badges
      await User.findByIdAndUpdate(
        authorId,
        {
          $inc: { points: averagePoints },
          $addToSet: { badges: { $each: badgesToAdd } }
        }
      );
    }

    res.status(201).json(contribution);
  } catch (error) {
    console.error('Error adding contribution:', error);
    res.status(500).json({ message: 'Error adding contribution', error });
  }
};
