
import { useState } from 'react'
import { Image, Video, Smile, Send, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import StoriesCarousel from '@/components/stories/StoriesCarousel'
import FriendSuggestions from '@/components/friends/FriendSuggestions'
import PostCard from '@/components/post/PostCard'
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'

// Sample stories data (would come from backend in a real app)
const sampleStories = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    userAvatar: '',
    imageUrl: 'https://via.placeholder.com/112x160?text=Story1',
    createdAt: '2 hours ago',
    seen: false
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    userAvatar: '',
    imageUrl: 'https://via.placeholder.com/112x160?text=Story2',
    createdAt: '4 hours ago',
    seen: false
  },
  {
    id: '3',
    userId: '3',
    userName: 'Mike Brown',
    userAvatar: '',
    imageUrl: 'https://via.placeholder.com/112x160?text=Story3',
    createdAt: '6 hours ago',
    seen: true
  },
  {
    id: '4',
    userId: '4',
    userName: 'Emily Davis',
    userAvatar: '',
    imageUrl: 'https://via.placeholder.com/112x160?text=Story4',
    createdAt: '12 hours ago',
    seen: true
  },
  {
    id: '5',
    userId: '5',
    userName: 'David Wilson',
    userAvatar: '',
    imageUrl: 'https://via.placeholder.com/112x160?text=Story5',
    createdAt: '1 day ago',
    seen: true
  }
];

const HomePage = () => {
  const [newPost, setNewPost] = useState('')
  const { toast } = useToast()
  const { user } = useAuth()
  const { posts, createPost, isLoading, loadPosts } = useData()
  const [postLoading, setPostLoading] = useState(false)

  const handlePostSubmit = async () => {
    if (newPost.trim()) {
      setPostLoading(true);
      await createPost(newPost.trim());
      setNewPost('');
      setPostLoading(false);
    }
  }

  const handleLoadMore = () => {
    loadPosts(10, posts.length);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Stories */}
      <div className="mb-6">
        <StoriesCarousel stories={sampleStories} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Create Post */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.avatar || ""} alt="Your avatar" />
                  <AvatarFallback>{user?.user_metadata?.full_name?.substring(0, 2).toUpperCase() || "YA"}</AvatarFallback>
                </Avatar>
                <Textarea 
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="flex-1 resize-none"
                />
              </div>
            </CardHeader>
            <CardFooter className="flex justify-between pt-0">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Image className="mr-2 h-4 w-4" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="mr-2 h-4 w-4" />
                  Video
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="mr-2 h-4 w-4" />
                  Feeling
                </Button>
              </div>
              <Button 
                onClick={handlePostSubmit} 
                disabled={!newPost.trim() || postLoading}
                size="sm"
              >
                {postLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Post
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Posts Feed */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4 space-y-4">
              {isLoading && posts.length === 0 ? (
                <Card>
                  <CardContent className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </CardContent>
                </Card>
              ) : posts.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  
                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handleLoadMore}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="friends" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    View posts from your friends
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="trending" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    View trending posts across the platform
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar Content */}
        <div className="space-y-6">
          <FriendSuggestions />
          
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-sm">Upcoming Events</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border rounded-md p-3">
                  <p className="font-medium text-sm">Web Development Meetup</p>
                  <p className="text-xs text-muted-foreground">Tomorrow at 6:00 PM</p>
                </div>
                <div className="border rounded-md p-3">
                  <p className="font-medium text-sm">Photography Workshop</p>
                  <p className="text-xs text-muted-foreground">Saturday at 2:00 PM</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" size="sm" className="mx-auto">
                View All Events
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HomePage
