
import { useState } from 'react'
import { Image, Video, Smile, Send, Heart, MessageSquare, Share2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'

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
    <div className="max-w-2xl mx-auto space-y-6">
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
  )
}

export default HomePage
