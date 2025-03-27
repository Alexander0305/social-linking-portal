
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CandlestickChart, Gift, Home, Search, Settings, User, Users, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import FriendSuggestions from '@/components/friends/FriendSuggestions';
import WeatherWidget from '@/components/widgets/WeatherWidget';

const RightSidebar = () => {
  const { user } = useAuth();

  // Trending topics mock data
  const trendingTopics = [
    { id: 1, tag: '#NewYear2023', postCount: 12500 },
    { id: 2, tag: '#WorldCup', postCount: 10300 },
    { id: 3, tag: '#AI', postCount: 8900 },
    { id: 4, tag: '#ClimateChange', postCount: 7200 },
    { id: 5, tag: '#Olympics', postCount: 5800 },
  ];

  // Upcoming events mock data
  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Conference 2023',
      date: 'Aug 25',
      attendees: 128,
    },
    {
      id: 2,
      title: 'Community Meetup',
      date: 'Aug 27',
      attendees: 45,
    },
  ];

  // Birthdays mock data
  const birthdays = [
    {
      id: 1,
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: 2,
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
  ];

  return (
    <aside className="hidden xl:block w-[350px] h-full overflow-auto p-4 pt-20 border-l">
      {user && (
        <div className="space-y-4">
          <div className="sticky top-20">
            <WeatherWidget />

            <div className="mt-6">
              <FriendSuggestions />
            </div>

            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Trending Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {trendingTopics.map((topic) => (
                  <div key={topic.id} className="flex justify-between items-center">
                    <a href={`/search?q=${topic.tag}`} className="text-sm font-medium hover:underline">
                      {topic.tag}
                    </a>
                    <span className="text-xs text-muted-foreground">{topic.postCount.toLocaleString()} posts</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex gap-3 items-start">
                    <div className="bg-primary/10 text-primary p-2 rounded-md flex flex-col items-center min-w-12">
                      <span className="text-xs font-medium">{event.date.split(' ')[0]}</span>
                      <span className="text-sm font-bold">{event.date.split(' ')[1]}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{event.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <Users className="h-3 w-3 mr-1" />
                        {event.attendees} attending
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Events
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Gift className="h-4 w-4 mr-2 text-primary" />
                  Birthdays Today
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {birthdays.map((user) => (
                  <div key={user.id} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                    </div>
                  </div>
                ))}
                {birthdays.length > 0 && (
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    Send Wishes
                  </Button>
                )}
                {birthdays.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    No birthdays today
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Marketplace</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <a
                    key={item}
                    href="/marketplace"
                    className="aspect-square rounded-md bg-muted flex items-center justify-center relative group overflow-hidden"
                  >
                    <img
                      src={`https://picsum.photos/id/${item + 40}/200/200`}
                      alt="Product"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                      <p className="text-xs text-white font-medium truncate">$25.99</p>
                    </div>
                  </a>
                ))}
                <Button variant="outline" size="sm" className="col-span-2 mt-2">
                  View Marketplace
                </Button>
              </CardContent>
            </Card>

            <div className="mt-6 text-xs text-muted-foreground">
              <div className="flex flex-wrap gap-2">
                <a href="#" className="hover:underline">About</a>
                <span>·</span>
                <a href="#" className="hover:underline">Privacy</a>
                <span>·</span>
                <a href="#" className="hover:underline">Terms</a>
                <span>·</span>
                <a href="#" className="hover:underline">Cookies</a>
                <span>·</span>
                <a href="#" className="hover:underline">Advertising</a>
                <span>·</span>
                <a href="#" className="hover:underline">Help</a>
              </div>
              <p className="mt-2">© 2023 SocialApp</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default RightSidebar;
