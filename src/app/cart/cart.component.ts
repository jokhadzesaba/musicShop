import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  OnInit,
} from '@angular/core';
import { Component } from '@angular/core';
import { KeyValueUser, ProductKeyValue } from '../interfaces';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { CommonModule } from '@angular/common';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule,RouterModule],
})
export class CartComponent implements OnInit {
  @Input() showCart?: boolean = true;
  @Input() userEmail?: string;
  public cart?: ProductKeyValue[];
  constructor(
    private authService: LoginAndRegistrationService,
    private cd: ChangeDetectorRef,
    private sharedService:SharedServiceService,
    private router:Router

  ) {}
  ngOnInit(): void {
    if (this.userEmail) {
      this.authService
        .findUser(this.userEmail)
        .subscribe((user: KeyValueUser | undefined) => {
          this.cart = user?.user.cart;
          this.cd.detectChanges();
        });
    }
  }
  removeFromCart(product: ProductKeyValue) {
    this.authService.loggedUser.subscribe((res: KeyValueUser | undefined) => {
      if (res) {
        this.sharedService.cartOperations(product, 'remove', res.key!).subscribe();
      }
    });
  }
  nav(productId:string,type:string){
    this.router.navigate([`single-product/${productId}`], {
      queryParams: { type: type, prod: productId },
    });
  }
}
