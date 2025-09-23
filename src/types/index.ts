// TextTiles - Type Definitions
// Based on comprehensive BRD and database schema

export interface User {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber: string;
  role: 'customer' | 'admin';
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profilePictureUrl?: string;
  loyaltyPoints: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  cityId: string;
  cityName: string;
  stateId: string;
  stateName: string;
  countryId: string;
  countryName: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
  children?: Category[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size?: string;
  color?: string;
  colorHex?: string;
  material?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stockQuantity: number;
  weight?: number;
  isActive: boolean;
  images: ProductImage[];
}

export interface ProductImage {
  id: string;
  variantId: string;
  url: string;
  altText?: string;
  sortOrder: number;
  isMain: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  categoryId: string;
  categoryName: string;
  brandName?: string;
  fabricType?: string;
  careInstructions?: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
  minPrice: number;
  maxPrice: number;
  avgRating?: number;
  reviewCount?: number;
  totalStock: number;
}

export interface CartItem {
  id: string;
  userId: string;
  variantId: string;
  quantity: number;
  addedAt: string;
  product: Product;
  variant: ProductVariant;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  appliedCoupons: string[];
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: string;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking' | 'wallet';
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress?: Address;
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: Product;
  variant: ProductVariant;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
  user: Pick<User, 'fullName' | 'profilePictureUrl'>;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'offer' | 'general' | 'delivery';
  title: string;
  message: string;
  imageUrl?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

// Filter types for product search
export interface ProductFilters {
  categories: string[];
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  materials: string[];
  brands: string[];
  rating?: number;
  sortBy: 'newest' | 'price_low' | 'price_high' | 'rating' | 'popularity';
  inStock?: boolean;
}

export interface SearchParams {
  query?: string;
  filters: Partial<ProductFilters>;
  page: number;
  limit: number;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// 3D Showroom types
export interface ShowroomSection {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  categories: string[];
  hotspots: ShowroomHotspot[];
}

export interface ShowroomHotspot {
  id: string;
  position: [number, number, number];
  categoryId: string;
  categoryName: string;
  description?: string;
}

// Analytics types
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

// Form types
export interface LoginForm {
  phoneNumber: string;
  otp?: string;
}

export interface RegisterForm {
  fullName: string;
  phoneNumber: string;
  email?: string;
  gender?: string;
}

export interface AddressForm {
  type: 'home' | 'work' | 'other';
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  cityId: string;
  pincode: string;
  isDefault: boolean;
}

export interface CheckoutForm {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking' | 'wallet';
  couponCode?: string;
  specialInstructions?: string;
}

// Component prop types
export interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  showWishlist?: boolean;
  showQuickAdd?: boolean;
  onAddToCart?: (variantId: string) => void;
  onToggleWishlist?: (productId: string) => void;
}

export interface CategoryTileProps {
  category: Category;
  size?: 'small' | 'medium' | 'large';
  showProductCount?: boolean;
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  name: string;
  href?: string;
}