// TextTiles Category Tile Component
// Elegant category display with hover effects and product counts

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category } from '@/types';

interface CategoryTileProps {
  category: Category;
  size?: 'small' | 'medium' | 'large';
  showProductCount?: boolean;
  className?: string;
}

export function CategoryTile({ 
  category, 
  size = 'medium', 
  showProductCount = true,
  className 
}: CategoryTileProps) {
  const sizeClasses = {
    small: 'h-32 sm:h-40',
    medium: 'h-40 sm:h-56',
    large: 'h-56 sm:h-72',
  };

  return (
    <Link
      to={`/category/${category.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-surface-elevated border border-card-border",
        "hover:shadow-large hover:-translate-y-1 transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        sizeClasses[size],
        className
      )}
    >
      {/* Background Image */}
      {category.imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${category.imageUrl})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 text-white">
        <div className="space-y-2">
          <h3 className={cn(
            "font-bold text-white group-hover:text-secondary transition-colors",
            size === 'small' ? 'text-lg' : size === 'medium' ? 'text-xl' : 'text-2xl'
          )}>
            {category.name}
          </h3>
          
          {category.description && size !== 'small' && (
            <p className="text-white/90 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {category.description}
            </p>
          )}
          
          {showProductCount && category.productCount && (
            <p className="text-white/80 text-xs">
              {category.productCount} items
            </p>
          )}
        </div>

        {/* Arrow Icon */}
        <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 group-hover:bg-secondary/90 transition-all duration-300">
          <ArrowRight className="w-4 h-4 text-white group-hover:text-secondary-foreground" />
        </div>
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-secondary/30 transition-colors duration-300" />
    </Link>
  );
}

// Featured Category Grid Component
interface CategoryGridProps {
  categories: Category[];
  title?: string;
  description?: string;
  className?: string;
}

export function CategoryGrid({ categories, title, description, className }: CategoryGridProps) {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <CategoryTile
            key={category.id}
            category={category}
            size={index === 0 ? 'large' : 'medium'}
            className={index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}
          />
        ))}
      </div>
    </section>
  );
}