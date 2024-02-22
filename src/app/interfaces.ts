export interface User {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  likedProduct: Product[];
  cart: Product[];
  checkout: Product[];
}
export interface Product {
  category: 'guitar' | 'drum' | 'bass' | 'piano' | 'other';
  model: string;
  price: number;
  quantity: number;
  discount: number;
  photoUrl: string;
}
