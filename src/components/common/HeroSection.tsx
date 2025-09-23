// TextTiles Hero Section Component
// Premium textile showroom hero with carousel and call-to-action

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Import hero image
import heroImage from '@/assets/hero-textile-showroom.jpg';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  primaryAction: {
    text: string;
    href: string;
  };
  secondaryAction?: {
    text: string;
    href: string;
  };
}

const heroSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'Discover Premium Textiles',
    subtitle: 'Experience Luxury in Every Thread',
    description: 'Explore our exquisite collection of handpicked textiles, from traditional silk sarees to contemporary fashion pieces.',
    imageUrl: heroImage,
    primaryAction: {
      text: 'Shop Collection',
      href: '/category/women',
    },
    secondaryAction: {
      text: 'View 3D Showroom',
      href: '/showroom',
    },
  },
  {
    id: '2',
    title: 'New Silk Collection',
    subtitle: 'Timeless Elegance Redefined',
    description: 'Immerse yourself in the world of premium silk sarees, crafted with traditional techniques and modern aesthetics.',
    imageUrl: heroImage,
    primaryAction: {
      text: 'Explore Silk Sarees',
      href: '/category/women/sarees/silk',
    },
    secondaryAction: {
      text: 'Learn More',
      href: '/about',
    },
  },
  {
    id: '3',
    title: 'Men\'s Premium Collection',
    subtitle: 'Sophisticated Style for Modern Men',
    description: 'Discover our refined collection of men\'s wear, featuring premium fabrics and impeccable tailoring.',
    imageUrl: heroImage,
    primaryAction: {
      text: 'Shop Men\'s Wear',
      href: '/category/men',
    },
    secondaryAction: {
      text: 'Size Guide',
      href: '/size-guide',
    },
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section 
      className="relative min-h-[80vh] lg:min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentSlideData.imageUrl}
          alt={currentSlideData.title}
          className="w-full h-full object-cover transition-all duration-1000"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="animate-fade-in">
            {/* Subtitle */}
            <p className="text-secondary font-medium text-lg sm:text-xl mb-4 animate-slide-up">
              {currentSlideData.subtitle}
            </p>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
              {currentSlideData.title}
            </h1>

            {/* Description */}
            <p className="text-white/90 text-lg sm:text-xl mb-8 max-w-2xl leading-relaxed animate-slide-up">
              {currentSlideData.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
              <Button
                asChild
                variant="hero"
                size="xl"
                className="text-base font-semibold"
              >
                <Link to={currentSlideData.primaryAction.href}>
                  {currentSlideData.primaryAction.text}
                </Link>
              </Button>

              {currentSlideData.secondaryAction && (
                <Button
                  asChild
                  variant="elegant"
                  size="xl"
                  className="text-base bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white hover:text-foreground"
                >
                  <Link to={currentSlideData.secondaryAction.href}>
                    <Play className="w-4 h-4 mr-2" />
                    {currentSlideData.secondaryAction.text}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon-lg"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 z-20"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon-lg"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 z-20"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              currentSlide === index
                ? "bg-secondary scale-125"
                : "bg-white/50 hover:bg-white/70"
            )}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 hidden lg:flex items-center text-white/70 text-sm">
        <div className="w-px h-16 bg-white/30 mr-4 animate-pulse" />
        <span className="writing-mode-vertical">Scroll to explore</span>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-32 left-20 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
    </section>
  );
}