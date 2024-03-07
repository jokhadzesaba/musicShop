import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { Product } from '../interfaces';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-product-page',
  templateUrl: './single-product-page.component.html',
  styleUrl: './single-product-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleProductPageComponent implements OnInit {
  public product?: Product;
  public images?:string[]

  constructor(
    private sharedService: SharedServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.getProductInfo();
  }
  getProductInfo() {
    this.route.queryParams.subscribe((res) => {
      this.sharedService
        .getProductById(res['prod'], res['type'])
        .subscribe((product: Product) => {
          this.product = product;
          this.images = product.photoUrl
          this.cd.detectChanges();
        });
    });
  }
}
