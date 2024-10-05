export interface User {
  email: string | null | undefined;
  isAdmin: boolean;
  likedProducts: ProductKeyAndType[];
  photoUrl?: string;
  address?: string;
  purchasedProducts: Purchase[];
}

export interface Purchase {
  email?: string;
  userId?:string,
  date:Date,
  totalPrice:number,
  products: Cart[];
}
export interface Product {
  category: 'guitar' | 'drum' | 'bass' | 'piano' | 'other';
  model: string;
  price: number;
  description?: string;
  quantity: number;
  discount: number;
  isAcoustic:boolean,
  isTopProduct:{isTop:boolean,date:Date};
  photoUrl: string[];
}
export interface ProductKeyValue {
  key: string;
  product: Product;
}
export interface KeyValueUser {
  key: string;
  user: User;
}
export interface ProductKeyAndType {
  key: string;
  category: 'guitar' | 'drum' | 'bass' | 'piano' | 'other';
}
export interface Cart {
  quantity: number;
  product: ProductKeyValue;
}
export interface ProductTypes {
  guitar: ProductKeyValue[];
  bass: ProductKeyValue[];
  piano: ProductKeyValue[];
  drum: ProductKeyValue[];
  // other: ProductKeyValue[];
}
export interface ProductForm {
  model: string;
  price: string;
  discount: string;
  quantity: string;
  description: string;
}


export const firebaseConfig = {
  apiKey: 'AIzaSyCbQiRFo1MKF_WTEIwSMYg4rFL0CkKdTDI',
  authDomain: 'exercise-app-9b873.firebaseapp.com',
  databaseURL:
    'https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'exercise-app-9b873',
  storageBucket: 'exercise-app-9b873.appspot.com',
  messagingSenderId: '146569895533',
  appId: '1:146569895533:web:cfb4bca172cc29ee50a964',
  measurementId: 'G-MW950TMVK5',
};
