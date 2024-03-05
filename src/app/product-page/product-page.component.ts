import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { ProductKeyValue } from '../interfaces';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';

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
    private authService: LoginAndRegistrationService
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
        this.sharedService.likeUnlikeProduct(
          productId,
          res.key,
          productCategory
        );
      }
    }),
      (err: any) => {
        console.log('Error productPage: likeUnlikeProduct method: ', err);
      },
      () => {
        console.log('subscription completed');
      };
  }
}
