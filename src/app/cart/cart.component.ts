import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  OnInit,
} from '@angular/core';
import { Component } from '@angular/core';
import { Cart, ProductKeyValue } from '../interfaces';
import { CommonModule } from '@angular/common';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
})
export class CartComponent implements OnInit {
  @Input() showCart?: boolean = true;
  @Input() userEmail?: string;

  public cart$?: Observable<Cart[]>;
  constructor(
    private sharedService: SharedServiceService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.cart$ = this.sharedService.cart.asObservable();
  }
  removeFromCart(product: ProductKeyValue) {
    this.sharedService.cartOperations('remove', product);
  }
  nav(productId: string, type: string) {
    this.router.navigate([`single-product/${productId}`], {
      queryParams: { type: type, prod: productId },
    });
  }
}
