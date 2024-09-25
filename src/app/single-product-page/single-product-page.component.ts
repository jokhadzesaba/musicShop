import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { Product, ProductKeyAndType } from '../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-single-product-page',
  templateUrl: './single-product-page.component.html',
  styleUrl: './single-product-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleProductPageComponent implements OnInit {
  public product?: Product | undefined;
  public images!: string[];
  public cuurentIndex: number = 0;
  public minSize = 0;
  public maxSize = 0;
  public focusedImg = this.product?.photoUrl?.[0];
  public prodId = '';
  public likedProducts?: ProductKeyAndType[];
  public userId = '';
  public isLiked = false;
  public userEmail = '';
  constructor(
    private sharedService: SharedServiceService,
    private authService: LoginAndRegistrationService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authService.checkIfLoggedIn();
    this.route.queryParams.subscribe(() => {
      this.getProductInfo();
      this.getUserInfo();
    });
  }
  getUserInfo() {
    this.authService.loggedUser.subscribe((res) => {
      this.userId = res?.key!;
      this.userEmail = res?.user.email!;
      this.likedProducts = res?.user.likedProducts;
      this.checkIfliked();
    });
  }

  getProductInfo() {
    this.route.queryParams.pipe(take(1)).subscribe((res) => {
      this.sharedService
        .getProductById(res['prod'], res['type'])
        .pipe(take(1))
        .subscribe((product: Product) => {
          this.product = product;
          this.images = product.photoUrl;
          this.prodId = res['prod'];
          this.cuurentIndex = 0;
          this.focusedImg = this.product?.photoUrl?.[0];
          this.cd.detectChanges();
        });
    });
  }

  switchImage(index: number) {
    this.cuurentIndex = index;
  }
  checkIfliked() {
    if (this.likedProducts) {
      const prod = this.likedProducts.find((x) => x.key === this.prodId);
      if (prod) {
        this.isLiked = true;
      } else {
        this.isLiked = false;
      }
    }
  }
  likeProduct(process: 'like' | 'unlike') {
    this.sharedService
      .likeUnlikeProduct(
        this.prodId,
        this.product?.category!,
        this.userId,
        this.likedProducts!
      )
      .subscribe(() => {
        if (this.likedProducts) {
          if (process === 'unlike') {
            this.isLiked = false;
          } else if (process === 'like') {
            this.isLiked = true;
          }

          this.cd.detectChanges();
          this.authService.findUser(this.userEmail).subscribe((res) => {
            this.authService.loggedUser.next(res);
          
            if (process === 'unlike') {
              this.likedProducts = this.likedProducts?.filter(
                (x) => x.key !== this.prodId
              );
              this.isLiked = false;
            } else if (process === 'like') {
              this.likedProducts?.push({
                key: this.prodId,
                category: this.product?.category!,
              });
              this.isLiked = true;
            }
          
            // Update localStorage here with the latest user state
            localStorage.setItem('currentUser', JSON.stringify(res));
            this.cd.detectChanges();
          });
        }
      });
  }
  scroll(direction: 'left' | 'right') {
    if (direction === 'right') {
      this.images.unshift(this.images.pop()!);
    } else {
      this.images.push(this.images.shift()!);
    }
  }

  addInCart() {
    this.cartService.cartOperations('add', {
      key: this.prodId,
      product: this.product!,
    });
  }
}
