import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { ProductForm, ProductKeyAndType, ProductKeyValue } from '../interfaces';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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
  public isEditing?: string = '';
  public likedProducts: ProductKeyAndType[] = [];

  constructor(
    private sharedService: SharedServiceService,
    private cd: ChangeDetectorRef,
    private authService: LoginAndRegistrationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.authService.checkIfLoggedIn();
    this.getAllTypeOfProduct();
  }
  getAllTypeOfProduct() {
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
        this.authService.loggedUser.subscribe((user) => {
          this.authService.isAdmin.next(user?.user.isAdmin!); 
        });
        this.cd.detectChanges();
      }
    });
  }
  onFormSubmitted(data: {
    form: any;
    prodId: string;
    prodCategory: 'guitar' | 'bass' | 'piano' | 'drum' | 'other';
  }) {
    this.sharedService
      .editProduct(data.form, data.prodId, data.prodCategory)
      .subscribe(() => {
        if (data.prodCategory === 'guitar') {
          this.sharedService.updateProductArray(
            data.form,
            this.guitarProducts,
            data.prodId
          );
        } else if (data.prodCategory === 'bass') {
          this.sharedService.updateProductArray(
            data.form,
            this.bassProducts,
            data.prodId
          );
        } else if (data.prodCategory === 'piano') {
          this.sharedService.updateProductArray(
            data.form,
            this.pianoProducts,
            data.prodId
          );
        } else if (data.prodCategory === 'drum') {
          this.sharedService.updateProductArray(
            data.form,
            this.drumProducts,
            data.prodId
          );
        }
        this.cd.detectChanges()
      });
  }
  removeHandler(data: { prodId: string; prodCategory: string }) {
    if (data.prodCategory === 'guitar') {
      this.guitarProducts = this.guitarProducts.filter(
        (x) => x.key !== data.prodId
      );
    } else if (data.prodCategory === 'bass') {
      this.bassProducts = this.bassProducts.filter(
        (x) => x.key !== data.prodId
      );
    } else if (data.prodCategory === 'piano') {
      this.pianoProducts = this.pianoProducts.filter(
        (x) => x.key !== data.prodId
      );
    } else if (data.prodCategory === 'drum') {
      this.drumProducts = this.drumProducts.filter(
        (x) => x.key !== data.prodId
      );
    } else if (data.prodCategory === 'other') {
      this.otherProducts = this.otherProducts.filter(
        (x) => x.key !== data.prodId
      );
    }
    this.cd.detectChanges();
  }
}
