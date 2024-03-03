import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeyValueUser, Product, ProductKeyValue, User } from '../interfaces';
import { Observable, catchError, map, tap } from 'rxjs';

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
    photos: string[]
  ) {
    const product: Product = {
      category: category,
      model: model,
      price: parseInt(price),
      quantity: parseInt(quantity),
      discount: parseInt(discount),
      photoUrl: photos,
    };
    return this.http.post(`${this.url}/${category}.json`, product);
  }

  getTypeOfProduct(category: 'drum' | 'bass' | 'guitar' | 'piano' | 'other'):Observable<ProductKeyValue[]> {
    return this.http.get(`${this.url}/products/${category}.json`).pipe(
      map((responese) => {
        let productsArray: ProductKeyValue[] = [];
        Object.entries(responese).forEach(([keys, products]) =>
          productsArray.push({ key: keys, product: products })
        );
        return productsArray;
      }),
    );
  }
  likeUnlikeProduct(productId: string, userId: string) {
    return this.http
      .get<User>(`${this.url}/musicShopUsers/${userId}.json`)
      .subscribe((res: User) => {
        let updatedData: string[] = [];
        let updatedUser: User = {
          email: res.email,
          checkout: res.checkout,
          address: res.address,
          cart: res.cart,
          isAdmin: res.isAdmin,
          photoUrl: res.photoUrl,
          likedProducts: res.likedProducts,
        };
        if (!res.likedProducts.includes(productId)) {
          updatedData = [...res.likedProducts, productId];
          updatedUser.likedProducts = updatedData;
        } else {
          updatedData = res.likedProducts.filter((id) => id !== productId);
          updatedUser.likedProducts = updatedData;
        }
        this.http
          .patch(`${this.url}/musicShopUsers/${userId}.json`, updatedUser)
          .subscribe();
      });
  }
  getAllLikedProducts(userId:string){
   return this.http.get<User>(`${this.url}/musicShopUsers/${userId}.json`).pipe(map((user:User)=>{
    let likedProducts:ProductKeyValue[] = []
    user.likedProducts.forEach(productId=>this.getProductById(productId).subscribe(res=>{
      likedProducts.push(res)
    }))
    return likedProducts
   })
   )
  }
  getProductById(id: string) {
    return this.http.get<ProductKeyValue>(`${this.url}/products/${id}.json`);
  }

}
