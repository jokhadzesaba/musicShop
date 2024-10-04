import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductKeyAndType } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class IdService {
  public prodId = new BehaviorSubject<ProductKeyAndType[] |undefined>(undefined);
  constructor() {}

}
