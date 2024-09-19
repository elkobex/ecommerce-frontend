export interface IColor {
  id: string;
  title: string;
  imagen: string;
  selected: boolean;
  loading?: boolean;
}

export interface IProduct {
  _id: string;
  id: number;
  identifier: string;
  name: string;
  color: string;
  referenceId: string;
  imageUrl: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number;
  productUrl: string;
  size: string;
  sizes: string[];
  colors: IColor[];
  images: string[];
  loading: boolean;
}