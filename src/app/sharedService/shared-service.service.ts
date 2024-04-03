import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Cart,
  Product,
  ProductKeyAndType,
  ProductKeyValue,
  User,
} from '../interfaces';
import { BehaviorSubject, Observable, forkJoin, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  public detectChanges = new BehaviorSubject<boolean>(false);
  public cart = new BehaviorSubject<Cart[]>([]);
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
  ifDetectChanges() {
    this.detectChanges.next(!this.detectChanges.value);
    return this.detectChanges.value;
  }
  getTypeOfProduct(
    category: 'drum' | 'bass' | 'guitar' | 'piano' | 'other'
  ): Observable<ProductKeyValue[]> {
    return this.http
      .get<ProductKeyValue>(`${this.url}/products/${category}.json`)
      .pipe(
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
  public cartOperations(operation: 'add' | 'remove', product: ProductKeyValue) {
    const currentCart = this.cart.getValue();
    let newCart = [];
    if (operation === 'add') {
      newCart = [...currentCart, {quantity:1,product:product}];
      this.cart.next(newCart);
    } else {
      newCart = currentCart.filter((x) => {
        return x.product.key !== product.key;
      });
    }
    this.cart.next(newCart);
  }
}
