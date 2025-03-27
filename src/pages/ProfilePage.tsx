
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CalendarDays, MapPin, Link as LinkIcon, Edit, Image as ImageIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'

// Mock user data
const userData = {
  id: 'me',
  name: 'Alex Johnson',
  username: 'alexj',
  avatar: 'AJ',
  coverPhoto: '', // URL for cover photo
  bio: 'Frontend Developer and UI/UX Enthusiast | Coffee Lover | Travel Addict',
  location: 'San Francisco, CA',
  website: 'https://alexjohnson.dev',
  joinDate: 'Joined January 2022',
  following: 245,
  followers: 1024,
  isCurrentUser: true // whether the profile belongs to current user
}

// Sample posts for profile
const userPosts = [
  {
    id: 101,
    content: 'Working on a new design system for our upcoming project. Can\'t wait to share it!',
    timestamp: '1 day ago',
    likes: 32,
    comments: 8
  },
  {
    id: 102,
    content: 'Just pushed some new code to my GitHub repo. Check it out if you\'re interested in React patterns.',
    timestamp: '3 days ago',
    likes: 45,
    comments: 12
  },
  {
    id: 103,
    content: 'Beautiful day for a hike! 🏞️ #nature #weekend #hiking',
    timestamp: '1 week ago',
    likes: 89,
    comments: 15
  }
]

const ProfilePage = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const [isFollowing, setIsFollowing] = useState(false)
  
  // In a real app, we would fetch user data based on the id parameter
  const user = userData

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing)
    toast({
      title: isFollowing ? "Unfollowed" : "Followed",
      description: isFollowing 
        ? `You unfollowed ${user.name}`
        : `You are now following ${user.name}`,
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="relative">
        <div 
          className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg"
          style={user.coverPhoto ? { backgroundImage: `url(${user.coverPhoto})`, backgroundSize: 'cover' } : {}}
        >
          {user.isCurrentUser && (
            <Button size="sm" variant="outline" className="absolute right-4 top-4 bg-background/60 backdrop-blur-sm">
              <ImageIcon className="mr-2 h-4 w-4" />
              Change Cover
            </Button>
          )}
        </div>
        
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row gap-6 -mt-12 relative">
            <Avatar className="h-24 w-24 ring-4 ring-background">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="text-xl">{user.avatar}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2 mt-4 md:mt-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>
                {user.isCurrentUser ? (
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button 
                    variant={isFollowing ? "outline" : "default"}
                    onClick={handleFollowClick}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </div>
              
              <p>{user.bio}</p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {user.location && (
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {user.location}
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center">
                    <LinkIcon className="mr-1 h-4 w-4" />
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {user.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  {user.joinDate}
                </div>
              </div>
              
              <div className="flex gap-4">
                <div>
                  <span className="font-semibold">{user.following}</span>
                  <span className="text-muted-foreground ml-1">Following</span>
                </div>
                <div>
                  <span className="font-semibold">{user.followers}</span>
                  <span className="text-muted-foreground ml-1">Followers</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-4 space-y-4">
          {userPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback>{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{user.name}</span>
                      <span className="text-xs text-muted-foreground">@{user.username} · {post.timestamp}</span>
                    </div>
                    <p className="mt-2">{post.content}</p>
                    <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="photos">
          <Card className="mt-4">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">No photos to display</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos">
          <Card className="mt-4">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">No videos to display</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="likes">
          <Card className="mt-4">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">No liked posts to display</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfilePage
