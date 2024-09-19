import { ICartItem } from "../../container/interfaces/cardItem.interface";

interface ILocation {
  name: string;
  code: string;
}

interface IColor {
  id: string;
  title: string;
  imagen: string;
}

interface IProduct {
  id: number;
  identifier: string;
  name: string;
  imageUrl: string;
  category: string;
  price: number;
  originalPrice: number;
  sizes?: string[];
  size?: string | null;
  color?: IColor | null;
}

export interface IOrder {
  _id?: string;
  orderId: string;
  userId: string;
  fullName: string;
  cardType: string;
  lastNumberCard: string;
  address?: string;
  totalOriginalPrices: number;
  totalOfferPrices: number;
  totalProducts: number;
  delivery: string;
  country?: ILocation;
  state?: ILocation;
  city?: string;
  zipCode?: string;
  cart: ICartItem[];
  orderDate?: Date;
}