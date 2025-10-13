import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useAddToCart } from '@/hooks/useApi';
import ProductGallery from '@/components/common/ProductGallery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Share2, Truck, Shield, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useProduct(slug!);
  const addToCart = useAddToCart();

  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const product = data?.data;
  const currentVariant = product?.variants.find((v) => v.id === selectedVariant) || product?.variants[0];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (currentVariant) {
      addToCart.mutate({ variantId: currentVariant.id, quantity });
    }
  };

  const handleBuyNow = () => {
    if (currentVariant) {
      addToCart.mutate(
        { variantId: currentVariant.id, quantity },
        {
          onSuccess: () => navigate('/checkout'),
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Gallery */}
          <ProductGallery images={currentVariant?.images || []} />

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge variant="secondary">{product.categoryName}</Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-bold text-primary">
                ₹{currentVariant?.price.toLocaleString()}
              </div>
              {currentVariant?.compareAtPrice && (
                <div className="text-xl text-muted-foreground line-through">
                  ₹{currentVariant.compareAtPrice.toLocaleString()}
                </div>
              )}
            </div>

            <p className="text-muted-foreground mb-6">{product.shortDescription}</p>

            {/* Variant Selection */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Variant</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant === variant.id ? 'default' : 'outline'}
                      onClick={() => setSelectedVariant(variant.id)}
                    >
                      {variant.color && (
                        <span
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: variant.colorHex }}
                        />
                      )}
                      {variant.size || variant.color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= (currentVariant?.stockQuantity || 0)}
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground ml-2">
                  {currentVariant?.stockQuantity} available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <Button onClick={handleAddToCart} className="flex-1" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Button onClick={handleBuyNow} variant="secondary" className="w-full" size="lg">
              Buy Now
            </Button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over ₹999</p>
              </div>
              <div className="text-center">
                <RefreshCw className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">7 days return</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="w-full">
            <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="care" className="flex-1">Care Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <p className="text-muted-foreground">{product.description}</p>
          </TabsContent>
          <TabsContent value="details" className="py-6">
            <dl className="space-y-4">
              {product.fabricType && (
                <div>
                  <dt className="font-semibold">Fabric Type:</dt>
                  <dd className="text-muted-foreground">{product.fabricType}</dd>
                </div>
              )}
              {product.brandName && (
                <div>
                  <dt className="font-semibold">Brand:</dt>
                  <dd className="text-muted-foreground">{product.brandName}</dd>
                </div>
              )}
              {currentVariant?.material && (
                <div>
                  <dt className="font-semibold">Material:</dt>
                  <dd className="text-muted-foreground">{currentVariant.material}</dd>
                </div>
              )}
            </dl>
          </TabsContent>
          <TabsContent value="care" className="py-6">
            <p className="text-muted-foreground">{product.careInstructions}</p>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <section>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Mock related products - replace with actual data */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex gap-3">
        <Button onClick={handleAddToCart} className="flex-1">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
        <Button onClick={handleBuyNow} variant="secondary" className="flex-1">
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default ProductPage;
