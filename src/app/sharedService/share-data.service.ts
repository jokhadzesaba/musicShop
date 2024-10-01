import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map } from 'rxjs';
import { ProductKeyValue } from '../interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ShareDataService {
  public url = 'https://musicshop-88945-default-rtdb.firebaseio.com/';
  public allProducts = new BehaviorSubject<ProductKeyValue[]>([]);
  public topProducts = new BehaviorSubject<ProductKeyValue[]>([]);
  public guitarProducts = new BehaviorSubject<ProductKeyValue[]>([]);
  public pianoProducts = new BehaviorSubject<ProductKeyValue[]>([]);
  public bassProducts = new BehaviorSubject<ProductKeyValue[]>([]);
  public drumProducts = new BehaviorSubject<ProductKeyValue[]>([]);
  private topProductUpdated = new BehaviorSubject<{img:string,key:string}>({img:'none',key:'none'});
  topProductUpdated$ = this.topProductUpdated.asObservable();
  constructor(private http: HttpClient) {}
  getData(data?: 'guitar' | 'piano' | 'bass' | 'drum' | 'other') {
    if (data === 'guitar') {
      return this.guitarProducts;
    } else if (data === 'bass') {
      return this.bassProducts;
    } else if (data === 'drum') {
      return this.drumProducts;
    } else if (data === 'piano') {
      return this.pianoProducts;
    } else {
      return this.allProducts;
    }
  }
  emitTopProductUpdate(img:string,key:string) {
    this.topProductUpdated.next({img:img,key:key});
  }
  getAllTopProduct() {
    this.allProducts.subscribe((allProduct) => {
      const allProducts = this.mapKeyValue(allProduct);
      const topProducts = allProducts.filter(
        (top) => top.product.isTopProduct === true
      );
      console.log(topProducts);
      this.topProducts.next(topProducts);
    });
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
        this.allProducts.next(results);
        const allProds = this.mapKeyValue(results);
        const guitarProds = allProds.filter(
          (pr) => pr.product.category === 'guitar'
        );
        const pianoProds = allProds.filter(
          (pr) => pr.product.category === 'piano'
        );
        const bassProds = allProds.filter(
          (pr) => pr.product.category === 'bass'
        );
        const drumProds = allProds.filter(
          (pr) => pr.product.category === 'drum'
        );
        this.guitarProducts.next(guitarProds);
        this.pianoProducts.next(pianoProds);
        this.bassProducts.next(bassProds);
        this.drumProducts.next(drumProds);
        this.getAllTopProduct();
        return results;
      })
    );
  }
  mapKeyValue(data: ProductKeyValue[]) {
    const allProducts = data.flatMap((productList) =>
      Object.entries(productList).map(([key, product]) => ({
        key,
        product,
      }))
    );
    return allProducts;
  }
}
