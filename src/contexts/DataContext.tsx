
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import * as db from '@/services/database';
import { useToast } from '@/components/ui/use-toast';

interface DataContextType {
  posts: any[];
  userPosts: any[];
  comments: Record<string, any[]>;
  likes: Record<string, number>;
  notifications: any[];
  isLoading: boolean;
  loadPosts: (limit?: number, startFrom?: number) => Promise<void>;
  loadUserPosts: (userId: string) => Promise<void>;
  createPost: (content: string, media?: string[]) => Promise<any>;
  toggleLikePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<any>;
  loadComments: (postId: string) => Promise<void>;
  loadNotifications: () => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load posts from the database
  const loadPosts = async (limit = 10, startFrom = 0) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await db.getPosts(limit, startFrom);
      if (error) throw error;
      
      setPosts(prevPosts => 
        startFrom === 0 
          ? data || [] 
          : [...prevPosts, ...(data || [])]
      );
      
      // Load like counts for each post
      if (data) {
        data.forEach(async (post) => {
          const { count } = await db.getLikes(post.id);
          setLikes(prev => ({ ...prev, [post.id]: count }));
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading posts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load user's posts
  const loadUserPosts = async (userId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await db.getUserPosts(userId);
      if (error) throw error;
      
      setUserPosts(data || []);
      
      // Load like counts for each post
      if (data) {
        data.forEach(async (post) => {
          const { count } = await db.getLikes(post.id);
          setLikes(prev => ({ ...prev, [post.id]: count }));
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading user posts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new post
  const createPost = async (content: string, media?: string[]) => {
    if (!user) return null;

    setIsLoading(true);
    try {
      const { data, error } = await db.createPost(user.id, content, media);
      if (error) throw error;
      
      // Add the new post to the posts array
      if (data) {
        setPosts(prev => [
          { 
            ...data[0], 
            profiles: { 
              username: user.user_metadata.username,
              full_name: user.user_metadata.full_name,
              avatar: user.user_metadata.avatar
            } 
          }, 
          ...prev
        ]);
      }
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });
      
      return data?.[0] || null;
    } catch (error: any) {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle like on a post
  const toggleLikePost = async (postId: string) => {
    if (!user) return;

    try {
      const { action, error } = await db.toggleLike(postId, user.id);
      if (error) throw error;
      
      // Update like count
      setLikes(prev => ({
        ...prev,
        [postId]: action === 'liked' ? (prev[postId] || 0) + 1 : (prev[postId] || 1) - 1
      }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Add a comment to a post
  const addComment = async (postId: string, content: string) => {
    if (!user) return null;

    try {
      const { data, error } = await db.createComment(postId, user.id, content);
      if (error) throw error;
      
      // Add the new comment to the comments array
      if (data) {
        setComments(prev => ({
          ...prev,
          [postId]: [
            ...(prev[postId] || []),
            { 
              ...data[0], 
              profiles: { 
                username: user.user_metadata.username,
                full_name: user.user_metadata.full_name,
                avatar: user.user_metadata.avatar
              } 
            }
          ]
        }));
      }
      
      return data?.[0] || null;
    } catch (error: any) {
      toast({
        title: "Error adding comment",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  // Load comments for a post
  const loadComments = async (postId: string) => {
    if (!user) return;

    try {
      const { data, error } = await db.getComments(postId);
      if (error) throw error;
      
      if (data) {
        setComments(prev => ({
          ...prev,
          [postId]: data
        }));
      }
    } catch (error: any) {
      toast({
        title: "Error loading comments",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Load notifications
  const loadNotifications = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await db.getNotifications(user.id);
      if (error) throw error;
      
      setNotifications(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading notifications",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a notification as read
  const markNotificationRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await db.markNotificationAsRead(notificationId);
      if (error) throw error;
      
      // Update the notification in the state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error: any) {
      toast({
        title: "Error marking notification as read",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Mark all notifications as read
  const markAllNotificationsRead = async () => {
    if (!user) return;

    try {
      const { error } = await db.markAllNotificationsAsRead(user.id);
      if (error) throw error;
      
      // Update all notifications in the state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error: any) {
      toast({
        title: "Error marking notifications as read",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Initial data loading
  useEffect(() => {
    if (user) {
      loadPosts();
      loadNotifications();
    }
  }, [user]);

  const value = {
    posts,
    userPosts,
    comments,
    likes,
    notifications,
    isLoading,
    loadPosts,
    loadUserPosts,
    createPost,
    toggleLikePost,
    addComment,
    loadComments,
    loadNotifications,
    markNotificationRead,
    markAllNotificationsRead,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
