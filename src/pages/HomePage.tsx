
import { useState } from 'react'
import { Image, Video, Smile, Send, Heart, MessageSquare, Share2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import StoriesCarousel from '@/components/stories/StoriesCarousel'
import FriendSuggestions from '@/components/friends/FriendSuggestions'

// Sample data
const posts = [
  {
    id: 1,
    author: {
      name: 'John Doe',
      avatar: 'JD',
      username: 'johndoe'
    },
    content: 'Just finished my first React project! Anyone have any tips for a beginner?',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 5,
    shares: 2
  },
  {
    id: 2,
    author: {
      name: 'Jane Smith',
      avatar: 'JS',
      username: 'janesmith'
    },
    content: 'Beautiful sunset at the beach today! 🌅 #nature #sunset #beach',
    timestamp: '5 hours ago',
    likes: 56,
    comments: 8,
    shares: 12
  },
  {
    id: 3,
    author: {
      name: 'Alex Johnson',
      avatar: 'AJ',
      username: 'alexj'
    },
    content: 'Working from home today. Anyone else having productivity tips?',
    timestamp: '1 day ago',
    likes: 15,
    comments: 10,
    shares: 1
  }
]

// Sample stories data
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

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      })
      setNewPost('')
    }
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
                  <AvatarImage src="" alt="Your avatar" />
                  <AvatarFallback>YA</AvatarFallback>
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
                disabled={!newPost.trim()}
                size="sm"
              >
                <Send className="mr-2 h-4 w-4" />
                Post
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
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="" alt={post.author.name} />
                        <AvatarFallback>{post.author.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{post.author.name}</div>
                        <div className="text-xs text-muted-foreground">@{post.author.username} · {post.timestamp}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p>{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-3">
                    <Button variant="ghost" size="sm">
                      <Heart className="mr-1 h-4 w-4" />
                      <span className="text-xs">{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      <span className="text-xs">{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="mr-1 h-4 w-4" />
                      <span className="text-xs">{post.shares}</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
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
