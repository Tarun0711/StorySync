import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Stories from "./pages/Stories";
import ReadStory from "./pages/ReadStory";
import AddContribution from "./pages/AddContribution";
import CreateStory from "./pages/CreateStory";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import Leaderboard from "./pages/Leaderboard";
import StoryDetail from "./pages/StoryDetail";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/stories/:id" element={<ReadStory />} />
            <Route path="/stories/:id/contribute" element={<AddContribution />} />
            <Route path="/stories/:id/details" element={<StoryDetail/>}/>
            <Route path="/stories/create" element={<CreateStory />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
