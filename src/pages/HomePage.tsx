import { useNavigate } from 'react-router-dom';
import { CategoryTile } from '@/components/common/CategoryTile';
import { useCategories } from '@/hooks/useApi';
import { Home as HomeIcon } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { data: categoriesData } = useCategories();
  
  const homeCategory = categoriesData?.data?.find(cat => cat.slug === 'home-textiles');
  const subCategories = homeCategory?.children || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-primary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <HomeIcon className="h-6 w-6 text-white" />
              <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Home Textiles</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Transform Your Space
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Discover premium home textiles that combine comfort, style, and quality. 
              From luxurious bed linens to elegant curtains, make your house a home.
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
                onClick={() => navigate(`/category/${category.slug}`)}
                size="large"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Quality You Can Feel</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Premium Materials</h3>
              <p className="text-sm text-muted-foreground">
                Carefully selected fabrics for lasting comfort
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Modern Designs</h3>
              <p className="text-sm text-muted-foreground">
                Contemporary patterns to match any décor
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Easy Maintenance</h3>
              <p className="text-sm text-muted-foreground">
                Machine washable and long-lasting quality
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
