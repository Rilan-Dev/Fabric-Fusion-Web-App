// TextTiles Footer Component
// Comprehensive footer with links, contact info, and newsletter signup

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement newsletter subscription
    console.log('Newsletter subscription');
  };

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Care Instructions', href: '/care-instructions' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns & Exchange', href: '/returns' },
  ];

  const categories = [
    { name: 'Women\'s Sarees', href: '/category/women/sarees' },
    { name: 'Men\'s Shirts', href: '/category/men/shirts' },
    { name: 'Kids Wear', href: '/category/kids' },
    { name: 'Home Textiles', href: '/category/home-textiles' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Best Sellers', href: '/best-sellers' },
  ];

  const policies = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Refund Policy', href: '/refund-policy' },
    { name: 'Shipping Policy', href: '/shipping-policy' },
    { name: 'Bulk Orders', href: '/bulk-orders' },
    { name: 'Franchise', href: '/franchise' },
  ];

  return (
    <footer className="bg-surface-elevated border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Section */}
        <div className="py-12 text-center">
          <h3 className="text-2xl font-bold text-gradient-primary mb-2">
            Stay Updated with TextTiles
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get the latest updates on new collections, exclusive offers, and textile care tips.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
              required
            />
            <Button type="submit" variant="luxury" className="px-6">
              Subscribe
            </Button>
          </form>
        </div>

        <Separator className="mb-12" />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gradient-primary">TextTiles</h2>
                <p className="text-xs text-muted-foreground -mt-1">Premium Showroom</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your premier destination for high-quality textiles, traditional sarees, 
              modern clothing, and home textiles. Experience the finest fabrics with 
              exceptional craftsmanship.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>hello@texttiles.com</span>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>123 Textile Street, Fashion District, Mumbai 400001</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 pt-2">
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    to={category.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Policies</h3>
            <ul className="space-y-2">
              {policies.map((policy) => (
                <li key={policy.name}>
                  <Link
                    to={policy.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {policy.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Footer */}
        <div className="pb-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2024 TextTiles Premium Showroom. All rights reserved.</p>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span>We accept:</span>
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 bg-card border border-card-border rounded text-xs font-medium">
                UPI
              </div>
              <div className="px-2 py-1 bg-card border border-card-border rounded text-xs font-medium">
                Cards
              </div>
              <div className="px-2 py-1 bg-card border border-card-border rounded text-xs font-medium">
                COD
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}