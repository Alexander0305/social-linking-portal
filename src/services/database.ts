
import { supabase } from '@/lib/supabase';

// Posts
export const createPost = async (userId: string, content: string, media?: string[], privacy = 'public', feeling?: string, location?: string, background?: string) => {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      content,
      media: media || [],
      privacy,
      feeling,
      location,
      background,
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const getPosts = async (limit = 10, startFrom = 0, filters = {}) => {
  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (username, full_name, avatar)
    `)
    .order('created_at', { ascending: false })
    .range(startFrom, startFrom + limit - 1);
  
  // Apply any filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query = query.eq(key, value);
    }
  });
  
  const { data, error } = await query;
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

export const deletePost = async (postId: string, userId: string) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId);
  
  return { error };
};

export const updatePost = async (postId: string, userId: string, updates: Record<string, any>) => {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .eq('user_id', userId)
    .select();
  
  return { data, error };
};

// Comments
export const createComment = async (postId: string, userId: string, content: string, parentId?: string) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: userId,
      content,
      parent_id: parentId,
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

export const deleteComment = async (commentId: string, userId: string) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);
  
  return { error };
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

export const hasUserLiked = async (postId: string, userId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId);
  
  return { hasLiked: (data && data.length > 0), error };
};

// Reactions (More advanced than likes - e.g., love, haha, wow)
export const addReaction = async (postId: string, userId: string, type: string) => {
  // First remove any existing reaction
  await supabase
    .from('reactions')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);
  
  // Then add the new reaction
  const { data, error } = await supabase
    .from('reactions')
    .insert({
      post_id: postId,
      user_id: userId,
      type,
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const getReactions = async (postId: string) => {
  const { data, error } = await supabase
    .from('reactions')
    .select(`
      *,
      profiles:user_id (username, full_name, avatar)
    `)
    .eq('post_id', postId);
  
  return { data, error };
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

export const getUserProfileByUsername = async (username: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
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

export const searchUsers = async (query: string, limit = 10) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
    .limit(limit);
  
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

export const getFriendship = async (user1Id: string, user2Id: string) => {
  const { data: following, error: followingError } = await supabase
    .from('followers')
    .select('*')
    .eq('follower_id', user1Id)
    .eq('following_id', user2Id);
  
  const { data: follower, error: followerError } = await supabase
    .from('followers')
    .select('*')
    .eq('follower_id', user2Id)
    .eq('following_id', user1Id);
  
  return {
    isFollowing: following && following.length > 0,
    isFollower: follower && follower.length > 0,
    isFriend: (following && following.length > 0) && (follower && follower.length > 0),
    followingError,
    followerError
  };
};

// Friend requests (WOWonder style)
export const sendFriendRequest = async (senderId: string, receiverId: string) => {
  const { data, error } = await supabase
    .from('friend_requests')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      status: 'pending',
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const respondToFriendRequest = async (requestId: string, status: 'accepted' | 'declined') => {
  const { data, error } = await supabase
    .from('friend_requests')
    .update({ status, updated_at: new Date() })
    .eq('id', requestId)
    .select();
  
  // If accepted, create mutual following relationship
  if (status === 'accepted' && data && data.length > 0) {
    const { sender_id, receiver_id } = data[0];
    
    await Promise.all([
      followUser(sender_id, receiver_id),
      followUser(receiver_id, sender_id)
    ]);
  }
  
  return { data, error };
};

export const getFriendRequests = async (userId: string, status?: 'pending' | 'accepted' | 'declined') => {
  let query = supabase
    .from('friend_requests')
    .select(`
      *,
      sender:sender_id (username, full_name, avatar),
      receiver:receiver_id (username, full_name, avatar)
    `)
    .eq('receiver_id', userId);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  return { data, error };
};

export const getSentFriendRequests = async (userId: string, status?: 'pending' | 'accepted' | 'declined') => {
  let query = supabase
    .from('friend_requests')
    .select(`
      *,
      sender:sender_id (username, full_name, avatar),
      receiver:receiver_id (username, full_name, avatar)
    `)
    .eq('sender_id', userId);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  return { data, error };
};

// Messages
export const sendMessage = async (senderId: string, receiverId: string, content: string, attachments?: string[]) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      attachments: attachments || [],
      created_at: new Date(),
      read: false
    })
    .select();
  
  return { data, error };
};

export const getConversation = async (user1Id: string, user2Id: string, limit = 50) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${user1Id},sender_id.eq.${user2Id}`)
    .or(`receiver_id.eq.${user1Id},receiver_id.eq.${user2Id}`)
    .order('created_at', { ascending: true })
    .limit(limit);
  
  return { data, error };
};

