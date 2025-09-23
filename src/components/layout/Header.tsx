// TextTiles Header Component
// Premium textile showroom navigation with search, cart, and user menu

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCart, useCurrentUser } from '@/hooks/useApi';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { data: cart } = useCart();
  const { data: user } = useCurrentUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navItems = [
    { name: 'Women', href: '/category/women', featured: true },
    { name: 'Men', href: '/category/men', featured: true },
    { name: 'Kids', href: '/category/kids', featured: true },
    { name: 'Home Textiles', href: '/category/home-textiles', featured: true },
    { name: '3D Showroom', href: '/showroom', featured: false },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-primary text-primary-foreground py-2 px-4 text-center text-sm">
        <p className="font-medium">
          🎉 Grand Opening Sale! Up to 40% off on premium textiles
          <Link to="/sale" className="ml-2 underline hover:no-underline font-semibold">
            Shop Now
          </Link>
        </p>
      </div>

      {/* Main Header */}
      <header className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 hover-lift">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gradient-primary">TextTiles</h1>
                <p className="text-xs text-muted-foreground -mt-1">Premium Showroom</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors hover:text-primary",
                    "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary",
                    "after:transition-all after:duration-300 hover:after:w-full",
                    item.featured && "text-primary"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search textiles, sarees, shirts..."
                  className="pl-10 pr-4 w-full focus:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              
              {/* Search Button - Mobile only */}
              <Button
                variant="ghost_primary"
                size="icon-sm"
                className="md:hidden"
                onClick={() => {
                  // Implement mobile search modal
                  console.log('Open mobile search');
                }}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Wishlist */}
              {user && (
                <Button
                  variant="ghost_primary"
                  size="icon-sm"
                  asChild
                  className="relative"
                >
                  <Link to="/wishlist">
                    <Heart className="w-5 h-5" />
                    {/* Add wishlist count badge when available */}
                  </Link>
                </Button>
              )}

              {/* Cart */}
              <Button
                variant="ghost_primary"
                size="icon-sm"
                asChild
                className="relative"
              >
                <Link to="/cart">
                  <ShoppingBag className="w-5 h-5" />
                  {cart?.data && cart.data.totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-secondary text-secondary-foreground">
                      {cart.data.totalItems > 99 ? '99+' : cart.data.totalItems}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* User Menu */}
              <Button
                variant="ghost_primary"
                size="icon-sm"
                asChild
              >
                <Link to={user ? "/account" : "/auth/login"}>
                  <User className="w-5 h-5" />
                </Link>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost_primary"
                size="icon-sm"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur">
            <div className="container mx-auto px-4 py-4 space-y-4">
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search textiles..."
                  className="pl-10 pr-4 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* Mobile Navigation Links */}
              <nav className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium py-3 px-4 rounded-lg bg-surface hover:bg-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              {/* User Actions */}
              <div className="pt-4 border-t border-border/40">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/account"
                      className="block text-sm font-medium py-3 px-4 rounded-lg bg-surface hover:bg-accent transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="block text-sm font-medium py-3 px-4 rounded-lg bg-surface hover:bg-accent transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/auth/login"
                    className="block text-sm font-medium py-3 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}