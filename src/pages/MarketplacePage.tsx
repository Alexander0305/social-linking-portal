
import React, { useState, useEffect } from 'react';
import { getProducts } from '@/services/database';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Plus } from 'lucide-react';

const categories = [
  'All',
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Vehicles',
  'Services',
  'Real Estate',
  'Other'
];

const MarketplacePage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filters, setFilters] = useState({
    category: '',
    min_price: '',
    max_price: '',
    status: 'active'
  });

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const filtersToApply: Record<string, any> = { status: 'active' };
        
        if (filters.category && filters.category !== 'All') {
          filtersToApply.category = filters.category;
        }
        
        if (filters.min_price) {
          filtersToApply.min_price = parseFloat(filters.min_price);
        }
        
        if (filters.max_price) {
          filtersToApply.max_price = parseFloat(filters.max_price);
        }
        
        const { data } = await getProducts(20, 0, filtersToApply);
        if (data) {
          // Apply search query filter client-side
          const filtered = searchQuery 
            ? data.filter((product: any) => 
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : data;
          
          setProducts(filtered);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchQuery, filters]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setFilters(prev => ({
      ...prev,
      category: category === 'All' ? '' : category
    }));
  };

  const filterProducts = () => {
    // Filtering is handled in the useEffect
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <Button as={Link} to="/marketplace/create">
          <Plus className="mr-2 h-4 w-4" /> List an Item
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>
        
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
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
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try changing your search criteria or be the first to list an item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link to={`/marketplace/${product.id}`} key={product.id}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div 
                  className="aspect-square bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${product.images?.[0] || 'https://placehold.co/300x300/e2e8f0/a0aec0?text=No+Image'})` 
                  }}
                ></div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg line-clamp-1">{product.title}</h3>
                  <p className="text-lg font-semibold text-primary">{`${product.currency} ${product.price.toFixed(2)}`}</p>
                  <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{product.description}</p>
                </CardContent>
                <CardFooter className="pt-0 px-4 pb-4 flex justify-between text-xs text-muted-foreground">
                  <span>{product.location || 'Location not specified'}</span>
                  <span>{product.category}</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
