
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SuggestedFriend {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  profession?: string;
}

const FriendSuggestionCard: React.FC<{
  friend: SuggestedFriend;
  onAdd: (id: string) => void;
  onIgnore: (id: string) => void;
}> = ({ friend, onAdd, onIgnore }) => {
  return (
    <div className="flex items-center gap-3 p-3 mb-2 last:mb-0">
      <Avatar className="h-12 w-12">
        <AvatarImage src={friend.avatar} alt={friend.name} />
        <AvatarFallback>{friend.name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">{friend.name}</h3>
        <p className="text-xs text-muted-foreground truncate">
          {friend.profession && `${friend.profession} • `}
          {friend.mutualFriends} mutual friends
        </p>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={() => onIgnore(friend.id)}>
          <X className="h-4 w-4" />
        </Button>
        <Button size="sm" onClick={() => onAdd(friend.id)}>
          <UserPlus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
};

const FriendSuggestions: React.FC = () => {
  const [suggestedFriends, setSuggestedFriends] = React.useState<SuggestedFriend[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: '',
      mutualFriends: 12,
      profession: 'Designer'
    },
    {
      id: '2',
      name: 'Samantha Lee',
      avatar: '',
      mutualFriends: 8,
      profession: 'Developer'
    },
    {
      id: '3',
      name: 'Michael Brown',
      avatar: '',
      mutualFriends: 5
    },
    {
      id: '4',
      name: 'Emily Davis',
      avatar: '',
      mutualFriends: 3,
      profession: 'Photographer'
    }
  ]);

  const { toast } = useToast();

  const handleAddFriend = (id: string) => {
    const friend = suggestedFriends.find(f => f.id === id);
    setSuggestedFriends(suggestedFriends.filter(f => f.id !== id));
    
    if (friend) {
      toast({
        title: 'Friend request sent',
        description: `You sent a friend request to ${friend.name}`,
      });
    }
  };

  const handleIgnoreSuggestion = (id: string) => {
    setSuggestedFriends(suggestedFriends.filter(f => f.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">People You May Know</CardTitle>
      </CardHeader>
      <CardContent>
        {suggestedFriends.length > 0 ? (
          suggestedFriends.map(friend => (
            <FriendSuggestionCard
              key={friend.id}
              friend={friend}
              onAdd={handleAddFriend}
              onIgnore={handleIgnoreSuggestion}
            />
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No more suggestions available right now.</p>
            <Button variant="link" className="mt-2">Refresh suggestions</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendSuggestions;
