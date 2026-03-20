import { useNavigate } from 'react-router-dom';
import { ProductGrid } from '@/components/common/ProductCard';
import { mockCategories, homeTextilesProducts } from '@/data/mockData';
import { Home } from 'lucide-react';

const HomeTextilesPage = () => {
  const navigate = useNavigate();
  const homeCategory = mockCategories.find(cat => cat.slug === 'home-textiles');
  const subCategories = homeCategory?.children || [];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-primary py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-5 w-5 text-primary-foreground" />
              <span className="text-primary-foreground/90 text-sm font-medium uppercase tracking-wider">Home Textiles</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Transform Your Home
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Premium bedsheets, curtains, and home decor textiles
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-surface/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {subCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => navigate(`/category/${category.slug}`)}
                className="cursor-pointer bg-card rounded-lg p-6 border border-card-border hover:shadow-medium transition-all text-center"
              >
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-muted-foreground text-sm">{category.productCount}+ items</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <ProductGrid products={homeTextilesProducts} />
        </div>
      </section>
    </div>
  );
};

export default HomeTextilesPage;
