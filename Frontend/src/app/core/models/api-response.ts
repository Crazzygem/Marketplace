/**
 * Common API response interfaces for type-safe HTTP responses
 */

// Generic API response wrapper (when backend wraps responses)
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

// Paginated response structure
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// Common entity timestamps
export interface Timestamps {
  created_at: string;
  updated_at?: string;
}

// Generic delete response
export interface DeleteResponse {
  message: string;
  success: boolean;
}

// Generic create/update response
export interface MutationResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Dashboard stats response
export interface DashboardStats {
  totalUsers: number;
  totalShops: number;
  totalRevenue: number;
  recentUsers: Array<{ date: string; count: number }>;
  shopsByCategory: Array<{ category_name: string; total: number }>;
  revenueByMonth: any[];
  stats?: {
    pending_shops?: number;
  };
}

// Shop stats response
export interface ShopStats {
  total_listings: number;
  active_listings: number;
  total_orders: number;
  total_revenue: number;
  recent_orders: number;
}

// Toggle saved item response
export interface ToggleSavedResponse {
  is_saved: boolean;
  message: string;
}

// Chat creation response
export interface ChatCreationResponse {
  chat_room: {
    room_id: number;
    listing_id?: number;
    buyer_id: number;
    seller_id: number;
  };
  message: string;
}
