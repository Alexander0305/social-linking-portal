
import React, { useState } from 'react';
import { Search, Users, Lock, Globe, Shield, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  coverImage: string;
  privacy: 'public' | 'private' | 'closed';
  category: string;
  joined: boolean;
}

const privacyIcons = {
  'public': <Globe className="h-4 w-4" />,
  'private': <Lock className="h-4 w-4" />,
  'closed': <Shield className="h-4 w-4" />
};

const GroupCard: React.FC<{
  group: Group;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
}> = ({ group, onJoin, onLeave }) => {
  return (
    <Card className="overflow-hidden">
      <div 
        className="h-32 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${group.coverImage || 'https://via.placeholder.com/800x200'})` 
        }}
      />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{group.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              {privacyIcons[group.privacy]} 
              <span className="ml-1 capitalize">{group.privacy} Group</span>
              <span className="mx-1">•</span>
              <Users className="h-4 w-4" />
              <span className="ml-1">{group.members} members</span>
            </div>
          </div>
          {group.joined ? (
            <Button variant="outline" size="sm" onClick={() => onLeave(group.id)}>
              Joined
            </Button>
          ) : (
            <Button size="sm" onClick={() => onJoin(group.id)}>
              Join
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
        <div className="mt-2">
          <span className="inline-block px-2 py-1 bg-muted text-xs rounded-full">
            {group.category}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const GroupsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'Photography Enthusiasts',
      description: 'A group for anyone who loves photography. Share your photos, tips, and discuss equipment.',
      members: 2458,
      coverImage: 'https://via.placeholder.com/800x200',
      privacy: 'public',
      category: 'Photography',
      joined: false
    },
    {
      id: '2',
      name: 'Web Developers Unite',
      description: 'Connect with other web developers to share resources, job opportunities and collaborate on projects.',
      members: 1845,
      coverImage: 'https://via.placeholder.com/800x200',
      privacy: 'closed',
      category: 'Technology',
      joined: true
    },
    {
      id: '3',
      name: 'Healthy Recipes',
      description: 'Share your favorite healthy recipes and cooking tips for a healthier lifestyle.',
      members: 5621,
      coverImage: 'https://via.placeholder.com/800x200',
      privacy: 'public',
      category: 'Food & Drink',
      joined: false
    },
    {
      id: '4',
      name: 'Book Club',
      description: 'A place to discuss our monthly book selections and share recommendations.',
      members: 987,
      coverImage: 'https://via.placeholder.com/800x200',
      privacy: 'private',
      category: 'Books & Literature',
      joined: false
    },
    {
      id: '5',
      name: 'Digital Nomads',
      description: 'For remote workers who travel while working. Share tips on destinations, workspaces, and more.',
      members: 3215,
      coverImage: 'https://via.placeholder.com/800x200',
      privacy: 'public',
      category: 'Lifestyle',
      joined: false
    },
    {
      id: '6',
      name: 'Fitness Motivation',
      description: 'Support and motivate each other on our fitness journeys. Share workouts, progress, and advice.',
      members: 4102,
      coverImage: 'https://via.placeholder.com/800x200',
      privacy: 'closed',
      category: 'Fitness',
      joined: true
    }
  ]);

  const handleJoinGroup = (id: string) => {
    const group = groups.find(g => g.id === id);
    if (group) {
      setGroups(groups.map(g => 
        g.id === id ? { ...g, joined: true, members: g.members + 1 } : g
      ));
      toast({
        title: 'Group Joined',
        description: `You've successfully joined ${group.name}`,
      });
    }
  };

  const handleLeaveGroup = (id: string) => {
    const group = groups.find(g => g.id === id);
    if (group) {
      setGroups(groups.map(g => 
        g.id === id ? { ...g, joined: false, members: g.members - 1 } : g
      ));
      toast({
        title: 'Left Group',
        description: `You've left ${group.name}`,
      });
    }
  };

  const filteredGroups = searchQuery
    ? groups.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : groups;

  const myGroups = groups.filter(group => group.joined);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Groups</h1>
          <p className="text-muted-foreground">Discover and join groups of people with similar interests</p>
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Create New Group
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for groups..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="discover">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-groups">
            My Groups
            {myGroups.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                {myGroups.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="suggested">Suggested</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discover" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map(group => (
              <GroupCard 
                key={group.id} 
                group={group} 
                onJoin={handleJoinGroup} 
                onLeave={handleLeaveGroup} 
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="my-groups" className="mt-6">
          {myGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myGroups.map(group => (
                <GroupCard 
                  key={group.id} 
                  group={group} 
                  onJoin={handleJoinGroup} 
                  onLeave={handleLeaveGroup} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">You haven't joined any groups yet</h3>
              <p className="text-muted-foreground mb-4">Discover and join groups that match your interests</p>
              <Button onClick={() => document.querySelector('[data-value="discover"]')?.click()}>
                Discover Groups
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="suggested" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.filter(g => !g.joined).slice(0, 3).map(group => (
              <GroupCard 
                key={group.id} 
                group={group} 
                onJoin={handleJoinGroup} 
                onLeave={handleLeaveGroup} 
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupsDirectory;
