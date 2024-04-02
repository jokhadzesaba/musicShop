import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { KeyValueUser, ProductKeyValue } from '../interfaces';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageComponent implements OnInit {
  public guitarProducts?: ProductKeyValue[];
  constructor(
    private sharedService: SharedServiceService,
    private cd: ChangeDetectorRef,
    private authService: LoginAndRegistrationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.sharedService
      .getTypeOfProduct('guitar')
      .subscribe((res: ProductKeyValue[]) => {
        this.guitarProducts = res;
        this.cd.detectChanges();
      });
  }
  likeUnlikeProduct(
    productId: string,
    productCategory: 'guitar' | 'drum' | 'bass' | 'piano' | 'other'
  ) {
    this.authService.loggedUser.subscribe((res) => {
      if (res !== undefined) {
        this.sharedService
          .likeUnlikeProduct(productId, res.key, productCategory)
          .subscribe();
      }
    }),
      (err: any) => {
        console.log('Error productPage: likeUnlikeProduct method: ', err);
      },
      () => {
        console.log('subscription completed');
      };
  }
  navigation(productId: string, type: string) {
    this.router.navigate([`single-product/${productId}`], {
      queryParams: { type: type, prod: productId },
    });
  }
  addInCart(product: ProductKeyValue) {
    this.authService.loggedUser.subscribe((res: KeyValueUser | undefined) => {
      if (res) {
        this.sharedService.cartOperations(product, 'add', res.key!).subscribe();
      }
    });
  }
}
