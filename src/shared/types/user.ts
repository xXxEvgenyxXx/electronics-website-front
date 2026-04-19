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
  cart: { productId: number; quantity: number }[];
  favoriteItems: { productId: number; quantity: number }[]; // новый формат
}