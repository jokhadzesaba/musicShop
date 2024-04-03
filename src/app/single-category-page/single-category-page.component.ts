import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { KeyValueUser, ProductKeyValue } from '../interfaces';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';

@Component({
  selector: 'app-single-category-page',
  templateUrl: './single-category-page.component.html',
  styleUrl: './single-category-page.component.scss',
})
export class SingleCategoryPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedServiceService,
    private authService: LoginAndRegistrationService
  ) {}
  public products!: ProductKeyValue[];
  ngOnInit(): void {
    this.route.params.subscribe((res) => {
      this.sharedService.getTypeOfProduct(res['category']).subscribe((res) => {
        this.products = res;
        console.log(res);
      });
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
    this.sharedService.cartOperations('add', product);
  }
}
