import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { ProductKeyAndType, ProductKeyValue } from '../interfaces';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageComponent implements OnInit {
  public guitarProducts: ProductKeyValue[] = [];
  public pianoProducts: ProductKeyValue[] = [];
  public bassProducts: ProductKeyValue[] = [];
  public drumProducts: ProductKeyValue[] = [];
  public otherProducts: ProductKeyValue[] = [];
  public loading: boolean = true;
  public likedProducts: ProductKeyAndType[] = [];

  constructor(
    private sharedService: SharedServiceService,
    private cd: ChangeDetectorRef,
    private authService: LoginAndRegistrationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.sharedService.getAllTypeOfProduct().subscribe((res) => {
      for (let index = 0; index < res.length; index++) {
        Object.entries(res[index]).forEach(([keys, products]) => {
          if (index === 0) {
            this.guitarProducts.push({ key: keys, product: products });
          } else if (index === 1) {
            this.pianoProducts.push({ key: keys, product: products });
          } else if (index === 2) {
            this.bassProducts.push({ key: keys, product: products });
          } else if (index === 3) {
            this.drumProducts.push({ key: keys, product: products });
          }
        });
        this.loading = false;
        this.authService.likedProducts.subscribe(
          (likedProducts: ProductKeyAndType[]) => {
            this.likedProducts = likedProducts;
          }
        );
        this.cd.detectChanges();
      }
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

  checkIfliked(productKey: string) {
    return this.likedProducts.some((prod) => prod.key === productKey);
  }
  navigateToCategotyPage(categoty: string) {
    this.router.navigate([`categoty/${categoty}`]);
  }
  calculateDiscount(price: number, discount: number) {
    return Math.round((price * discount) / 100);
  }
}
