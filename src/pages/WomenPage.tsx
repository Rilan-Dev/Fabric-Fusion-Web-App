import { useNavigate } from 'react-router-dom';
import { CategoryTile } from '@/components/common/CategoryTile';
import { useCategories } from '@/hooks/useApi';
import { Sparkles } from 'lucide-react';

const WomenPage = () => {
  const navigate = useNavigate();
  const { data: categoriesData } = useCategories();
  
  const womenCategory = categoriesData?.data?.find(cat => cat.slug === 'women');
  const subCategories = womenCategory?.children || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-primary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-white" />
              <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Women's Collection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Elegance Redefined
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Discover our exquisite collection of traditional and contemporary textiles. 
              From luxurious silk sarees to comfortable everyday wear, find your perfect style.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subCategories.map((category) => (
              <CategoryTile
                key={category.id}
                category={category}
                onClick={() => {
                  if (category.children && category.children.length > 0) {
                    navigate(`/${category.slug}`);
                  } else {
                    navigate(`/category/${category.slug}`);
                  }
                }}
                size="large"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Our Collection?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">
                Handpicked fabrics with superior craftsmanship
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Wide Variety</h3>
              <p className="text-sm text-muted-foreground">
                From traditional to contemporary styles
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Perfect Fit</h3>
              <p className="text-sm text-muted-foreground">
                Multiple sizes and customization options
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WomenPage;
