
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGroupById, getGroupPosts, getGroupMembers, isGroupMember, joinGroup, leaveGroup, createGroupPost } from '@/services/database';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { User, Users, Info, Image, Calendar } from 'lucide-react';
import PostCard from '@/components/post/PostCard';

const GroupDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [group, setGroup] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [membership, setMembership] = useState<{isMember: boolean; role?: string}>();
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const loadGroup = async () => {
      if (!id || !user) return;
      
      setLoading(true);
      try {
        // Fetch group details
        const { data: groupData } = await getGroupById(id);
        if (groupData) {
          setGroup(groupData);
          
          // Check membership
          const { isMember, role } = await isGroupMember(id, user.id);
          setMembership({ isMember, role });
          
          // Fetch posts if member or public group
          if (isMember || groupData.privacy === 'public') {
            const { data: postsData } = await getGroupPosts(id);
            if (postsData) {
              setPosts(postsData);
            }
          }
          
          // Fetch members
          const { data: membersData } = await getGroupMembers(id);
          if (membersData) {
            setMembers(membersData);
          }
        }
      } catch (error) {
        console.error('Error loading group:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGroup();
  }, [id, user]);

  const handleJoinLeave = async () => {
    if (!id || !user) return;
    
    try {
      if (membership?.isMember) {
        await leaveGroup(id, user.id);
        setMembership({ isMember: false });
      } else {
        await joinGroup(id, user.id);
        setMembership({ isMember: true, role: 'member' });
      }
    } catch (error) {
      console.error('Error joining/leaving group:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!id || !user || !postContent.trim() || !membership?.isMember) return;
    
    setIsPosting(true);
    try {
      const { data } = await createGroupPost(id, user.id, postContent);
      if (data) {
        setPosts([data[0], ...posts]);
        setPostContent('');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-6">
        <div className="animate-pulse">
          <div className="bg-muted h-48 rounded-lg mb-4"></div>
          <div className="flex gap-4 mb-6">
            <div className="bg-muted h-20 w-20 rounded-full"></div>
            <div className="flex-1">
              <div className="bg-muted h-6 w-1/3 rounded mb-2"></div>
              <div className="bg-muted h-4 w-3/4 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container py-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Group not found</h2>
        <p className="text-muted-foreground mb-4">The group you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button as={Link} to="/groups">Back to Groups</Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      {/* Cover and basic info */}
      <div 
        className="h-48 rounded-lg bg-cover bg-center mb-4 relative"
        style={{ 
          backgroundImage: `url(${group.cover || 'https://placehold.co/1200x400/e2e8f0/a0aec0?text=No+Cover'})` 
        }}
      >
        {/* Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg"></div>
        
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <div className="flex items-center text-sm mt-1">
            <span>{group.privacy.charAt(0).toUpperCase() + group.privacy.slice(1)} Group</span>
            <span className="mx-2">•</span>
            <span>{members.length} members</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src={group.avatar} alt={group.name} />
            <AvatarFallback>{group.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{group.name}</h2>
            <p className="text-muted-foreground">{group.category} • Created by {group.owner?.username}</p>
          </div>
        </div>
        
        <Button 
          variant={membership?.isMember ? "outline" : "default"}
          onClick={handleJoinLeave}
        >
          {membership?.isMember ? 'Leave Group' : 'Join Group'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="mb-6">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          {membership?.isMember ? (
            <div className="mb-6">
              <Textarea
                placeholder="Write something to the group..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="mb-2"
              />
              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Image className="h-4 w-4 mr-2" />
                  Add Media
                </Button>
                <Button 
                  disabled={!postContent.trim() || isPosting}
                  onClick={handleCreatePost}
                >
                  Post
                </Button>
              </div>
            </div>
          ) : group.privacy === 'private' ? (
            <div className="text-center py-8 bg-muted/30 rounded-lg mb-6">
              <h3 className="font-medium text-lg mb-2">Join this group to see posts</h3>
              <p className="text-muted-foreground mb-4">This is a private group. You need to be a member to see posts.</p>
              <Button onClick={handleJoinLeave}>Join Group</Button>
            </div>
          ) : null}
          
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <h3 className="font-medium text-lg mb-2">No posts yet</h3>
                <p className="text-muted-foreground">Be the first to post in this group!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="members">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center p-4 rounded-lg border">
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src={member.profiles?.avatar} alt={member.profiles?.username} />
                  <AvatarFallback>{member.profiles?.username?.substring(0, 2).toUpperCase() || 'UN'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{member.profiles?.full_name}</h4>
                  <p className="text-sm text-muted-foreground">@{member.profiles?.username}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground capitalize">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="about">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Description</h3>
              <p>{group.description || 'No description available.'}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Information</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Info className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span><strong>Privacy:</strong> {group.privacy.charAt(0).toUpperCase() + group.privacy.slice(1)}</span>
                </li>
                <li className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span><strong>Created:</strong> {new Date(group.created_at).toLocaleDateString()}</span>
                </li>
                <li className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span><strong>Owner:</strong> {group.owner?.full_name || group.owner?.username}</span>
                </li>
                <li className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span><strong>Members:</strong> {members.length}</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupDetailPage;
