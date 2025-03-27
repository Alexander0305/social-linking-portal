
import { supabase } from '@/lib/supabase';

// Posts
export const createPost = async (userId: string, content: string, media?: string[]) => {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      content,
      media: media || [],
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const getPosts = async (limit = 10, startFrom = 0) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (username, full_name, avatar)
    `)
    .order('created_at', { ascending: false })
    .range(startFrom, startFrom + limit - 1);
  
  return { data, error };
};

export const getUserPosts = async (userId: string, limit = 10, startFrom = 0) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (username, full_name, avatar)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(startFrom, startFrom + limit - 1);
  
  return { data, error };
};

// Comments
export const createComment = async (postId: string, userId: string, content: string) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: userId,
      content,
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const getComments = async (postId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (username, full_name, avatar)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  
  return { data, error };
};

// Likes
export const toggleLike = async (postId: string, userId: string) => {
  // Check if already liked
  const { data: existingLike } = await supabase
    .from('likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();
  
  if (existingLike) {
    // Unlike if already liked
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    
    return { data: null, error, action: 'unliked' };
  } else {
    // Like if not liked
    const { data, error } = await supabase
      .from('likes')
      .insert({
        post_id: postId,
        user_id: userId,
        created_at: new Date()
      })
      .select();
    
    return { data, error, action: 'liked' };
  }
};

export const getLikes = async (postId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .select('count', { count: 'exact' })
    .eq('post_id', postId);
  
  return { count: data?.[0]?.count || 0, error };
};

// User profiles
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: Record<string, any>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();
  
  return { data, error };
};

// Friends/Followers
export const followUser = async (followerId: string, followingId: string) => {
  const { data, error } = await supabase
    .from('followers')
    .insert({
      follower_id: followerId,
      following_id: followingId,
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const { error } = await supabase
    .from('followers')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);
  
  return { error };
};

export const getFollowers = async (userId: string) => {
  const { data, error } = await supabase
    .from('followers')
    .select(`
      follower_id,
      profiles:follower_id (username, full_name, avatar)
    `)
    .eq('following_id', userId);
  
  return { data, error };
};

export const getFollowing = async (userId: string) => {
  const { data, error } = await supabase
    .from('followers')
    .select(`
      following_id,
      profiles:following_id (username, full_name, avatar)
    `)
    .eq('follower_id', userId);
  
  return { data, error };
};

// Messages
export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      created_at: new Date(),
      read: false
    })
    .select();
  
  return { data, error };
};

export const getConversation = async (user1Id: string, user2Id: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${user1Id},sender_id.eq.${user2Id}`)
    .or(`receiver_id.eq.${user1Id},receiver_id.eq.${user2Id}`)
    .order('created_at', { ascending: true });
  
  return { data, error };
};

export const getUserConversations = async (userId: string) => {
  // This query gets the latest message from each conversation
  const { data, error } = await supabase
    .rpc('get_user_conversations', { user_id: userId });
  
  return { data, error };
};

// Groups
export const createGroup = async (
  name: string, 
  description: string, 
  ownerId: string, 
  privacy: 'public' | 'private' | 'closed' = 'public',
  category: string = 'General'
) => {
  const { data, error } = await supabase
    .from('groups')
    .insert({
      name,
      description,
      owner_id: ownerId,
      privacy,
      category,
      created_at: new Date()
    })
    .select();
  
  if (data && !error) {
    // Add owner as a member
    await supabase
      .from('group_members')
      .insert({
        group_id: data[0].id,
        user_id: ownerId,
        role: 'owner',
        joined_at: new Date()
      });
  }
  
  return { data, error };
};

export const getGroups = async (limit = 10, startFrom = 0) => {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('created_at', { ascending: false })
    .range(startFrom, startFrom + limit - 1);
  
  return { data, error };
};

export const joinGroup = async (groupId: string, userId: string) => {
  const { data, error } = await supabase
    .from('group_members')
    .insert({
      group_id: groupId,
      user_id: userId,
      role: 'member',
      joined_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const leaveGroup = async (groupId: string, userId: string) => {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId);
  
  return { error };
};

// Notifications
export const createNotification = async (
  userId: string,
  type: 'like' | 'comment' | 'follow' | 'mention' | 'tag',
  actorId: string,
  entityId?: string,
  content?: string
) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      actor_id: actorId,
      entity_id: entityId,
      content,
      created_at: new Date(),
      read: false
    })
    .select();
  
  return { data, error };
};

export const getNotifications = async (userId: string, limit = 20) => {
  const { data, error } = await supabase
    .from('notifications')
    .select(`
      *,
      actors:actor_id (username, full_name, avatar)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return { data, error };
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select();
  
  return { data, error };
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
    .select();
  
  return { data, error };
};
