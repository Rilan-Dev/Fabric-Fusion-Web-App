import { useNavigate } from 'react-router-dom';
import { CategoryTile } from '@/components/common/CategoryTile';
import { useCategories } from '@/hooks/useApi';
import { Baby } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const KidsPage = () => {
  const navigate = useNavigate();
  const { data: categoriesData } = useCategories();
  
  const kidsCategory = categoriesData?.data?.find(cat => cat.slug === 'kids');
  const boysCategory = kidsCategory?.children?.find(cat => cat.slug === 'kids/boys');
  const girlsCategory = kidsCategory?.children?.find(cat => cat.slug === 'kids/girls');
  const infantCategory = kidsCategory?.children?.find(cat => cat.slug === 'kids/infant-wear');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-primary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Baby className="h-6 w-6 text-white" />
              <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Kids Collection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Little Ones, Big Style
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Adorable and comfortable clothing for your little treasures. Soft fabrics, 
              playful designs, and durable quality for active kids.
            </p>
          </div>
        </div>
      </section>

      {/* Tabbed Categories */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="boys" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="boys">Boys</TabsTrigger>
              <TabsTrigger value="girls">Girls</TabsTrigger>
              <TabsTrigger value="infant">Infant</TabsTrigger>
            </TabsList>
            
            <TabsContent value="boys" className="mt-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Boys Collection</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {boysCategory?.children?.map((category) => (
                  <CategoryTile
                    key={category.id}
                    category={category}
                    onClick={() => navigate(`/category/${category.slug}`)}
                    size="medium"
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="girls" className="mt-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Girls Collection</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {girlsCategory?.children?.map((category) => (
                  <CategoryTile
                    key={category.id}
                    category={category}
                    onClick={() => navigate(`/category/${category.slug}`)}
                    size="medium"
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="infant" className="mt-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Infant Wear (0-2 Years)</h2>
              <div className="max-w-md mx-auto">
                {infantCategory && (
                  <CategoryTile
                    category={infantCategory}
                    onClick={() => navigate(`/category/${infantCategory.slug}`)}
                    size="large"
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Parents Love Us</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Baby className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Soft & Safe</h3>
              <p className="text-sm text-muted-foreground">
                Gentle fabrics perfect for sensitive skin
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Baby className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Durable Quality</h3>
              <p className="text-sm text-muted-foreground">
                Built to withstand active play
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Baby className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Easy Care</h3>
              <p className="text-sm text-muted-foreground">
                Machine washable and quick-dry
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KidsPage;
