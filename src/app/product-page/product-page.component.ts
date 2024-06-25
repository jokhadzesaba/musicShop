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
  public isAdmin?: boolean = false;
  public isEditing?:string = '';
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
        this.authService.likedProducts.subscribe(
          (likedProducts: ProductKeyAndType[]) => {
            this.likedProducts = likedProducts;
          }
        );
        this.authService.loggedUser.subscribe((user) => {
          this.isAdmin = user?.user.isAdmin;
        });
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
    return price - Math.round((price * discount) / 100);
  }
  removeProduct(
    productType: 'guitar' | 'piano' | 'bass' | 'drum' | 'other',
    prodId: string
  ) {
    this.sharedService.removeProduct(productType, prodId).subscribe(() => {
      if (productType === 'guitar') {
        this.guitarProducts = this.guitarProducts.filter(
          (x) => x.key !== prodId
        );
      } else if (productType === 'bass') {
        this.bassProducts = this.bassProducts.filter((x) => x.key !== prodId);
      } else if (productType === 'piano') {
        this.pianoProducts = this.pianoProducts.filter((x) => x.key !== prodId);
      } else if (productType === 'drum') {
        this.drumProducts = this.drumProducts.filter((x) => x.key !== prodId);
      } else if (productType === 'other') {
        this.otherProducts = this.otherProducts.filter((x) => x.key !== prodId);
      }
      this.cd.detectChanges();
    });
  }
  editing(productId:string){
    this.isEditing = productId
  }
  cancelEditing(){
    this.isEditing = '';
  }
  onFormSubmitted(formData: any,prodId:string, categoty:'guitar'|'bass'|'piano'|'drum'|'other') {
    this.sharedService.editProduct(formData,prodId,categoty).subscribe(()=>{
      if (categoty === 'guitar') {;
        this.updateProductArray(formData, this.guitarProducts,prodId);
      }else if(categoty === 'bass'){
        this.updateProductArray(formData, this.bassProducts,prodId);
      }else if(categoty === 'piano'){
        this.updateProductArray(formData, this.pianoProducts,prodId);
      }else if(categoty === 'drum'){
        this.updateProductArray(formData, this.drumProducts,prodId);
      }
    })
  }
  updateProductArray(formData:any,array:ProductKeyValue[],prodId:string){
    let index = array.findIndex(x=>x.key === prodId);
    if (formData.discount) {
      array[index].product.discount = formData.discount
    }
    if (formData.model) {
      array[index].product.model = formData.model
    }
    if (formData.price) {
      array[index].product.price = formData.price
    }
    if (formData.description) {
      array[index].product.description = formData.description
    }
    if (formData.quantity) {
      array[index].product.quantity = formData.quantity
    }
    this.cd.detectChanges()
  }
}
