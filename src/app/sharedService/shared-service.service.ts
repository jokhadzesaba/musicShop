import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductKeyValue } from '../interfaces';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  public url =
    'https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app/products';
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

  getTypeOfProduct(category: 'drum' | 'bass' | 'guitar' | 'piano' | 'other') {
    return this.http
      .get(`${this.url}/${category}.json`)
      .pipe(map((responese) => {
        let productsArray:ProductKeyValue[] = [];
        Object.entries(responese).forEach(([keys, products])=>productsArray.push({key:keys,product:products}))
        return productsArray
      }));
  }
}
