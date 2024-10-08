import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductKeyAndType, ProductKeyValue } from '../../interfaces';
import { ReusableFormComponent } from '../../reusable-form/reusable-form.component';
import { SharedServiceService } from '../../sharedService/shared-service.service';
import { LoginAndRegistrationService } from '../../loginAndRegistration/services/login.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../../cart/cart.service';
import { ProductPageComponent } from '../../product-page/product-page.component';
import { UpperCasePipe } from '../../pipes/upper-case.pipe';
import { ShareDataService } from 'src/app/sharedService/share-data.service';
import { IdService } from 'src/app/sharedService/id.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [FormsModule, CommonModule, ReusableFormComponent, UpperCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() showSpecificContent = false;
  @Input() product!: ProductKeyValue;
  @Input() singleProdPage: boolean = false;
  @Output() removeEvent = new EventEmitter<{
    prodId: string;
    prodCategory: 'guitar' | 'bass' | 'piano' | 'drum' | 'other';
  }>();
  @Output() editEvent = new EventEmitter<{
    form: any;
    prodId: string;
    prodCategory: 'guitar' | 'bass' | 'piano' | 'drum' | 'other';
  }>();
  @Output() topProds = new EventEmitter<boolean>();
  public isAdmin?: Observable<boolean>;
  public isEditing: string = '';
  public likedProds?: ProductKeyAndType[];
  public userID?: string;
  isUsedInSpecificParent = false;
  public isTopProduct = false;
  public isLiked = false;
  constructor(
    private sharedService: SharedServiceService,
    private authService: LoginAndRegistrationService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private cartService: CartService,
    private dataService: ShareDataService,
    private idService: IdService,
    @Optional() private specificParent: ProductPageComponent
  ) {
    if (this.specificParent) {
      this.isUsedInSpecificParent = true;
    }
  }
  ngOnInit(): void {
    this.authService.checkIfLoggedIn();
    this.authService.loggedUser.subscribe((user) => {
      this.isAdmin = this.authService.isAdmin.asObservable();
      this.userID = user?.key;
      this.isProductIntop();
      this.isProdLiked();
    });
  }
  removeProduct() {
    this.sharedService
      .removeProduct(this.product?.product.category!, this.product?.key!)
      .subscribe(() => {
        this.removeEvent.emit({
          prodId: this.product?.key!,
          prodCategory: this.product?.product.category!,
        });
        this.dataService.emitTopProductUpdate(this.product.key, 'remove');
        this.cd.detectChanges();
      });
  }

  navigation() {
    this.router.navigate([`single-product/${this.product?.key}`], {
      queryParams: {
        type: this.product?.product.category,
        prod: this.product?.key,
      },
    });
    this.cd.detectChanges();
  }
  addInCart() {
    this.cartService.cartOperations('add', this.product!);
  }

  navigateToCategotyPage() {
    this.router.navigate([`categoty/${this.product?.product.category}`]);
  }
  calculateDiscount() {
    return (
      this.product?.product.price! -
      Math.round(
        (this.product?.product.price! * this.product?.product.discount!) / 100
      )
    );
  }
  editing() {
    this.isEditing = this.product?.key!;
  }
  cancelEditing() {
    this.isEditing = '';
  }
  onFormSubmit(formData: any) {
    this.editEvent.emit({
      form: formData,
      prodId: this.product?.key!,
      prodCategory: this.product?.product?.category!,
    });
    if (formData.model) {
      this.product.product.model = formData.model;
    }
    if (formData.price) {
      this.product.product.price = formData.price;
    }
    if (formData.discount) {
      this.product.product.discount = formData.discount;
    }
    if (formData.quantity) {
      this.product.product.quantity = formData.quantity;
    }
    if (formData.description) {
      this.product.product.description = formData.description;
    }
    this.cancelEditing();
  }

  firstLetterUpperCase(word: string) {
    return word.charAt(0).toUpperCase() + word.substring(1, word.length);
  }
  makeItTop() {
    this.sharedService
      .makeTopProduct(this.product.key, this.product.product.category)
      .subscribe(() => {
        if (this.isTopProduct) {
          this.isTopProduct = false;
          this.dataService.emitTopProductUpdate(this.product.key, 'remove');
        } else {
          this.isTopProduct = true;
          this.dataService.emitTopProductUpdate(
            this.product.key,
            'add',
            this.product.product.photoUrl[0]
          );
        }
        this.cd.detectChanges();
      });
  }
  isProductIntop() {
    this.dataService.topProducts.subscribe((res) => {
      if (res.find((x) => x.key === this.product.key)) {
        this.isTopProduct = true;
      }
    });
  }
  likeOrUnlikeProd() {
    this.sharedService
      .likeUnlikeProduct(
        this.product.key,
        this.product.product.category,
        this.userID!,
        this.idService.prodId.value!
      )
      .subscribe(() => {
        this.isLiked = !this.isLiked;
        this.cd.detectChanges()
      });
  }
  isProdLiked() {
    this.idService.prodId.subscribe((res) => {
      if (res) {
        if (res.find((x) => x.key === this.product.key)) {
          this.isLiked = true;
        }
      }
    });
  }
}
