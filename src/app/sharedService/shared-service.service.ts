import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import {
  Cart,
  Product,
  ProductKeyAndType,
  ProductKeyValue,
  Purchase,
  User,
} from '../interfaces';
import {
  BehaviorSubject,
  Observable,
  catchError,
  forkJoin,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  public detectChanges = new BehaviorSubject<boolean>(false);
  
  public url =
    'https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app';
  constructor(
    private http: HttpClient,
    private service: LoginAndRegistrationService
  ) {}

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
  getAllTypeOfProduct() {
    const data1 = this.http.get<ProductKeyValue>(
      `${this.url}/products/guitar.json`
    );
    const data2 = this.http.get<ProductKeyValue>(
      `${this.url}/products/piano.json`
    );
    const data3 = this.http.get<ProductKeyValue>(
      `${this.url}/products/bass.json`
    );
    const data4 = this.http.get<ProductKeyValue>(
      `${this.url}/products/drum.json`
    );
    return forkJoin<ProductKeyValue[]>([data1, data2, data3, data4]).pipe(
      map((results) => {
        return results;
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
        tap((res: User) => {
          let updatedUser = this.service.loggedUser.value?.user;
          let updatedData = this.service.likedProducts.value;

          if (updatedUser) {
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
            this.service.likedProducts.next(updatedData);
          }
          this.http
            .patch(`${this.url}/musicShopUsers/${userId}.json`, updatedUser)
            .subscribe();
        })
      );
  }

  getAllLikedProducts(userId: string) {}

  getProduct(id: string, category: string): Observable<ProductKeyValue> {
    return this.http.get<ProductKeyValue>(
      `${this.url}/products/${category}/${id}.json`
    );
  }

  getProductById(id: string, category: string) {
    return this.http.get<Product>(
      `${this.url}/products/${category}/${id}.json`
    );
  }

  buyProducts(
    items: Cart[],
    totalPrice: number,
    email: string,
    userId?: string
  ) {
    const newPurchase: Purchase = {
      userId: userId,
      email: email,
      date: new Date(),
      totalPrice: totalPrice,
      products: items,
    };
    const adminUpdate$ = this.http
      .get<User>(`${this.url}/musicShopUsers/-NuwyYV_Xx3Z9YdV7qOv.json`)
      .pipe(
        switchMap((res: User) => {
          res.purchasedProducts = [...res.purchasedProducts!, newPurchase];
          return this.http.patch(
            `${this.url}/musicShopUsers/-NuwyYV_Xx3Z9YdV7qOv.json`,
            res
          );
        }),
        catchError((error) => {
          console.error('Error in adminUpdate$', error);
          return of(null);
        })
      );

    let userUpdate$: Observable<any> = of(null);

    if (userId) {
      userUpdate$ = this.http
        .get<User>(`${this.url}/musicShopUsers/${userId}.json`)
        .pipe(
          switchMap((res: User) => {
            res.purchasedProducts = [...res.purchasedProducts, newPurchase];
            return this.http.patch(
              `${this.url}/musicShopUsers/${userId}.json`,
              res
            );
          }),
          catchError((error) => {
            console.error('Error in userUpdate$', error);
            return of(null);
          })
        );
    }
    forkJoin([adminUpdate$, userUpdate$]).subscribe();
  }
  public removeProduct(
    productType: 'guitar' | 'piano' | 'bass' | 'drum' | 'other',
    prodId: string
  ) {
    return this.http.delete(
      `${this.url}/products/${productType}/${prodId}.json`
    );
  }
  public editProduct(
    formData: any,
    prodId: string,
    category: 'guitar' | 'bass' | 'piano' | 'drum' | 'other'
  ) {
    return this.http
      .get<Product>(`${this.url}/products/${category}/${prodId}.json`)
      .pipe(
        tap((res: Product) => {
          if (formData.model) {
            res.model = formData.model;
          }
          if (formData.price) {
            res.price = formData.price;
          }
          if (formData.discount) {
            res.discount = formData.discount;
          }
          if (formData.quantity) {
            res.quantity = formData.quantity;
          }
          if (formData.description) {
            res.description = formData.description;
          }
          this.http
            .patch<Product>(
              `${this.url}/products/${category}/${prodId}.json`,
              res
            )
            .subscribe();
        })
      );
  }
  updateProductArray(formData: any, array: ProductKeyValue[], prodId: string) {
    let index = array.findIndex((x) => x.key === prodId);
    if (formData.discount) {
      array[index].product.discount = formData.discount;

      if (formData.model) {
        array[index].product.model = formData.model;
      }
      if (formData.price) {
        array[index].product.price = formData.price;
      }
      if (formData.description) {
        array[index].product.description = formData.description;
      }
      if (formData.quantity) {
        array[index].product.quantity = formData.quantity;
      }
    }
  }
  getRandomProducts(category: 'drum' | 'bass' | 'guitar' | 'piano' | 'other') {
    return this.getTypeOfProduct(category).pipe(
      map((res) => {
        let counter = 4;
        const randomProducts: ProductKeyValue[] = [];
        const randomIndexes: number[] = [];
        while (counter !== 0) {
          if (res.length <= counter) {
            return res;
          }
          const randomIndex = Math.floor(Math.random() * res.length);
          if (randomIndexes.includes(randomIndex)) {
            continue;
          } else {
            randomProducts.push(res[randomIndex]);
            randomIndexes.push(randomIndex);
            counter--;
          }
        }
        return randomProducts;
      })
    );
  }
  checkIfLiked(id: string, userId: string): Observable<boolean> {
    return this.http
      .get<User>(`${this.url}/musicShopUsers/${userId}.json`)
      .pipe(
        map((res) => !!res.likedProducts.find((prodId) => prodId.key === id))
      );
  }
  updateProductPagePosition(productsArray: ProductKeyValue[], category: 'guitar' | 'bass' | 'piano' | 'drum' | 'other') {
    const productsObject = productsArray.reduce((obj, item) => {
      obj[item.key] = {
        ...item.product,
        discount: Number(item.product.discount), // Ensure discount is a number
        price: Number(item.product.price), // Ensure price is a number
      };
      return obj;
    }, {} as { [key: string]: Product });
  
    this.http.put(`${this.url}/products/${category}.json`, productsObject).subscribe({
      next: (response) => {
        console.log('Update successful', response);
      },
      error: (error) => {
        alert("something went wrong try again later")
      }
    });
  }
}
