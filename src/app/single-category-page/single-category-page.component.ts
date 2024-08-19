import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
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
  public isAdmin: boolean = false;
  public products!: ProductKeyValue[];
  public UnChangedProducts!: ProductKeyValue[];
  public isEditing: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedServiceService,
    private authService: LoginAndRegistrationService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.getProducts();
    let user = JSON.parse(localStorage.getItem('currentUser')!);
    if (user) {
      this.isAdmin = user.user.isAdmin;
    }
    this.cd.detectChanges();
    console.log(this.isAdmin);
  }
  onRemove(
    data: { prodId: string; prodCategory: 'guitar' | 'bass' | 'piano' | 'drum' | 'other' }
  ) {
    this.sharedService.removeProduct(data.prodCategory, data.prodId).subscribe(() => {
      this.products = this.products.filter((x) => x.key !== data.prodId);
      this.cd.detectChanges();
    });
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
    this.cd.detectChanges();
  }
  onEdit(
    data: {
      form: any;
      prodId: string;
      prodCategory: 'guitar' | 'bass' | 'piano' | 'drum' | 'other';
    }
  ) {
    this.sharedService.editProduct(data.form, data.prodId, data.prodCategory).subscribe(() => {
      this.sharedService.updateProductArray(data.form, this.products, data.prodId);
      this.cd.detectChanges()
    });
  }
}
