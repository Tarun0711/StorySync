
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Book, Edit, Award, Users } from 'lucide-react';

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-story-background to-story-accent">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif leading-tight">
                Craft Amazing Stories 
                <span className="text-story-purple block">Together</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-lg">
                Collaborate on stories, improve your writing skills, and compete on the leaderboard with AI-powered feedback.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-story-purple text-white hover:bg-story-purple/90"
                >
                  <Link to="/stories">
                    Browse Stories
                  </Link>
                </Button>
                <Button 
                  asChild
                  size="lg" 
                  variant="outline" 
                  className="border-story-purple text-story-purple hover:bg-story-purple hover:text-white"
                >
                  <Link to="/stories/create">
                    Start a Story
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative z-10 animate-scale-in">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-serif font-bold mb-3">The Portal to Valtor</h3>
                    <div className="story-content text-gray-700 mb-4">
                      <p>It was an ordinary day until Aanya found a shimmering blue portal behind her bookshelf.</p>
                      <p className="mt-2">Curiosity took over, and she stepped through it, landing in a world lit by twin suns and floating islands made of crystal.</p>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-story-purple border-story-purple/50 hover:bg-story-purple/5"
                      >
                        Continue this story...
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="absolute top-20 -right-4 transform rotate-6 z-0">
                <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg w-64 h-40"></Card>
              </div>
              <div className="absolute -bottom-4 -left-4 transform -rotate-3 z-0">
                <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg w-64 h-40"></Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-serif">
            How <span className="text-story-purple">StorySync</span> Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="story-card border-0 shadow-md animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-story-purple/10 mb-4">
                  <Book className="h-6 w-6 text-story-purple" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-serif">Create & Join Stories</h3>
                <p className="text-gray-600">
                  Start your own collaborative story or join existing ones that match your interests and writing style.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card className="story-card border-0 shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-story-purple/10 mb-4">
                  <Edit className="h-6 w-6 text-story-purple" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-serif">Contribute & Improve</h3>
                <p className="text-gray-600">
                  Add your parts to the story and receive AI-powered feedback to enhance your writing skills.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card className="story-card border-0 shadow-md animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-story-purple/10 mb-4">
                  <Award className="h-6 w-6 text-story-purple" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-serif">Compete & Earn</h3>
                <p className="text-gray-600">
                  Get scores for your contributions, climb the leaderboard, and earn badges for your writing achievements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold font-serif">
              Featured Stories
            </h2>
            <Button 
              asChild
              variant="outline" 
              className="border-story-purple text-story-purple hover:bg-story-purple hover:text-white"
            >
              <Link to="/stories">
                View All
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Story 1 */}
            <Link to="/stories/1" className="group">
              <Card className="story-card h-full border-0 shadow-md transition-all hover:border-story-purple/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold font-serif group-hover:text-story-purple transition-colors">
                      The Portal to Valtor
                    </h3>
                    <span className="px-2 py-1 bg-story-purple/10 text-story-purple text-xs rounded-full">
                      Fantasy
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    It was an ordinary day until Aanya found a shimmering blue portal behind her bookshelf...
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>8 contributors</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      4 paragraphs
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* Story 2 */}
            <Link to="/stories/2" className="group">
              <Card className="story-card h-full border-0 shadow-md transition-all hover:border-story-purple/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold font-serif group-hover:text-story-purple transition-colors">
                      The Last Starfighter
                    </h3>
                    <span className="px-2 py-1 bg-story-blue/10 text-story-blue text-xs rounded-full">
                      Sci-Fi
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    Commander Jaxon stared at the burning wreckage of his ship, the last defense against the Krill armada...
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>12 contributors</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      15 paragraphs
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* Story 3 */}
            <Link to="/stories/3" className="group">
              <Card className="story-card h-full border-0 shadow-md transition-all hover:border-story-purple/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold font-serif group-hover:text-story-purple transition-colors">
                      Whispers in the Dark
                    </h3>
                    <span className="px-2 py-1 bg-story-purple/10 text-story-purple text-xs rounded-full">
                      Mystery
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    Detective Sarah Morgan knew the abandoned Blackwood Manor held secrets, but she never expected to find the diary...
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>6 contributors</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      9 paragraphs
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-story-purple text-white">
        <div className="container px-4 mx-auto max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
            Ready to Start Your Writing Journey?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join our community of writers, contribute to amazing stories, and enhance your creative writing skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg" 
              className="bg-white text-story-purple hover:bg-white/90"
            >
              <Link to="/signup">
                Sign Up Now
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/20"
            >
              <Link to="/stories">
                Explore Stories
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
