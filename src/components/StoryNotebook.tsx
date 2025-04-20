import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

interface StoryParagraph {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  score: number | null;
}

interface StoryNotebookProps {
  title: string;
  genre: string;
  paragraphs?: StoryParagraph[];
}

const StoryNotebook = ({ title, genre, paragraphs = [] }: StoryNotebookProps) => {
  return (
    <Card className="border-0 shadow-md overflow-hidden bg-white">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold font-serif">{title}</h1>
          <span className="px-2 py-1 bg-story-purple/10 text-story-purple text-xs rounded-full">
            {genre}
          </span>
        </div>
      </div>
      <ScrollArea className="h-[70vh] bg-[#f8f9fa] p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {paragraphs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No paragraphs available yet.
            </div>
          ) : (
            paragraphs.map((paragraph) => (
              <div key={paragraph.id} className="flex gap-4">
                <div className="pt-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${paragraph.authorId}`} />
                    <AvatarFallback>{paragraph.authorName[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">{paragraph.authorName}</span>
                      <span className="text-gray-500 text-sm ml-2">{paragraph.createdAt}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-800 leading-relaxed">{paragraph.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default StoryNotebook;
