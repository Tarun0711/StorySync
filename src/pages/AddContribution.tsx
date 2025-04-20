import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/RIchTextEditor';
import 'react-quill/dist/quill.snow.css';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { contributionService } from '@/services/api';
import { toast } from 'sonner';

const AddContribution = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newContribution, setNewContribution] = useState('');
  const [isSubmittingContribution, setIsSubmittingContribution] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<any | null>(null);
  
  const submitContribution = async () => {
    if (!newContribution.trim()) return;
    
    setIsSubmittingContribution(true);
    
    try {
      const evaluation = await contributionService.analyzeContribution(newContribution);
      setAiEvaluation(evaluation);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to analyze contribution');
    } finally {
      setIsSubmittingContribution(false);
    }
  };
  
  const acceptEvaluation = async () => {
    if (!id) return;
    
    try {
      const payload = {
        content: newContribution,
        evaluation: {
          relevance: aiEvaluation.relevance,
          grammar: aiEvaluation.grammar,
          creativity: aiEvaluation.creativity,
          totalScore: aiEvaluation.totalScore,
          feedback: aiEvaluation.feedback
        }
      };
      
      await contributionService.addContribution(id, payload);
      toast.success('Contribution added successfully');
      navigate(`/stories/${id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add contribution');
    }
  };
  
  const cancelContribution = () => {
    setAiEvaluation(null);
    setNewContribution('');
  };

  return (
    <MainLayout>
      <div className="container px-4 mx-auto max-w-4xl py-8">
        <div className="mb-8 flex justify-between items-center">
          <Button 
            asChild
            variant="outline"
            className="border-story-purple text-story-purple hover:bg-story-purple/5"
          >
            <Link to={`/stories/${id}`}>
              Back to Story
            </Link>
          </Button>
        </div>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            {!aiEvaluation ? (
              <div>
                <h3 className="font-serif font-bold text-lg mb-3">Add your contribution</h3>
                <div className="mb-4">
                  <RichTextEditor
                    value={newContribution}
                    onChange={setNewContribution}
                    placeholder="Continue the story..."
                    className="min-h-[200px]"
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={submitContribution}
                    disabled={isSubmittingContribution || !newContribution.trim()}
                    className="bg-story-purple text-white hover:bg-story-purple/90"
                  >
                    {isSubmittingContribution ? 'Analyzing...' : 'Submit for Evaluation'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <h3 className="font-serif font-bold text-lg mb-3">AI Evaluation Results</h3>
                <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-story-purple">{aiEvaluation.relevance.toFixed(1)}/10</div>
                      <div className="text-sm text-gray-500">Relevance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-story-purple">{aiEvaluation.grammar.toFixed(1)}/10</div>
                      <div className="text-sm text-gray-500">Grammar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-story-purple">{aiEvaluation.creativity.toFixed(1)}/10</div>
                      <div className="text-sm text-gray-500">Creativity</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Total Score</span>
                      <span className="text-sm font-bold">{aiEvaluation.totalScore.toFixed(1)}/30</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-story-purple h-2 rounded-full" 
                        style={{ width: `${(aiEvaluation.totalScore / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-md">
                    <h4 className="text-sm font-medium mb-1">Feedback:</h4>
                    <p className="text-sm text-gray-700">{aiEvaluation.feedback}</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={cancelContribution}
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={acceptEvaluation}
                    className="bg-story-purple text-white hover:bg-story-purple/90"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept & Add Contribution
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AddContribution;
