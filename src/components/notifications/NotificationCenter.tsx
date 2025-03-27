
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Heart, MessageSquare, UserPlus, Star, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface NotificationProps {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'tag';
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  read: boolean;
  postId?: string;
}

const notificationIcons = {
  like: <Heart className="h-4 w-4 text-red-500" />,
  comment: <MessageSquare className="h-4 w-4 text-blue-500" />,
  follow: <UserPlus className="h-4 w-4 text-green-500" />,
  mention: <Star className="h-4 w-4 text-yellow-500" />,
  tag: <Bell className="h-4 w-4 text-purple-500" />
};

const NotificationItem: React.FC<NotificationProps & { onMarkAsRead: (id: string) => void }> = ({
  id, type, user, content, timestamp, read, onMarkAsRead
}) => {
  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors",
        !read && "bg-muted/30"
      )}
      onClick={() => !read && onMarkAsRead(id)}
    >
      <div className="relative mt-1">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
          <div className="rounded-full p-1 bg-muted">
            {notificationIcons[type]}
          </div>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium">{user.name}</span> {content}
        </p>
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </div>
      {!read && (
        <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
      )}
    </div>
  );
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([
    {
      id: '1',
      type: 'like',
      user: { id: '1', name: 'John Doe', avatar: '' },
      content: 'liked your post',
      timestamp: '5 minutes ago',
      read: false,
      postId: '123'
    },
    {
      id: '2',
      type: 'comment',
      user: { id: '2', name: 'Jane Smith', avatar: '' },
      content: 'commented on your post: "Great photo!"',
      timestamp: '2 hours ago',
      read: false,
      postId: '123'
    },
    {
      id: '3',
      type: 'follow',
      user: { id: '3', name: 'Mike Johnson', avatar: '' },
      content: 'started following you',
      timestamp: 'Yesterday',
      read: true
    },
    {
      id: '4',
      type: 'mention',
      user: { id: '4', name: 'Sarah Williams', avatar: '' },
      content: 'mentioned you in a comment',
      timestamp: '2 days ago',
      read: true,
      postId: '456'
    },
    {
      id: '5',
      type: 'tag',
      user: { id: '5', name: 'Alex Brown', avatar: '' },
      content: 'tagged you in a post',
      timestamp: '3 days ago',
      read: true,
      postId: '789'
    }
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">Notifications</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-3 p-1 m-3">
          <TabsTrigger value="all">
            All
            {unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
          <TabsTrigger value="follows">Follows</TabsTrigger>
        </TabsList>
        <CardContent className="p-0">
          <TabsContent value="all" className="max-h-[400px] overflow-y-auto mt-0">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  {...notification} 
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Bell className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>No notifications yet</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="mentions" className="max-h-[400px] overflow-y-auto mt-0">
            {notifications.filter(n => n.type === 'mention').length > 0 ? (
              notifications
                .filter(n => n.type === 'mention')
                .map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    {...notification} 
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Star className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>No mentions yet</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="follows" className="max-h-[400px] overflow-y-auto mt-0">
            {notifications.filter(n => n.type === 'follow').length > 0 ? (
              notifications
                .filter(n => n.type === 'follow')
                .map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    {...notification} 
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <UserPlus className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>No new followers yet</p>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default NotificationCenter;
