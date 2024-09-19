export interface IUser {
  _id: string;
  name: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  country: {name: string, code: string};
  state: {name: string, code: string};
  city: string;
  zipCode: string;
  billingAddress: BillingAddress;
  cart: CartItem[];
}

interface BillingAddress {
  name: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
}

interface CartItem {
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
  quantity: number;
}
