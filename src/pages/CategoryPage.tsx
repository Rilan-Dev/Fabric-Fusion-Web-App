import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts, useCategories } from '@/hooks/useApi';
import { ProductCard } from '@/components/common/ProductCard';
import FilterDrawer from '@/components/common/FilterDrawer';
import { Button } from '@/components/ui/button';
import { Filter, Grid, List } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CategoryPage = () => {
  const { slug, parent, grandparent } = useParams();
  const categorySlug = slug || parent || grandparent || '';
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    priceRange: [0, 10000] as [number, number],
    colors: [] as string[],
    sizes: [] as string[],
    materials: [] as string[],
    inStock: true,
  });

  const { data: productsData, isLoading } = useProducts({
    category: categorySlug,
    filters: {
      ...filters,
      sortBy: sortBy as any,
    },
  });

  const { data: categoriesData } = useCategories();

  const currentCategory = categoriesData?.data?.find(
    (cat) => cat.slug === categorySlug
  );

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}
      <section className="bg-gradient-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {currentCategory?.name || 'Products'}
          </h1>
          <p className="text-white/80 max-w-2xl">
            {currentCategory?.description || 'Discover our collection of premium textiles'}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <p className="text-muted-foreground">
              {productsData?.data?.pagination.total || 0} products found
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="hidden sm:flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <FilterDrawer
              filters={filters}
              onFilterChange={handleFilterChange}
              isOpen={true}
              onClose={() => {}}
              isMobile={false}
            />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-lg mb-4" />
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'flex flex-col gap-4'
                }
              >
                {productsData?.data?.data.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                    showWishlist
                    showQuickAdd
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        filters={filters}
        onFilterChange={handleFilterChange}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        isMobile={true}
      />
    </div>
  );
};

export default CategoryPage;
