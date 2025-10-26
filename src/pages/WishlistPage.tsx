import { useState } from 'react';
import { ProductCard } from '@/components/common/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WishlistPage = () => {
  // Mock wishlist data - in real app, this would come from context/API
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistItems(items => items.filter(item => item.id !== productId));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-primary py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-white" fill="white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              My Wishlist
            </h1>
          </div>
          <p className="text-white/80">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {wishlistItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showWishlist
                  showQuickAdd
                  onWishlistToggle={() => handleRemoveFromWishlist(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
              <p className="text-muted-foreground mb-8">
                Start adding items you love to your wishlist
              </p>
              <Button size="lg" onClick={() => window.location.href = '/'}>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WishlistPage;
