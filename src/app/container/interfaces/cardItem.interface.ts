export interface ICartItem {
    quantity: number;
    product: {
      id: number;
      identifier: string;
      name: string;
      imageUrl: string;
      category: string;
      price: number;
      originalPrice: number;
      sizes?: string[];
      size?: string | null;
      color?: { id: string; title: string; imagen: string, selected: boolean } | null;
    };
}