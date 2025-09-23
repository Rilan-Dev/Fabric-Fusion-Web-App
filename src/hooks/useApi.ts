// TextTiles React Query Hooks
// Centralized data fetching hooks with caching and error handling

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Product, Category, Cart, User, Order, Address } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Query Keys
export const queryKeys = {
  products: ['products'] as const,
  product: (slug: string) => ['products', slug] as const,
  featuredProducts: ['products', 'featured'] as const,
  categories: ['categories'] as const,
  category: (slug: string) => ['categories', slug] as const,
  cart: ['cart'] as const,
  wishlist: ['wishlist'] as const,
  user: ['user'] as const,
  orders: ['orders'] as const,
  order: (id: string) => ['orders', id] as const,
  addresses: ['addresses'] as const,
};

// Product Hooks
export function useProducts(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  filters?: Record<string, any>;
} = {}) {
  return useQuery({
    queryKey: [...queryKeys.products, params],
    queryFn: () => apiClient.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => apiClient.getProduct(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: queryKeys.featuredProducts,
    queryFn: () => apiClient.getFeaturedProducts(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Category Hooks
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => apiClient.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: queryKeys.category(slug),
    queryFn: () => apiClient.getCategory(slug),
    enabled: !!slug,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Cart Hooks
export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: () => apiClient.getCart(),
    staleTime: 0, // Always fresh for cart data
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ variantId, quantity = 1 }: { variantId: string; quantity?: number }) =>
      apiClient.addToCart(variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart successfully.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      apiClient.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update cart item.",
        variant: "destructive",
      });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (itemId: string) => apiClient.removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart.",
        variant: "destructive",
      });
    },
  });
}

// Wishlist Hooks
export function useWishlist() {
  return useQuery({
    queryKey: queryKeys.wishlist,
    queryFn: () => apiClient.getWishlist(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ productId, isInWishlist }: { productId: string; isInWishlist: boolean }) =>
      isInWishlist 
        ? apiClient.removeFromWishlist(productId)
        : apiClient.addToWishlist(productId),
    onSuccess: (_, { isInWishlist }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
      toast({
        title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: isInWishlist 
          ? "Item has been removed from your wishlist."
          : "Item has been added to your wishlist.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update wishlist.",
        variant: "destructive",
      });
    },
  });
}

// User Hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => apiClient.getCurrentUser(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry if user is not authenticated
  });
}

// Auth Hooks
export function useSendOTP() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (phoneNumber: string) => apiClient.sendOTP(phoneNumber),
    onSuccess: () => {
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP.",
        variant: "destructive",
      });
    },
  });
}

export function useVerifyOTP() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) =>
      apiClient.verifyOTP(phoneNumber, otp),
    onSuccess: (response) => {
      // Set auth token
      apiClient.setAuthToken(response.data.token);
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.data.user.fullName}!`,
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Invalid OTP",
        description: error.message || "Please check your OTP and try again.",
        variant: "destructive",
      });
    },
  });
}

// Address Hooks
export function useAddresses() {
  return useQuery({
    queryKey: queryKeys.addresses,
    queryFn: () => apiClient.getAddresses(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (address: any) => apiClient.createAddress(address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses });
      toast({
        title: "Address Added",
        description: "New address has been saved successfully.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save address.",
        variant: "destructive",
      });
    },
  });
}

// Order Hooks
export function useOrders(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...queryKeys.orders, { page, limit }],
    queryFn: () => apiClient.getOrders(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => apiClient.getOrder(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (orderData: any) => apiClient.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully!",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Search Hook
export function useSearch(query: string, filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: () => apiClient.search(query, filters),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Location Hooks
export function useCities(stateId?: string) {
  return useQuery({
    queryKey: ['cities', stateId],
    queryFn: () => apiClient.getCities(stateId),
    enabled: !!stateId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useStates(countryId?: string) {
  return useQuery({
    queryKey: ['states', countryId],
    queryFn: () => apiClient.getStates(countryId),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useValidatePincode() {
  return useMutation({
    mutationFn: (pincode: string) => apiClient.validatePincode(pincode),
  });
}

// Coupon Hook
export function useValidateCoupon() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ code, cartTotal }: { code: string; cartTotal: number }) =>
      apiClient.validateCoupon(code, cartTotal),
    onError: (error: any) => {
      toast({
        title: "Invalid Coupon",
        description: error.message || "This coupon code is not valid.",
        variant: "destructive",
      });
    },
  });
}