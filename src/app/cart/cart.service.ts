import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, ProductKeyValue } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cart = new BehaviorSubject<Cart[]>([]);
  @Output() cartArr = new EventEmitter<Cart[]>()
  constructor() { }
  cartOperations(operation: 'add' | 'remove', product: ProductKeyValue) {
    let currentCart = this.cart.getValue();
    const checkIfInCart = currentCart.findIndex(
      (prod) => prod.product.key === product.key
    );
    let newCart = [...currentCart];

    if (checkIfInCart !== -1) {
      if (operation === 'add') {
        newCart[checkIfInCart].quantity++;
      } else {
        newCart.splice(checkIfInCart, 1);
      }
    } else {
      if (operation === 'add') {
        newCart.push({ quantity: 1, product: product });
      }
    }
    this.cart.next(newCart);
    localStorage.setItem('cart', JSON.stringify(this.cart.value));
  }
}
