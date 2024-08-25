import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { Product, ProductKeyAndType } from '../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { take } from 'rxjs';

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
  constructor(
    private sharedService: SharedServiceService,
    private authService: LoginAndRegistrationService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.authService.checkIfLoggedIn();
    this.getProductInfo();

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
          this.cd.detectChanges();
        });
    });
  }

  switchImage(index: number) {
    this.cuurentIndex = index;
  }
  scroll(direction: 'left' | 'right') {
    if (direction === 'right') {
      this.images.unshift(this.images.pop()!);
    } else {
      this.images.push(this.images.shift()!);
    }
  }

  addInCart() {
    this.sharedService.cartOperations('add', {
      key: this.prodId,
      product: this.product!,
    });
  }
}
