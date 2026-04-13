import type { Product } from "@/widgets";

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface User {
  id: number;
  login: string;
  email: string;
  name: string;
  surname: string;
  patronymic?: string;
  role: { id: number; name: string };
  favoriteItems: Product[];
  cart: CartItem[];
}