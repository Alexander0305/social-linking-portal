
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { search, searchUsers, getPosts } from '@/services/database';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon, Users, MessageSquare, Video, Image, FileText, Tag, MapPin, ShoppingBag } from 'lucide-react';
import PostCard from '@/components/post/PostCard';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      let results: any[] = [];
      
      // Perform search based on active tab
      switch (activeTab) {
        case 'users':
          const { data: users } = await searchUsers(query);
          results = users?.map(user => ({ ...user, type: 'user' })) || [];
          break;
        case 'posts':
          const { data: posts } = await getPosts();
          results = posts?.filter((post: any) => 
            post.content.toLowerCase().includes(query.toLowerCase())
          ).map((post: any) => ({ ...post, type: 'post' })) || [];
          break;
        default:
          // Generic search across multiple types
          const { data } = await search(query);
          results = data || [];
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      performSearch(searchQuery);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            className="pl-10 py-6 text-lg"
            placeholder="Search people, posts, and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            className="absolute right-1 top-1"
          >
            Search
          </Button>
        </div>
      </form>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid grid-cols-4 sm:grid-cols-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="users">People</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          {renderSearchResults()}
        </TabsContent>
        
        <TabsContent value="users" className="pt-4">
          {renderUserResults()}
        </TabsContent>
        
        <TabsContent value="posts" className="pt-4">
          {renderPostResults()}
        </TabsContent>
        
        <TabsContent value="groups" className="pt-4">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Group search results</h3>
            <p className="text-muted-foreground">Search for groups will be implemented soon.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="pages" className="pt-4">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Page search results</h3>
            <p className="text-muted-foreground">Search for pages will be implemented soon.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="marketplace" className="pt-4">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Marketplace search results</h3>
            <p className="text-muted-foreground">Search for marketplace items will be implemented soon.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="pt-4">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Event search results</h3>
            <p className="text-muted-foreground">Search for events will be implemented soon.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="blogs" className="pt-4">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Blog search results</h3>
            <p className="text-muted-foreground">Search for blog posts will be implemented soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderSearchResults() {
    if (loading) {
      return (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-muted h-20 rounded-lg"></div>
          ))}
        </div>
      );
    }
    
    if (searchResults.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground">Try different keywords or check your spelling.</p>
        </div>
      );
    }
    
    // Group results by type
    const userResults = searchResults.filter(r => r.type === 'user');
    const postResults = searchResults.filter(r => r.type === 'post');
    
    return (
      <div className="space-y-8">
        {userResults.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">People</h2>
              <Button variant="ghost" size="sm" as={Link} to={`?q=${searchQuery}&tab=users`}>
                See all
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userResults.slice(0, 4).map(renderUserCard)}
            </div>
          </div>
        )}
        
        {postResults.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Posts</h2>
              <Button variant="ghost" size="sm" as={Link} to={`?q=${searchQuery}&tab=posts`}>
                See all
              </Button>
            </div>
            <div className="space-y-4">
              {postResults.slice(0, 3).map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderUserResults() {
    if (loading) {
      return (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-muted h-24 rounded-lg"></div>
          ))}
        </div>
      );
    }
    
    const userResults = searchResults.filter(r => r.type === 'user');
    
    if (userResults.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No people found</h3>
          <p className="text-muted-foreground">Try different keywords or check your spelling.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userResults.map(renderUserCard)}
      </div>
    );
  }

  function renderUserCard(user: any) {
    return (
      <div key={user.id} className="flex items-center p-4 rounded-lg border">
        <Avatar className="h-14 w-14 mr-4">
          <AvatarImage src={user.avatar} alt={user.username || user.full_name} />
          <AvatarFallback>{(user.full_name || user.username || 'User').substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-medium">{user.full_name}</h4>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
          <div className="text-xs text-muted-foreground mt-1">
            {user.bio ? (
              <span className="line-clamp-1">{user.bio}</span>
            ) : (
              <span>No bio available</span>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/profile/${user.id}`}>View</Link>
        </Button>
      </div>
    );
  }

  function renderPostResults() {
    if (loading) {
      return (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted h-40 rounded-lg"></div>
          ))}
        </div>
      );
    }
    
    const postResults = searchResults.filter(r => r.type === 'post');
    
    if (postResults.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No posts found</h3>
          <p className="text-muted-foreground">Try different keywords or check your spelling.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {postResults.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  }
};

export default SearchPage;
