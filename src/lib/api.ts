// TextTiles API Client
// Centralized API client with error handling and type safety

import { ApiResponse, PaginatedResponse, Product, Category, User, Order, Cart, Address } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || '/api/v1';

class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async sendOTP(phoneNumber: string) {
    return this.request<{ success: boolean }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  async verifyOTP(phoneNumber: string, otp: string) {
    return this.request<{ user: User; token: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otp }),
    });
  }

  async getCurrentUser() {
    return this.request<User>('/auth/me');
  }

  // Products
  async getProducts(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    filters?: Record<string, any>;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    return this.request<PaginatedResponse<Product>>(`/products?${searchParams}`);
  }

  async getProduct(slug: string) {
    return this.request<Product>(`/products/${slug}`);
  }

  async getFeaturedProducts() {
    return this.request<Product[]>('/products/featured');
  }

  // Categories
  async getCategories() {
    return this.request<Category[]>('/categories');
  }

  async getCategory(slug: string) {
    return this.request<Category>(`/categories/${slug}`);
  }

  // Cart
  async getCart() {
    return this.request<Cart>('/cart');
  }

  async addToCart(variantId: string, quantity: number = 1) {
    return this.request<Cart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ variantId, quantity }),
    });
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.request<Cart>(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: string) {
    return this.request<Cart>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request<Cart>('/cart', {
      method: 'DELETE',
    });
  }

  // Wishlist
  async getWishlist() {
    return this.request<{ items: Product[] }>('/wishlist');
  }

  async addToWishlist(productId: string) {
    return this.request<{ success: boolean }>('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId: string) {
    return this.request<{ success: boolean }>(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  // Addresses
  async getAddresses() {
    return this.request<Address[]>('/addresses');
  }

  async createAddress(address: Omit<Address, 'id' | 'userId' | 'createdAt'>) {
    return this.request<Address>('/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    });
  }

  async updateAddress(id: string, address: Partial<Address>) {
    return this.request<Address>(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    });
  }

  async deleteAddress(id: string) {
    return this.request<{ success: boolean }>(`/addresses/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(page: number = 1, limit: number = 10) {
    return this.request<PaginatedResponse<Order>>(`/orders?page=${page}&limit=${limit}`);
  }

  async getOrder(id: string) {
    return this.request<Order>(`/orders/${id}`);
  }

  async createOrder(orderData: {
    shippingAddressId: string;
    billingAddressId?: string;
    paymentMethod: string;
    couponCode?: string;
  }) {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Search
  async search(query: string, filters: Record<string, any> = {}) {
    const searchParams = new URLSearchParams({
      q: query,
      ...Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [
          key,
          typeof value === 'object' ? JSON.stringify(value) : value.toString()
        ])
      ),
    });

    return this.request<PaginatedResponse<Product>>(`/search?${searchParams}`);
  }

  // Location services
  async getCities(stateId?: string) {
    const params = stateId ? `?stateId=${stateId}` : '';
    return this.request<{ id: string; name: string }[]>(`/locations/cities${params}`);
  }

  async getStates(countryId?: string) {
    const params = countryId ? `?countryId=${countryId}` : '';
    return this.request<{ id: string; name: string }[]>(`/locations/states${params}`);
  }

  async validatePincode(pincode: string) {
    return this.request<{
      valid: boolean;
      city?: string;
      state?: string;
      deliverable: boolean;
    }>(`/locations/pincode/${pincode}`);
  }

  // Coupons
  async validateCoupon(code: string, cartTotal: number) {
    return this.request<{
      valid: boolean;
      discount: number;
      message: string;
    }>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, cartTotal }),
    });
  }

  // Reviews
  async getProductReviews(productId: string, page: number = 1) {
    return this.request<PaginatedResponse<any>>(`/products/${productId}/reviews?page=${page}`);
  }

  async submitReview(productId: string, review: {
    rating: number;
    title?: string;
    comment?: string;
    orderId?: string;
  }) {
    return this.request<any>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.headers['Authorization'];
  }
}

export const apiClient = new ApiClient();

// React Query hooks for common operations
export { apiClient as default };