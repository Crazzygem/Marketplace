export interface Category {
  category_id: number;
  category_name: string;
  description?: string;
  icon?: string;
  is_popular?: boolean;
  created_at?: string;
  updated_at?: string;
  listings_count?: number;
}
