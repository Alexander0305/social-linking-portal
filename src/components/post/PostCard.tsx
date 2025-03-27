
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, MessageSquare, Share2, MoreHorizontal, Image } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostCardProps {
  post: any;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const { likes, comments, toggleLikePost, addComment, loadComments } = useData();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  const isLikedByUser = false; // This would need to be calculated from the backend
  const postDate = new Date(post.created_at);
  const formattedDate = format(postDate, 'MMM d, yyyy • h:mm a');
  
  const handleToggleLike = () => {
    toggleLikePost(post.id);
  };
  
  const handleToggleComments = () => {
    if (!showComments) {
      loadComments(post.id);
    }
    setShowComments(!showComments);
  };
  
  const handleSubmitComment = async () => {
    if (newComment.trim()) {
      await addComment(post.id, newComment);
      setNewComment('');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={post.profiles?.avatar || ''} alt={post.profiles?.full_name || 'User'} />
              <AvatarFallback>
                {post.profiles?.full_name?.substring(0, 2).toUpperCase() || 'US'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">
                {post.profiles?.full_name || 'Unknown User'}
              </div>
              <div className="text-xs text-muted-foreground">
                @{post.profiles?.username || 'user'} • {formattedDate}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user?.id === post.user_id ? (
                <>
                  <DropdownMenuItem>Edit Post</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete Post</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>Report Post</DropdownMenuItem>
                  <DropdownMenuItem>Hide Posts from this User</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="whitespace-pre-line">{post.content}</p>
        
        {post.media && post.media.length > 0 && (
          <div className="mt-3">
            {/* In a real app, we would render images/videos here */}
            <div className="bg-muted rounded-md h-48 flex items-center justify-center">
              <Image className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Media content</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleToggleLike}
          className={isLikedByUser ? "text-red-500" : ""}
        >
          <Heart className={`mr-1 h-4 w-4 ${isLikedByUser ? "fill-current" : ""}`} />
          <span className="text-xs">{likes[post.id] || 0}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleToggleComments}
        >
          <MessageSquare className="mr-1 h-4 w-4" />
          <span className="text-xs">{(comments[post.id] || []).length}</span>
        </Button>
        
        <Button variant="ghost" size="sm">
          <Share2 className="mr-1 h-4 w-4" />
          <span className="text-xs">Share</span>
        </Button>
      </CardFooter>
      
      {showComments && (
        <div className="px-4 pb-4 space-y-4">
          <div className="space-y-3">
            {(comments[post.id] || []).map((comment: any) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.profiles?.avatar || ''} alt={comment.profiles?.full_name || 'User'} />
                  <AvatarFallback>
                    {comment.profiles?.full_name?.substring(0, 2).toUpperCase() || 'US'}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-2 rounded-md text-sm flex-1">
                  <div className="font-medium text-xs">
                    {comment.profiles?.full_name || 'Unknown User'} • {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar || ''} alt={user?.user_metadata?.full_name || 'User'} />
              <AvatarFallback>
                {user?.user_metadata?.full_name?.substring(0, 2).toUpperCase() || 'ME'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex">
              <Textarea 
                placeholder="Write a comment..." 
                className="min-h-0 h-8 resize-none flex-1"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <Button 
                size="sm" 
                className="ml-2" 
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PostCard;
