export interface ProductFilters {
  [key: string]: any;
  category?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  page?: number;
  pageSize?: number;
}
