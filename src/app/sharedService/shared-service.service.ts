import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  KeyValueUser,
  Product,
  ProductKeyAndType,
  ProductKeyValue,
  User,
} from '../interfaces';
import { Observable, catchError, forkJoin, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  public url =
    'https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app';
  constructor(private http: HttpClient) {}

  addProduct(
    category: 'drum' | 'bass' | 'guitar' | 'piano' | 'other',
    model: string,
    price: string,
    quantity: string,
    discount: string,
    photos: string[],
    desctiprion: string
  ) {
    const product: Product = {
      category: category,
      model: model,
      price: parseInt(price),
      quantity: parseInt(quantity),
      discount: parseInt(discount),
      photoUrl: photos,
      description: desctiprion,
    };
    return this.http.post(`${this.url}/products/${category}.json`, product);
  }

  getTypeOfProduct(
    category: 'drum' | 'bass' | 'guitar' | 'piano' | 'other'
  ): Observable<ProductKeyValue[]> {
    return this.http.get<ProductKeyValue>(`${this.url}/products/${category}.json`).pipe(
      map((responese) => {
        let productsArray: ProductKeyValue[] = [];
        Object.entries(responese).forEach(([keys, products]) =>
          productsArray.push({ key: keys, product: products })
        );
        return productsArray;
      })
    );
  }
  likeUnlikeProduct(
    productId: string,
    userId: string,
    productCategory: 'guitar' | 'drum' | 'bass' | 'piano' | 'other'
  ) {
    return this.http
      .get<User>(`${this.url}/musicShopUsers/${userId}.json`)
      .pipe(
        map((res: User) => {
          let updatedData: ProductKeyAndType[] = [];
          let updatedUser: User = {
            email: res.email,
            checkout: res.checkout,
            address: res.address,
            cart: res.cart,
            isAdmin: res.isAdmin,
            photoUrl: res.photoUrl,
            likedProducts: res.likedProducts,
          };
          const check = updatedUser.likedProducts.find(
            (product) => product.key === productId
          );
          if (!check) {
            updatedData = [
              ...res.likedProducts,
              { key: productId, category: productCategory },
            ];
            updatedUser.likedProducts = updatedData;
          } else {
            updatedData = res.likedProducts.filter(
              (id) => id.key !== productId
            );
            updatedUser.likedProducts = updatedData;
          }
          this.http
            .patch(`${this.url}/musicShopUsers/${userId}.json`, updatedUser)
            .subscribe();
        })
      );
  }
  getAllLikedProducts(userId: string): Observable<Product[]> {
    return this.http
      .get<User>(`${this.url}/musicShopUsers/${userId}.json`)
      .pipe(
        switchMap((user: User) => {
          const getProductObservables = user.likedProducts.map((productId) =>
            this.getProductById(productId.key, productId.category)
          );

          return forkJoin(getProductObservables);
        })
      );
  }
  getProductById(id: string, category: string) {
    return this.http.get<Product>(
      `${this.url}/products/${category}/${id}.json`
    );
  }
  cartOperations(
    product: ProductKeyValue,
    operation: 'add' | 'remove',
    userId: string
  ) {
    return this.http
      .get<User>(`${this.url}/musicShopUsers/${userId}.json`)
      .pipe(
        map((res) => {
          let updatedData: ProductKeyValue[] = [product];
          let updatedUser: User = {
            email: res.email,
            checkout: res.checkout,
            address: res.address,
            cart: res.cart,
            isAdmin: res.isAdmin,
            photoUrl: res.photoUrl,
            likedProducts: res.likedProducts,
          };
          if (operation === 'add') {
            updatedUser.cart = [...res.cart, ...updatedData];
          } else {
            const checkProduct = updatedUser.cart.find(
              (prod) => prod.key === product.key
            );
            if (checkProduct) {
              updatedUser.cart = updatedUser.cart.filter((productKey) => {
                product.key !== productKey.key;
              });
            }
          }
          this.http
            .patch(`${this.url}/musicShopUsers/${userId}.json`, updatedUser)
            .subscribe();
        })
      );
  }
}
