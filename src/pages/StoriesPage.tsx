
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStories, createStory, viewStory } from '@/services/database';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Story {
  id: string;
  user_id: string;
  media: string;
  text?: string;
  background?: string;
  font_color?: string;
  created_at: string;
  expires_at: string;
  profiles: {
    username: string;
    full_name: string;
    avatar: string;
  };
  seen?: boolean;
}

const StoriesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userStoryIndex, setUserStoryIndex] = useState(0);
  const [progressIntervalId, setProgressIntervalId] = useState<NodeJS.Timeout | null>(null);
  
  // For creating a new story
  const [storyMedia, setStoryMedia] = useState('');
  const [storyText, setStoryText] = useState('');
  const [storyOpen, setStoryOpen] = useState(false);

  // Group stories by user
  const storyGroups = stories.reduce((groups: Record<string, Story[]>, story) => {
    const userId = story.user_id;
    if (!groups[userId]) {
      groups[userId] = [];
    }
    groups[userId].push(story);
    return groups;
  }, {});
  
  const userList = Object.keys(storyGroups).map(userId => {
    const userStories = storyGroups[userId];
    const lastStory = userStories[0]; // Assuming sorted by newest first
    return {
      user_id: userId,
      username: lastStory.profiles.username,
      full_name: lastStory.profiles.full_name,
      avatar: lastStory.profiles.avatar,
      storyCount: userStories.length,
      allSeen: userStories.every(s => s.seen),
    };
  });

  useEffect(() => {
    const loadStories = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data } = await getStories(user.id);
        if (data) {
          // Mark stories as seen or not (this would normally come from the backend)
          const storiesWithSeen = data.map(story => ({
            ...story,
            seen: false // This would be determined by checking if this user has viewed it
          }));
          
          // Sort by user, then by creation date (newest first)
          const sortedStories = storiesWithSeen.sort((a, b) => {
            if (a.user_id === b.user_id) {
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            return 0;
          });
          
          setStories(sortedStories);
          
          // Filter user's own stories
          const ownStories = sortedStories.filter(story => story.user_id === user.id);
          setUserStories(ownStories);
        }
      } catch (error) {
        console.error('Error loading stories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStories();
  }, [user]);

  useEffect(() => {
    if (activeStory) {
      // Mark as viewed
      if (user) {
        viewStory(activeStory.id, user.id).catch(console.error);
      }
      
      // Set up progress timer
      const interval = setInterval(() => {
        setStoryProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            // Go to next story
            goToNextStory();
            return 0;
          }
          return newProgress;
        });
      }, 50); // 50ms intervals for 5 second duration
      
      setProgressIntervalId(interval);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [activeStory, storyIndex, user]);

  const viewUserStories = (userId: string) => {
    setSelectedUser(userId);
    setUserStoryIndex(0);
    const userStories = storyGroups[userId];
    setActiveStory(userStories[0]);
    setStoryProgress(0);
  };

  const closeStory = () => {
    setActiveStory(null);
    setSelectedUser(null);
    if (progressIntervalId) {
      clearInterval(progressIntervalId);
      setProgressIntervalId(null);
    }
  };

  const goToNextStory = () => {
    if (!selectedUser) return;
    
    const userStories = storyGroups[selectedUser];
    let newIndex = userStoryIndex + 1;
    
    if (newIndex < userStories.length) {
      // Next story from same user
      setUserStoryIndex(newIndex);
      setActiveStory(userStories[newIndex]);
      setStoryProgress(0);
    } else {
      // Find next user
      const currentUserIndex = userList.findIndex(u => u.user_id === selectedUser);
      if (currentUserIndex < userList.length - 1) {
        const nextUser = userList[currentUserIndex + 1];
        setSelectedUser(nextUser.user_id);
        setUserStoryIndex(0);
        setActiveStory(storyGroups[nextUser.user_id][0]);
        setStoryProgress(0);
      } else {
        // End of all stories
        closeStory();
      }
    }
  };

  const goToPreviousStory = () => {
    if (!selectedUser) return;
    
    let newIndex = userStoryIndex - 1;
    if (newIndex >= 0) {
      // Previous story from same user
      setUserStoryIndex(newIndex);
      setActiveStory(storyGroups[selectedUser][newIndex]);
      setStoryProgress(0);
    } else {
      // Find previous user
      const currentUserIndex = userList.findIndex(u => u.user_id === selectedUser);
      if (currentUserIndex > 0) {
        const prevUser = userList[currentUserIndex - 1];
        const prevUserStories = storyGroups[prevUser.user_id];
        setSelectedUser(prevUser.user_id);
        setUserStoryIndex(prevUserStories.length - 1);
        setActiveStory(prevUserStories[prevUserStories.length - 1]);
        setStoryProgress(0);
      } else {
        // Start of all stories, do nothing or loop to end
        setStoryProgress(0);
      }
    }
  };

  const handleSubmitStory = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await createStory(user.id, storyMedia, storyText);
      if (error) throw error;
      
      toast({
        title: "Story created",
        description: "Your story has been published successfully.",
      });
      
      // Add new story to the list
      if (data) {
        const newStory = {
          ...data[0],
          profiles: {
            username: user.user_metadata.username,
            full_name: user.user_metadata.full_name,
            avatar: user.user_metadata.avatar
          },
          seen: false
        };
        
        setStories([newStory, ...stories]);
        setUserStories([newStory, ...userStories]);
      }
      
      // Reset form and close dialog
      setStoryMedia('');
      setStoryText('');
      setStoryOpen(false);
    } catch (error: any) {
      toast({
        title: "Error creating story",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Stories</h1>
      
      <Tabs defaultValue="browse" className="mb-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Stories</TabsTrigger>
          <TabsTrigger value="my-stories">My Stories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="pt-4">
          <div className="flex gap-4 mb-8">
            <Card className="w-28 h-48 flex-shrink-0 relative overflow-hidden cursor-pointer group">
              <Dialog open={storyOpen} onOpenChange={setStoryOpen}>
                <DialogTrigger asChild>
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <div className="rounded-full bg-primary w-12 h-12 flex items-center justify-center mb-2">
                      <Plus className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium">Create Story</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Story</DialogTitle>
                    <DialogDescription>
                      Share a moment with your friends. Stories disappear after 24 hours.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="media" className="text-right">
                        Media URL
                      </Label>
                      <Input
                        id="media"
                        placeholder="https://example.com/image.jpg"
                        className="col-span-3"
                        value={storyMedia}
                        onChange={(e) => setStoryMedia(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="text" className="text-right">
                        Text (optional)
                      </Label>
                      <Input
                        id="text"
                        placeholder="What's on your mind?"
                        className="col-span-3"
                        value={storyText}
                        onChange={(e) => setStoryText(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setStoryOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmitStory} disabled={!storyMedia}>
                      Create Story
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>

            {loading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-28 h-48 flex-shrink-0 bg-muted animate-pulse rounded-lg"></div>
                ))}
              </>
            ) : userList.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center p-4 bg-muted/30 rounded-lg">
                <div>
                  <h3 className="font-medium text-lg mb-2">No stories available</h3>
                  <p className="text-muted-foreground text-sm">Be the first to create a story!</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {userList.map((storyUser) => (
                  <div 
                    key={storyUser.user_id} 
                    className="w-28 h-48 flex-shrink-0 relative overflow-hidden cursor-pointer group"
                    onClick={() => viewUserStories(storyUser.user_id)}
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url(${storyGroups[storyUser.user_id][0].media || 'https://placehold.co/112x160/e2e8f0/a0aec0?text=No+Image'})` 
                      }}
                    >
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
                    </div>
                    {/* Avatar with ring */}
                    <div className={`absolute top-2 left-2 ${storyUser.allSeen ? 'ring-muted' : 'ring-primary'} ring-2 rounded-full`}>
                      <Avatar className="h-10 w-10 border-2 border-background">
                        <AvatarImage src={storyUser.avatar} alt={storyUser.username} />
                        <AvatarFallback>{storyUser.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                    {/* Username */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-sm font-medium truncate">
                        {storyUser.full_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="my-stories" className="pt-4">
          {userStories.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="font-medium text-lg mb-2">You haven't created any stories yet</h3>
              <p className="text-muted-foreground mb-4">Share moments with your friends!</p>
              <Dialog open={storyOpen} onOpenChange={setStoryOpen}>
                <DialogTrigger asChild>
                  <Button>Create Your First Story</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  {/* Same dialog content as above */}
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {userStories.map((story) => (
                <Card 
                  key={story.id} 
                  className="relative overflow-hidden cursor-pointer h-60"
                  onClick={() => {
                    setActiveStory(story);
                    setSelectedUser(user?.id || null);
                    setUserStoryIndex(userStories.indexOf(story));
                  }}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${story.media || 'https://placehold.co/300x400/e2e8f0/a0aec0?text=No+Image'})` 
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-medium">
                      {story.text || 'Your story'}
                    </p>
                    <p className="text-white/70 text-xs mt-1">
                      {new Date(story.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Story Viewer */}
      {activeStory && (
        <div 
          className="fixed inset-0 z-50 bg-background flex items-center justify-center"
          onClick={(e) => {
            // Close when clicking outside the story content
            if (e.target === e.currentTarget) {
              closeStory();
            }
          }}
        >
          <div className="relative w-full max-w-md h-[80vh]">
            {/* Progress Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-muted z-10 flex gap-1 px-1">
              {selectedUser && storyGroups[selectedUser].map((_, i) => (
                <div key={i} className="flex-1">
                  <div 
                    className={`h-full ${i < userStoryIndex ? 'bg-white' : i === userStoryIndex ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    style={i === userStoryIndex ? { width: `${storyProgress}%` } : undefined}
                  ></div>
                </div>
              ))}
            </div>
            
            {/* User info */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <Avatar>
                <AvatarImage src={activeStory.profiles.avatar} alt={activeStory.profiles.username} />
                <AvatarFallback>{activeStory.profiles.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">{activeStory.profiles.full_name}</p>
                <p className="text-xs text-white/70">{new Date(activeStory.created_at).toLocaleString()}</p>
              </div>
            </div>
            
            {/* Close button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 z-10 text-white"
              onClick={closeStory}
            >
              <X className="h-6 w-6" />
            </Button>
            
            {/* Navigation */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white"
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousStory();
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white"
              onClick={(e) => {
                e.stopPropagation();
                goToNextStory();
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            
            {/* Story content */}
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${activeStory.media || 'https://placehold.co/400x800/e2e8f0/a0aec0?text=No+Image'})`,
                backgroundColor: activeStory.background || 'black' 
              }}
            >
              {/* Story overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30"></div>
              
              {/* Story text */}
              {activeStory.text && (
                <div className="absolute inset-x-4 bottom-12 text-center">
                  <p 
                    className="text-lg font-medium"
                    style={{ color: activeStory.font_color || 'white' }}
                  >
                    {activeStory.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesPage;
