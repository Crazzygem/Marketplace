import { Category } from './category';

export interface Listing {
  listing_id: number;
  shop_id: number;
  category_id?: number;
  title: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_urls?: string[]; // Array of image URLs stored as JSON in the database
  status: string;
  view_count: number;
  sales_count?: number; // Number of times sold
  is_sold?: boolean; // Manually marked as sold
  sold_at?: string; // When marked as sold
  created_at: string;
  updated_at: string;
  shop?: {
    shop_name: string;
    owner_id: number;
    created_at?: string;
  };
  category?: Category;
}
