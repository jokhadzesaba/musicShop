import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductKeyAndType } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SngPageService {
  public prodId = new BehaviorSubject<ProductKeyAndType[] |undefined>(undefined);
  constructor() {}
}
