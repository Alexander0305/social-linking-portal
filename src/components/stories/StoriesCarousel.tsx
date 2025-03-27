
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  createdAt: string;
  seen: boolean;
}

interface StoriesCarouselProps {
  stories: Story[];
}

const StoryCard: React.FC<{ story: Story; onView: (id: string) => void }> = ({ story, onView }) => {
  return (
    <div 
      className="relative flex-shrink-0 w-28 cursor-pointer group" 
      onClick={() => onView(story.id)}
    >
      <div 
        className={cn(
          "w-28 h-40 rounded-xl bg-cover bg-center overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-black/60"
        )}
        style={{ backgroundImage: `url(${story.imageUrl || 'https://via.placeholder.com/112x160'})` }}
      >
        <div className="absolute inset-x-0 bottom-0 p-2">
          <p className="text-white text-xs font-medium truncate">
            {story.userName}
          </p>
        </div>
      </div>
      <div className={cn(
        "absolute top-2 left-2 ring-4",
        story.seen ? "ring-muted" : "ring-primary",
        "rounded-full"
      )}>
        <Avatar className="h-9 w-9 border-2 border-background">
          <AvatarImage src={story.userAvatar} alt={story.userName} />
          <AvatarFallback>{story.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

const CreateStoryCard: React.FC = () => {
  return (
    <div className="relative flex-shrink-0 w-28 cursor-pointer group">
      <div className="w-28 h-40 rounded-xl bg-muted overflow-hidden flex flex-col items-center justify-center">
        <div className="mb-2 bg-background rounded-full p-2">
          <Plus className="h-6 w-6" />
        </div>
        <p className="text-xs font-medium">Create Story</p>
      </div>
    </div>
  );
};

const StoriesCarousel: React.FC<StoriesCarouselProps> = ({ stories: initialStories }) => {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleViewStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (story) {
      setActiveStory(story);
      setStoryProgress(0);
      // Mark as seen
      setStories(stories.map(s => 
        s.id === storyId ? { ...s, seen: true } : s
      ));
    }
  };

  const handleCloseStory = () => {
    setActiveStory(null);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount = 300;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (activeStory) {
      // Auto-progress the story
      progressIntervalRef.current = setInterval(() => {
        setStoryProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            // Close this story or go to next
            clearInterval(progressIntervalRef.current!);
            
            // Find next story
            const currentIndex = stories.findIndex(s => s.id === activeStory.id);
            if (currentIndex < stories.length - 1) {
              // Go to next story
              handleViewStory(stories[currentIndex + 1].id);
            } else {
              // Close viewer
              handleCloseStory();
            }
            return 0;
          }
          return newProgress;
        });
      }, 50);
    }
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [activeStory, stories]);

  return (
    <>
      <div className="relative">
        <div 
          ref={carouselRef}
          className="flex space-x-4 overflow-x-auto py-4 px-1 scrollbar-none"
        >
          <CreateStoryCard />
          
          {stories.map(story => (
            <StoryCard key={story.id} story={story} onView={handleViewStory} />
          ))}
        </div>
        
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 shadow-md"
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 shadow-md"
          onClick={() => handleScroll('right')}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Story Viewer */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
          <div className="relative w-full max-w-md h-[80vh]">
            <div className="absolute top-0 inset-x-0 h-1 bg-muted z-10">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${storyProgress}%` }}
              ></div>
            </div>
            
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <Avatar>
                <AvatarImage src={activeStory.userAvatar} alt={activeStory.userName} />
                <AvatarFallback>{activeStory.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">{activeStory.userName}</p>
                <p className="text-xs text-white/70">{activeStory.createdAt}</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 z-10 text-white"
              onClick={handleCloseStory}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${activeStory.imageUrl || 'https://via.placeholder.com/400x800'})` }}
            >
              {/* Story overlay for gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesCarousel;
