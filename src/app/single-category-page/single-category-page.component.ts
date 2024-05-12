import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { ProductKeyAndType, ProductKeyValue } from '../interfaces';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';

@Component({
  selector: 'app-single-category-page',
  templateUrl: './single-category-page.component.html',
  styleUrl: './single-category-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleCategoryPageComponent implements OnInit {
  private likedProducts: ProductKeyAndType[] = [];
  public leftSlider = 0;
  public rightSlider = 10000;
  public searchWords = '';
  public products!: ProductKeyValue[];
  public UnChangedProducts!: ProductKeyValue[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedServiceService,
    private authService: LoginAndRegistrationService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.getProducts();
    this.cd.detectChanges()
    
  }

  getProducts() {
    this.route.params.subscribe((res) => {
      this.sharedService.getTypeOfProduct(res['category']).subscribe((res) => {
        this.products = res;
        this.UnChangedProducts = res;
        this.cd.detectChanges();
      });
      this.authService.likedProducts.subscribe(
        (likedProducts: ProductKeyAndType[]) => {
          this.likedProducts = likedProducts;
          this.cd.detectChanges();
        }
      );
    });
  }
  checkIfliked(productKey: string) {
    return this.likedProducts.some((prod) => prod.key === productKey);
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

  searchWordInSentence(sentence: string) {
    const words = this.searchWords.toUpperCase().split(' ');    
    let check = true;
    for (let i of words) {
      if (!sentence.toUpperCase().includes(i)) {
        check = false;
        return check;
      }
    }
    return check;
  }
  searchByRange(price: number) {
    if (this.leftSlider > this.rightSlider) {
      if (price < this.leftSlider && price > this.rightSlider) {
        return true;
      } else {
        return false;
      }
    } else {
      if (price > this.leftSlider && price < this.rightSlider) {
        return true;
      } else {
        return false;
      }
    }
  }
  filter() {
    this.products = this.UnChangedProducts.filter(
      (pr) =>
        this.searchByRange(pr.product.price) &&
        this.searchWordInSentence(pr.product.model)
        
    );    
    this.cd.detectChanges()
  }
}
