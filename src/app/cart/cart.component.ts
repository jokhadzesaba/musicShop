import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Component } from '@angular/core';
import { Cart, ProductKeyValue } from '../interfaces';
import { CommonModule } from '@angular/common';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxPayPalModule, IPayPalConfig } from 'ngx-paypal';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, NgxPayPalModule],
})
export class CartComponent implements OnInit {
  @Input() showCart?: boolean = true;
  @Input() userEmail?: string;
  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef;
  public cart$?: Observable<Cart[]>;
  public payPalConfig?: IPayPalConfig;
  constructor(
    private sharedService: SharedServiceService,
    private router: Router,
    private authService: LoginAndRegistrationService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.cart$ = this.sharedService.cart.asObservable();
  }

  makePayment() {
    this.sharedService.buyProducts(
      this.sharedService.cart.getValue(),
      this.calculateTotalPrice(),
      this.authService.loggedUser.getValue()?.user.email!,
      this.authService.loggedUser.getValue()?.key
    );
  }
  removeFromCart(product: ProductKeyValue) {
    this.sharedService.cartOperations('remove', product);
    this.calculateTotalPrice();
  }
  nav(productId: string, type: string) {
    this.router.navigate([`single-product/${productId}`], {
      queryParams: { type: type, prod: productId },
    });
  }
  plus(prodId: string, op: 'plus' | 'minus') {
    let cart = this.sharedService.cart.getValue();
    const index = cart.findIndex((id) => id.product.key === prodId);
    if (op === 'plus') {
      cart[index].quantity++;
    } else {
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      }
    }
    this.sharedService.cart.next(cart);
  }
  calculateTotalPrice() {
    let sum = 0;
    this.sharedService.cart.getValue().forEach((x) => {
      if (x.product.product.discount > 0) {
        const discount =
          x.quantity *
          (x.product.product.price -
            this.calculateDiscount(
              x.product.product.price,
              x.product.product.discount
            ));
            sum += discount
      } else {
        sum += x.quantity * x.product.product.price;
      }
    });
    return sum;
  }
  calculateDiscount(price: number, discount: number) {
    return Math.round((price * discount) / 100);
  }
}
