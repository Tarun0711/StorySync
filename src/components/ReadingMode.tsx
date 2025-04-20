
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

interface ReadingModeProps {
  title: string;
  genre: string;
  paragraphs: {
    id: number;
    content: string;
    authorName: string;
  }[];
  onClose: () => void;
}

const getBackgroundByGenre = (genre: string): string => {
  const genres: Record<string, string> = {
    Fantasy: 'bg-gradient-to-br from-purple-200 to-blue-200',
    Mystery: 'bg-gradient-to-br from-gray-200 to-slate-300',
    Horror: 'bg-gradient-to-br from-gray-200 to-red-200',
    Romance: 'bg-gradient-to-br from-pink-200 to-red-200',
    'Sci-Fi': 'bg-gradient-to-br from-blue-200 to-indigo-200',
  };
  return genres[genre] || 'bg-gradient-to-br from-gray-200 to-white';
};

const ReadingMode = ({ title, genre, paragraphs, onClose }: ReadingModeProps) => {
  const [fontSize, setFontSize] = useState(18);
  const contentRef = useRef<HTMLDivElement>(null);

  const adjustFontSize = (increment: number) => {
    setFontSize(prev => Math.min(Math.max(prev + increment, 14), 24));
  };

  // Get the background class for the current genre
  const backgroundClass = getBackgroundByGenre(genre);

  return (
    <div className={`fixed inset-0 z-50 ${backgroundClass}`}>
      <div className="container mx-auto px-4 py-8 h-full flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">{title}</h1>
            <span className="text-sm text-gray-600">{genre}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustFontSize(-1)}
                className="text-gray-600"
              >
                A-
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustFontSize(1)}
                className="text-gray-600"
              >
                A+
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1 px-4">
          <div 
            ref={contentRef}
            className="max-w-3xl mx-auto space-y-6"
            style={{ fontSize: `${fontSize}px` }}
          >
            {paragraphs.map((paragraph, index) => (
              <div key={paragraph.id} className="prose max-w-none">
                <p className="leading-relaxed text-gray-800">{paragraph.content}</p>
                <div className="text-sm text-gray-500 mt-2">
                  — {paragraph.authorName}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ReadingMode;
