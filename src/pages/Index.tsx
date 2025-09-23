// TextTiles Home Page - Phase 1
// Premium textile showroom with hero section, categories, and featured products

import React from 'react';
import { HeroSection } from '@/components/common/HeroSection';
import { CategoryGrid } from '@/components/common/CategoryTile';
import { ProductGrid } from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockCategories, mockFeaturedProducts } from '@/data/mockData';

// Import category images
import womenCategoryImage from '@/assets/women-category.jpg';
import menCategoryImage from '@/assets/men-category.jpg';
import kidsCategoryImage from '@/assets/kids-category.jpg';
import homeTextilesImage from '@/assets/home-textiles-category.jpg';

const Index = () => {
  // Get main categories with generated images
  const mainCategories = mockCategories.map(category => ({
    ...category,
    imageUrl: category.slug === 'women' ? womenCategoryImage :
             category.slug === 'men' ? menCategoryImage :
             category.slug === 'kids' ? kidsCategoryImage :
             category.slug === 'home-textiles' ? homeTextilesImage :
             category.imageUrl
  }));

  const features = [
    {
      icon: Shield,
      title: 'Premium Quality',
      description: 'Handpicked textiles with guaranteed quality and authenticity',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and secure delivery across India with tracking',
    },
    {
      icon: Sparkles,
      title: 'Expert Curation',
      description: 'Carefully selected by textile experts for modern lifestyles',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20">
      
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center space-y-4 p-6 rounded-xl bg-surface-elevated border border-card-border hover:shadow-medium transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Categories */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <CategoryGrid
          categories={mainCategories}
          title="Explore Our Collections"
          description="Discover premium textiles across our carefully curated categories"
        />
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gradient-primary">
            Featured Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked selections from our premium textile collection
          </p>
        </div>

        <ProductGrid
          products={mockFeaturedProducts}
          variant="featured"
        />

        <div className="text-center mt-12">
          <Button asChild variant="luxury" size="lg">
            <Link to="/products">
              View All Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 3D Showroom CTA */}
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Experience Our 3D Showroom
            </h2>
            <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg">
              Take a virtual tour of our textile showroom and explore our collections 
              in an immersive 3D environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="gold" size="xl">
                <Link to="/showroom">
                  Enter 3D Showroom
                </Link>
              </Button>
              <Button asChild variant="elegant" size="xl" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white hover:text-foreground">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-surface rounded-2xl border border-card-border p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-gradient-primary mb-4">
            Stay in Style
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Subscribe to get updates on new collections, exclusive offers, and textile care tips.
          </p>
          
          <form className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <Button type="submit" variant="luxury" className="px-6">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Index;
