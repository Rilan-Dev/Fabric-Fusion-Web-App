// TextTiles Product Card Component
// Elegant product display with hover effects, wishlist, and quick actions

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Product, ProductCardProps } from '@/types';
import { useAddToCart, useToggleWishlist } from '@/hooks/useApi';

export function ProductCard({ 
  product, 
  variant = 'default',
  showWishlist = true,
  showQuickAdd = true,
  onAddToCart,
  onToggleWishlist,
  className 
}: ProductCardProps & { className?: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  
  const addToCartMutation = useAddToCart();
  const toggleWishlistMutation = useToggleWishlist();

  const selectedVariant = product.variants[selectedVariantIndex];
  const discountPercentage = selectedVariant.compareAtPrice 
    ? Math.round(((selectedVariant.compareAtPrice - selectedVariant.price) / selectedVariant.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(selectedVariant.id);
    } else {
      addToCartMutation.mutate({ variantId: selectedVariant.id, quantity: 1 });
    }
  };

  const handleToggleWishlist = () => {
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    } else {
      toggleWishlistMutation.mutate({ productId: product.id, isInWishlist: isWishlisted });
    }
    setIsWishlisted(!isWishlisted);
  };

  const variantSizes = {
    compact: {
      container: 'max-w-xs',
      image: 'h-48',
      content: 'p-3',
      title: 'text-sm',
      price: 'text-sm',
    },
    default: {
      container: 'max-w-sm',
      image: 'h-64 sm:h-72',
      content: 'p-4',
      title: 'text-base',
      price: 'text-lg',
    },
    featured: {
      container: 'max-w-md',
      image: 'h-80 sm:h-96',
      content: 'p-6',
      title: 'text-lg',
      price: 'text-xl',
    },
  };

  const sizes = variantSizes[variant];

  return (
    <div className={cn(
      "group relative bg-card border border-card-border rounded-xl overflow-hidden",
      "hover:shadow-large hover:-translate-y-1 transition-all duration-300",
      "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
      sizes.container,
      className
    )}>
      
      {/* Product Image */}
      <div className={cn("relative overflow-hidden bg-muted", sizes.image)}>
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={selectedVariant.images[0]?.url || '/placeholder-product.jpg'}
            alt={selectedVariant.images[0]?.altText || product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isFeatured && (
            <Badge className="bg-secondary text-secondary-foreground text-xs font-medium">
              Featured
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-destructive text-destructive-foreground text-xs font-medium">
              -{discountPercentage}%
            </Badge>
          )}
          {selectedVariant.stockQuantity < 5 && selectedVariant.stockQuantity > 0 && (
            <Badge className="bg-warning text-warning-foreground text-xs font-medium">
              Low Stock
            </Badge>
          )}
          {selectedVariant.stockQuantity === 0 && (
            <Badge className="bg-muted text-muted-foreground text-xs font-medium">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        {showWishlist && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={handleToggleWishlist}
            disabled={toggleWishlistMutation.isPending}
          >
            <Heart 
              className={cn(
                "w-4 h-4 transition-colors",
                isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground hover:text-destructive"
              )} 
            />
          </Button>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex gap-2">
            {showQuickAdd && selectedVariant.stockQuantity > 0 && (
              <Button
                size="sm"
                variant="premium"
                className="flex-1 text-xs"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
              >
                <ShoppingBag className="w-3 h-3 mr-1" />
                Add to Cart
              </Button>
            )}
            <Button
              size="sm"
              variant="elegant"
              className="text-xs"
              asChild
            >
              <Link to={`/product/${product.slug}`}>
                <Eye className="w-3 h-3 mr-1" />
                View
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className={sizes.content}>
        <div className="space-y-2">
          
          {/* Product Name */}
          <Link to={`/product/${product.slug}`} className="block group-hover:text-primary transition-colors">
            <h3 className={cn("font-semibold line-clamp-2 leading-tight", sizes.title)}>
              {product.name}
            </h3>
          </Link>

          {/* Category & Brand */}
          <p className="text-xs text-muted-foreground">
            {product.categoryName}
            {product.brandName && (
              <span className="ml-2">• {product.brandName}</span>
            )}
          </p>

          {/* Rating */}
          {product.avgRating && product.reviewCount && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                <Star className="w-3 h-3 fill-secondary text-secondary" />
                <span className="text-xs font-medium ml-1">{product.avgRating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Color Variants */}
          {product.variants.length > 1 && (
            <div className="flex gap-1 flex-wrap">
              {product.variants.slice(0, 5).map((variant, index) => (
                <button
                  key={variant.id}
                  className={cn(
                    "w-4 h-4 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform",
                    selectedVariantIndex === index && "ring-2 ring-primary ring-offset-1"
                  )}
                  style={{ backgroundColor: variant.colorHex || '#6B7280' }}
                  onClick={() => setSelectedVariantIndex(index)}
                  title={variant.color}
                />
              ))}
              {product.variants.length > 5 && (
                <span className="text-xs text-muted-foreground self-center ml-1">
                  +{product.variants.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-center gap-2">
            <span className={cn("font-bold text-primary", sizes.price)}>
              ₹{selectedVariant.price.toLocaleString()}
            </span>
            {selectedVariant.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{selectedVariant.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Fabric Type */}
          {product.fabricType && (
            <p className="text-xs text-muted-foreground">
              {product.fabricType}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Product Grid Component
interface ProductGridProps {
  products: Product[];
  title?: string;
  description?: string;
  variant?: 'default' | 'compact' | 'featured';
  showWishlist?: boolean;
  showQuickAdd?: boolean;
  className?: string;
}

export function ProductGrid({ 
  products, 
  title, 
  description, 
  variant = 'default',
  showWishlist = true,
  showQuickAdd = true,
  className 
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    );
  }

  const gridCols = {
    compact: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    default: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    featured: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <section className={cn("space-y-6", className)}>
      {(title || description) && (
        <div className="text-center space-y-2">
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient-primary">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      <div className={cn("grid gap-6", gridCols[variant])}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant={variant}
            showWishlist={showWishlist}
            showQuickAdd={showQuickAdd}
          />
        ))}
      </div>
    </section>
  );
}