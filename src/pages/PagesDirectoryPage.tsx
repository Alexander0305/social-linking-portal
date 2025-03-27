
import React, { useState, useEffect } from 'react';
import { getPages } from '@/services/database';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Plus, Check } from 'lucide-react';

const categories = [
  'All',
  'Business',
  'Entertainment',
  'Education',
  'Community',
  'Personal',
  'Brand',
  'Public Figure'
];

const PagesDirectoryPage = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const loadPages = async () => {
      setLoading(true);
      try {
        const category = activeCategory === 'All' ? undefined : activeCategory;
        const { data } = await getPages(20, 0, category);
        
        if (data) {
          // Apply search query filter client-side
          const filtered = searchQuery 
            ? data.filter((page: any) => 
                page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (page.description && page.description.toLowerCase().includes(searchQuery.toLowerCase()))
              )
            : data;
          
          setPages(filtered);
        }
      } catch (error) {
        console.error('Error loading pages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPages();
  }, [searchQuery, activeCategory]);

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pages</h1>
        <Button as={Link} to="/pages/create">
          <Plus className="mr-2 h-4 w-4" /> Create Page
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-64"></div>
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No pages found</h3>
          <p className="text-muted-foreground">Try changing your search criteria or create a new page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pages.map((page) => (
            <Link to={`/pages/${page.id}`} key={page.id}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div 
                  className="h-32 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${page.cover || 'https://placehold.co/600x200/e2e8f0/a0aec0?text=No+Cover'})` 
                  }}
                ></div>
                <CardContent className="p-4 flex flex-col items-center text-center -mt-10">
                  <Avatar className="h-20 w-20 border-4 border-background">
                    <AvatarImage src={page.avatar} alt={page.name} />
                    <AvatarFallback>{page.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium text-lg mt-2">{page.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                    {page.description || `A ${page.category.toLowerCase()} page`}
                  </p>
                  <div className="flex items-center mt-4">
                    <span className="text-sm text-muted-foreground">{page.likes_count || 0} likes</span>
                    <span className="text-sm text-muted-foreground mx-2">•</span>
                    <span className="text-sm text-muted-foreground">{page.category}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 px-4 pb-4 justify-center">
                  <Button variant="outline" size="sm" className="w-full">
                    <Check className="mr-2 h-4 w-4" /> Like Page
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PagesDirectoryPage;
