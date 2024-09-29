import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductKeyValue } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ShareDataService {
  public allProducts = new BehaviorSubject<ProductKeyValue[]>([]);
  public topProducts = new BehaviorSubject<ProductKeyValue[]>([]);
  public guitarProducts = new BehaviorSubject<ProductKeyValue[]>([]);
  public pianoProducts = new BehaviorSubject<ProductKeyValue[]>([]);
  public bassProducts = new BehaviorSubject<ProductKeyValue[]>([]);
  public drumProducts = new BehaviorSubject<ProductKeyValue[]>([]);

  constructor() {}
  getData(data?:  'guitar' | 'piano' | 'bass' | 'drum' |'other') {
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
}