export const getUserConversations = async (userId: string) => {
  // This query gets the latest message from each conversation
  const { data, error } = await supabase
    .rpc('get_user_conversations', { user_id: userId });
  
  return { data, error };
};

export const markMessagesAsRead = async (conversationId: string, userId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .eq('receiver_id', userId)
    .eq('read', false);
  
  return { data, error };
};

// Groups
export const createGroup = async (
  name: string, 
  description: string, 
  ownerId: string, 
  privacy: 'public' | 'private' | 'closed' = 'public',
  category: string = 'General',
  cover?: string
) => {
  const { data, error } = await supabase
    .from('groups')
    .insert({
      name,
      description,
      owner_id: ownerId,
      privacy,
      category,
      cover,
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

export const getGroups = async (limit = 10, startFrom = 0, category?: string) => {
  let query = supabase
    .from('groups')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query.range(startFrom, startFrom + limit - 1);
  
  return { data, error };
};

export const getGroupById = async (groupId: string) => {
  const { data, error } = await supabase
    .from('groups')
    .select(`
      *,
      owner:owner_id (username, full_name, avatar)
    `)
    .eq('id', groupId)
    .single();
  
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

export const getGroupMembers = async (groupId: string) => {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      *,
      profiles:user_id (username, full_name, avatar)
    `)
    .eq('group_id', groupId);
  
  return { data, error };
};

export const isGroupMember = async (groupId: string, userId: string) => {
  const { data, error } = await supabase
    .from('group_members')
    .select('*')
    .eq('group_id', groupId)
    .eq('user_id', userId);
  
  return { isMember: (data && data.length > 0), role: data?.[0]?.role, error };
};

// Group posts
export const createGroupPost = async (groupId: string, userId: string, content: string, media?: string[]) => {
  const { data, error } = await supabase
    .from('group_posts')
    .insert({
      group_id: groupId,
      user_id: userId,
      content,
      media: media || [],
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const getGroupPosts = async (groupId: string, limit = 10, startFrom = 0) => {
  const { data, error } = await supabase
    .from('group_posts')
    .select(`
      *,
      profiles:user_id (username, full_name, avatar),
      groups:group_id (name)
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })
    .range(startFrom, startFrom + limit - 1);
  
  return { data, error };
};

// Notifications
export const createNotification = async (
  userId: string,
  type: 'like' | 'comment' | 'follow' | 'mention' | 'tag' | 'friend_request' | 'group_invite',
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

// Stories (Sngine feature)
export const createStory = async (userId: string, media: string, text?: string, background?: string, fontColor?: string, duration = 24) => {
  const { data, error } = await supabase
    .from('stories')
    .insert({
      user_id: userId,
      media,
      text,
      background,
      font_color: fontColor,
      created_at: new Date(),
      expires_at: new Date(Date.now() + (duration * 60 * 60 * 1000)) // Hours to milliseconds
    })
    .select();
  
  return { data, error };
};

export const getStories = async (userId: string, includeExpired = false) => {
  let query = supabase
    .from('stories')
    .select(`
      *,
      profiles:user_id (username, full_name, avatar)
    `);
  
  if (!includeExpired) {
    query = query.gt('expires_at', new Date().toISOString());
  }
  
  // Get stories from the user and the users they follow
  const { data: following } = await getFollowing(userId);
  if (following && following.length > 0) {
    const followingIds = following.map((f: any) => f.following_id);
    query = query.in('user_id', [userId, ...followingIds]);
  } else {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  return { data, error };
};

export const getUserStories = async (userId: string, includeExpired = false) => {
  let query = supabase
    .from('stories')
    .select(`
      *,
      profiles:user_id (username, full_name, avatar)
    `)
    .eq('user_id', userId);
  
  if (!includeExpired) {
    query = query.gt('expires_at', new Date().toISOString());
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  return { data, error };
};

export const viewStory = async (storyId: string, viewerId: string) => {
  // Check if already viewed
  const { data: existingView } = await supabase
    .from('story_views')
    .select('*')
    .eq('story_id', storyId)
    .eq('viewer_id', viewerId);
  
  if (!existingView || existingView.length === 0) {
    const { data, error } = await supabase
      .from('story_views')
      .insert({
        story_id: storyId,
        viewer_id: viewerId,
        viewed_at: new Date()
      })
      .select();
    
    return { data, error };
  }
  
  return { data: existingView, error: null };
};

export const getStoryViews = async (storyId: string) => {
  const { data, error } = await supabase
    .from('story_views')
    .select(`
      *,
      profiles:viewer_id (username, full_name, avatar)
    `)
    .eq('story_id', storyId)
    .order('viewed_at', { ascending: false });
  
  return { data, error };
};

// Pages (Sngine and WOWonder feature)
export const createPage = async (
  ownerId: string,
  name: string,
  category: string,
  description?: string,
  website?: string,
  avatar?: string,
  cover?: string
) => {
  const { data, error } = await supabase
    .from('pages')
    .insert({
      owner_id: ownerId,
      name,
      category,
      description,
      website,
      avatar,
      cover,
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const getPages = async (limit = 10, startFrom = 0, category?: string) => {
  let query = supabase
    .from('pages')
    .select(`
      *,
      owner:owner_id (username, full_name, avatar)
    `)
    .order('created_at', { ascending: false });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query.range(startFrom, startFrom + limit - 1);
  
  return { data, error };
};

export const getPageById = async (pageId: string) => {
  const { data, error } = await supabase
    .from('pages')
    .select(`
      *,
      owner:owner_id (username, full_name, avatar)
    `)
    .eq('id', pageId)
    .single();
  
  return { data, error };
};

export const likePage = async (pageId: string, userId: string) => {
  const { data, error } = await supabase
    .from('page_likes')
    .insert({
      page_id: pageId,
      user_id: userId,
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const unlikePage = async (pageId: string, userId: string) => {
  const { error } = await supabase
    .from('page_likes')
    .delete()
    .eq('page_id', pageId)
    .eq('user_id', userId);
  
  return { error };
};

export const getPageLikes = async (pageId: string) => {
  const { count, error } = await supabase
    .from('page_likes')
    .select('count', { count: 'exact' })
    .eq('page_id', pageId);
  
  return { count, error };
};

export const hasUserLikedPage = async (pageId: string, userId: string) => {
  const { data, error } = await supabase
    .from('page_likes')
    .select('*')
    .eq('page_id', pageId)
    .eq('user_id', userId);
  
  return { hasLiked: (data && data.length > 0), error };
};

// Events (WOWonder feature)
export const createEvent = async (
  creatorId: string,
  title: string,
  description: string,
  location: string,
  startTime: Date,
  endTime: Date,
  privacy: 'public' | 'private' = 'public',
  cover?: string
) => {
  const { data, error } = await supabase
    .from('events')
    .insert({
      creator_id: creatorId,
      title,
      description,
      location,
      start_time: startTime,
      end_time: endTime,
      privacy,
      cover,
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const getEvents = async (limit = 10, startFrom = 0, past = false) => {
  const now = new Date().toISOString();
  let query = supabase
    .from('events')
    .select(`
      *,
      creator:creator_id (username, full_name, avatar)
    `);
  
  if (past) {
    query = query.lt('end_time', now);
  } else {
    query = query.gt('start_time', now);
  }
  
  const { data, error } = await query
    .order('start_time', { ascending: !past })
    .range(startFrom, startFrom + limit - 1);
  
  return { data, error };
};

export const getEventById = async (eventId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      creator:creator_id (username, full_name, avatar)
    `)
    .eq('id', eventId)
    .single();
  
  return { data, error };
};

export const respondToEvent = async (eventId: string, userId: string, response: 'going' | 'interested' | 'not_going') => {
  // Remove any existing response
  await supabase
    .from('event_responses')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId);
  
  // Add new response
  const { data, error } = await supabase
    .from('event_responses')
    .insert({
      event_id: eventId,
      user_id: userId,
      response,
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const getEventResponses = async (eventId: string, response?: 'going' | 'interested' | 'not_going') => {
  let query = supabase
    .from('event_responses')
    .select(`
      *,
      profiles:user_id (username, full_name, avatar)
    `)
    .eq('event_id', eventId);
  
  if (response) {
    query = query.eq('response', response);
  }
  
  const { data, error } = await query;
  
  return { data, error };
};

export const getUserEventResponse = async (eventId: string, userId: string) => {
  const { data, error } = await supabase
    .from('event_responses')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single();
  
  return { response: data?.response, error };
};

// Marketplace (Sngine and WOWonder feature)
export const createProduct = async (
  sellerId: string,
  title: string,
  description: string,
  price: number,
  currency: string = 'USD',
  category: string,
  location?: string,
  images: string[] = [],
  status: 'active' | 'sold' | 'inactive' = 'active'
) => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      seller_id: sellerId,
      title,
      description,
      price,
      currency,
      category,
      location,
      images,
      status,
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const getProducts = async (limit = 10, startFrom = 0, filters: Record<string, any> = {}) => {
  let query = supabase
    .from('products')
    .select(`
      *,
      seller:seller_id (username, full_name, avatar)
    `)
    .order('created_at', { ascending: false });
  
  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      if (key === 'min_price') {
        query = query.gte('price', value);
      } else if (key === 'max_price') {
        query = query.lte('price', value);
      } else {
        query = query.eq(key, value);
      }
    }
  });
  
  const { data, error } = await query.range(startFrom, startFrom + limit - 1);
  
  return { data, error };
};

export const getProductById = async (productId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      seller:seller_id (username, full_name, avatar)
    `)
    .eq('id', productId)
    .single();
  
  return { data, error };
};

// Blogs (WOWonder feature)
export const createBlogPost = async (
  authorId: string,
  title: string,
  content: string,
  cover?: string,
  tags: string[] = [],
  categories: string[] = []
) => {
  const { data, error } = await supabase
    .from('blogs')
    .insert({
      author_id: authorId,
      title,
      content,
      cover,
      tags,
      categories,
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const getBlogPosts = async (limit = 10, startFrom = 0, category?: string) => {
  let query = supabase
    .from('blogs')
    .select(`
      *,
      author:author_id (username, full_name, avatar)
    `)
    .order('created_at', { ascending: false });
  
  if (category) {
    query = query.contains('categories', [category]);
  }
  
  const { data, error } = await query.range(startFrom, startFrom + limit - 1);
  
  return { data, error };
};

export const getBlogPostById = async (blogId: string) => {
  const { data, error } = await supabase
    .from('blogs')
    .select(`
      *,
      author:author_id (username, full_name, avatar)
    `)
    .eq('id', blogId)
    .single();
  
  return { data, error };
};

// Forums (WOWonder feature)
export const createForumThread = async (
  authorId: string,
  title: string,
  content: string,
  forumId: string
) => {
  const { data, error } = await supabase
    .from('forum_threads')
    .insert({
      author_id: authorId,
      title,
      content,
      forum_id: forumId,
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const getForumThreads = async (forumId: string, limit = 10, startFrom = 0) => {
  const { data, error } = await supabase
    .from('forum_threads')
    .select(`
      *,
      author:author_id (username, full_name, avatar)
    `)
    .eq('forum_id', forumId)
    .order('created_at', { ascending: false })
    .range(startFrom, startFrom + limit - 1);
  
  return { data, error };
};

export const getForumThreadById = async (threadId: string) => {
  const { data, error } = await supabase
    .from('forum_threads')
    .select(`
      *,
      author:author_id (username, full_name, avatar)
    `)
    .eq('id', threadId)
    .single();
  
  return { data, error };
};

export const createForumReply = async (
  authorId: string,
  threadId: string,
  content: string
) => {
  const { data, error } = await supabase
    .from('forum_replies')
    .insert({
      author_id: authorId,
      thread_id: threadId,
      content,
      created_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const getForumReplies = async (threadId: string, limit = 10, startFrom = 0) => {
  const { data, error } = await supabase
    .from('forum_replies')
    .select(`
      *,
      author:author_id (username, full_name, avatar)
    `)
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })
    .range(startFrom, startFrom + limit - 1);
  
  return { data, error };
};

// Search
export const search = async (query: string, type?: 'users' | 'posts' | 'groups' | 'pages' | 'events' | 'products', limit = 10) => {
  if (!query) return { data: [], error: null };
  
  let results: any[] = [];
  let error = null;
  
  if (!type || type === 'users') {
    const { data: users, error: usersError } = await searchUsers(query, limit);
    if (usersError) error = usersError;
    if (users) results = [...results, ...users.map(u => ({ ...u, type: 'user' }))];
  }
  
  // Add more search types as needed
  
  return { data: results, error };
};
