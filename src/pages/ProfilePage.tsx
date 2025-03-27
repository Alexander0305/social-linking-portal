
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarDays, MapPin, Link as LinkIcon, Edit, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import * as db from '@/services/database';
import PostCard from '@/components/post/PostCard';
import { format } from 'date-fns';

const ProfilePage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { userPosts, loadUserPosts } = useData();
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    following: 0,
    followers: 0
  });
  
  const isCurrentUser = id === 'me' || id === user?.id;
  const effectiveId = isCurrentUser ? user?.id : id;
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!effectiveId) return;
      
      setLoading(true);
      try {
        // Get user profile
        const { data, error } = await db.getUserProfile(effectiveId);
        if (error) throw error;
        
        if (data) {
          setProfileData(data);
          
          // Load user posts
          loadUserPosts(effectiveId);
          
          // Get follower/following counts
          const followersResult = await db.getFollowers(effectiveId);
          const followingResult = await db.getFollowing(effectiveId);
          
          setStats({
            followers: followersResult.data?.length || 0,
            following: followingResult.data?.length || 0
          });
          
          // Check if current user is following this profile
          if (user && user.id !== effectiveId) {
            const following = await db.getFollowing(user.id);
            setIsFollowing(following.data?.some((f: any) => f.following_id === effectiveId) || false);
          }
        }
      } catch (error: any) {
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProfileData();
    }
  }, [effectiveId, user]);

  const handleFollowClick = async () => {
    if (!user || !effectiveId) return;
    
    try {
      if (isFollowing) {
        await db.unfollowUser(user.id, effectiveId);
        setStats(prev => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        await db.followUser(user.id, effectiveId);
        setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
      }
      
      setIsFollowing(!isFollowing);
      
      toast({
        title: isFollowing ? "Unfollowed" : "Followed",
        description: isFollowing 
          ? `You unfollowed ${profileData?.full_name}`
          : `You are now following ${profileData?.full_name}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">User profile not found</p>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const joinDate = profileData.created_at 
    ? `Joined ${format(new Date(profileData.created_at), 'MMMM yyyy')}`
    : 'Recently joined';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="relative">
        <div 
          className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg"
          style={profileData.cover_photo ? { backgroundImage: `url(${profileData.cover_photo})`, backgroundSize: 'cover' } : {}}
        >
          {isCurrentUser && (
            <Button size="sm" variant="outline" className="absolute right-4 top-4 bg-background/60 backdrop-blur-sm">
              <ImageIcon className="mr-2 h-4 w-4" />
              Change Cover
            </Button>
          )}
        </div>
        
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row gap-6 -mt-12 relative">
            <Avatar className="h-24 w-24 ring-4 ring-background">
              <AvatarImage src={profileData.avatar || ""} alt={profileData.full_name} />
              <AvatarFallback className="text-xl">{profileData.full_name?.substring(0, 2).toUpperCase() || 'US'}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2 mt-4 md:mt-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{profileData.full_name}</h2>
                  <p className="text-muted-foreground">@{profileData.username}</p>
                </div>
                {isCurrentUser ? (
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
              
              <p>{profileData.bio || 'No bio yet'}</p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {profileData.location && (
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {profileData.location}
                  </div>
                )}
                {profileData.website && (
                  <div className="flex items-center">
                    <LinkIcon className="mr-1 h-4 w-4" />
                    <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {profileData.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  {joinDate}
                </div>
              </div>
              
              <div className="flex gap-4">
                <div>
                  <span className="font-semibold">{stats.following}</span>
                  <span className="text-muted-foreground ml-1">Following</span>
                </div>
                <div>
                  <span className="font-semibold">{stats.followers}</span>
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
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground mb-4">No posts yet</p>
                {isCurrentUser && (
                  <Button asChild>
                    <Link to="/">Create Your First Post</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
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
  );
};

export default ProfilePage;
