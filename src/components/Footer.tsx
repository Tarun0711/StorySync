
import { Book } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center">
            <Book className="h-6 w-6 text-story-purple" />
            <span className="ml-2 text-lg font-serif font-bold text-story-purple">StorySync</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 items-center text-sm text-gray-500">
            <a href="#" className="hover:text-story-purple">About</a>
            <a href="#" className="hover:text-story-purple">Privacy Policy</a>
            <a href="#" className="hover:text-story-purple">Terms of Service</a>
            <a href="#" className="hover:text-story-purple">Contact</a>
          </div>
          
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} StorySync. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
