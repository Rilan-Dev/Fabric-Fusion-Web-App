import { useNavigate, useParams } from 'react-router-dom';
import { CategoryTile } from '@/components/common/CategoryTile';
import { useCategories } from '@/hooks/useApi';
import { ChevronRight } from 'lucide-react';

const SubCategoryPage = () => {
  const { section, category } = useParams();
  const navigate = useNavigate();
  const { data: categoriesData } = useCategories();
  
  // Find the current category based on slug
  const findCategory = (cats: any[], slug: string): any => {
    for (const cat of cats) {
      if (cat.slug === slug) return cat;
      if (cat.children) {
        const found = findCategory(cat.children, slug);
        if (found) return found;
      }
    }
    return null;
  };

  const fullSlug = `${section}/${category}`;
  const currentCategory = findCategory(categoriesData?.data || [], fullSlug);
  const subCategories = currentCategory?.children || [];

  if (!currentCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb & Header */}
      <section className="bg-gradient-primary py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-white">
              Home
            </button>
            <ChevronRight className="h-4 w-4" />
            <button onClick={() => navigate(`/${section}`)} className="hover:text-white capitalize">
              {section}
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{currentCategory.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {currentCategory.name}
          </h1>
          {currentCategory.description && (
            <p className="text-white/80 max-w-2xl">
              {currentCategory.description}
            </p>
          )}
        </div>
      </section>

      {/* Sub-Categories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {subCategories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {subCategories.map((subCat) => (
                <CategoryTile
                  key={subCat.id}
                  category={subCat}
                  onClick={() => navigate(`/category/${subCat.slug}`)}
                  size="medium"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No subcategories available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SubCategoryPage;
