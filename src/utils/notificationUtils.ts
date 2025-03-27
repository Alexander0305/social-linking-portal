
import { supabase } from '@/lib/supabase-config';
import { toast } from '@/components/ui/use-toast';

// Types of notifications
export type NotificationType = 
  | 'like' 
  | 'comment' 
  | 'follow' 
  | 'mention' 
  | 'tag' 
  | 'friend_request' 
  | 'group_invite' 
  | 'event_invite' 
  | 'page_invite' 
  | 'message';

export interface NotificationData {
  id: string;
  user_id: string;
  type: NotificationType;
  actor_id: string;
  entity_id?: string;
  content?: string;
  created_at: string;
  read: boolean;
  actors?: {
    username: string;
    full_name: string;
    avatar: string;
  };
}

// Subscribe to notifications for a user
export const subscribeToNotifications = (userId: string, callback: (notification: NotificationData) => void) => {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const notification = payload.new as NotificationData;
        
        // Get actor details
        supabase
          .from('profiles')
          .select('username, full_name, avatar')
          .eq('id', notification.actor_id)
          .single()
          .then(({ data }) => {
            if (data) {
              notification.actors = data;
              callback(notification);
              
              // Show toast for new notification
              showNotificationToast(notification);
            }
          });
      }
    )
    .subscribe();
};

// Show a toast notification
export const showNotificationToast = (notification: NotificationData) => {
  const actorName = notification.actors?.full_name || 'Someone';
  let message = '';
  
  switch (notification.type) {
    case 'like':
      message = `${actorName} liked your post`;
      break;
    case 'comment':
      message = `${actorName} commented on your post`;
      break;
    case 'follow':
      message = `${actorName} started following you`;
      break;
    case 'friend_request':
      message = `${actorName} sent you a friend request`;
      break;
    case 'message':
      message = `${actorName} sent you a message`;
      break;
    default:
      message = `You have a new notification from ${actorName}`;
  }
  
  toast({
    title: 'New Notification',
    description: message,
  });
};

// Format notification text for display
export const formatNotificationText = (notification: NotificationData): string => {
  const actorName = notification.actors?.full_name || 'Someone';
  
  switch (notification.type) {
    case 'like':
      return `${actorName} liked your post`;
    case 'comment':
      return `${actorName} commented on your post`;
    case 'follow':
      return `${actorName} started following you`;
    case 'mention':
      return `${actorName} mentioned you in a post`;
    case 'tag':
      return `${actorName} tagged you in a post`;
    case 'friend_request':
      return `${actorName} sent you a friend request`;
    case 'group_invite':
      return `${actorName} invited you to join a group`;
    case 'event_invite':
      return `${actorName} invited you to an event`;
    case 'page_invite':
      return `${actorName} invited you to like a page`;
    case 'message':
      return `${actorName} sent you a message`;
    default:
      return `You have a new notification`;
  }
};
