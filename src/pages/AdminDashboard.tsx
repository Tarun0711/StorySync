import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { adminService } from '@/services/api';

interface Evaluation {
  relevance: number;
  grammar: number;
  creativity: number;
  totalScore: number;
  feedback: string;
}

interface Author {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
}

interface Story {
  _id: string;
  title: string;
}

interface Contribution {
  _id: string;
  content: string;
  author: Author;
  story: Story;
  status: string;
  createdAt: string;
  updatedAt: string;
  evaluation?: Evaluation;
}

export default function AdminDashboard() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const data = await adminService.getContributions();
        setContributions(data);
      } catch (error) {
        console.error('Error fetching contributions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const handleDelete = async (contributionId: string) => {
    try {
      await adminService.deleteContribution(contributionId);
      setContributions(contributions.filter(c => c._id !== contributionId));
    } catch (error) {
      console.error('Error deleting contribution:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Story Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Evaluation</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributions.map((contribution) => (
              <TableRow key={contribution._id}>
                <TableCell>{contribution.story.title}</TableCell>
                <TableCell>{contribution.author.name}</TableCell>
                <TableCell className="max-w-md truncate" dangerouslySetInnerHTML={{ __html: contribution.content }}></TableCell>
                <TableCell>{contribution.status}</TableCell>
                <TableCell>
                  {contribution.evaluation ? (
                    <div className="space-y-1">
                      <div>Total Score: {contribution.evaluation.totalScore}</div>
                      <div>Relevance: {contribution.evaluation.relevance}</div>
                      <div>Grammar: {contribution.evaluation.grammar}</div>
                      <div>Creativity: {contribution.evaluation.creativity}</div>
                    </div>
                  ) : (
                    <span>Not evaluated</span>
                  )}
                </TableCell>
                <TableCell>{new Date(contribution.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(contribution._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 