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
import { ProductKeyAndType, ProductKeyValue } from '../interfaces';
import { ReusableFormComponent } from '../reusable-form/reusable-form.component';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, take, tap } from 'rxjs';
import { IsLikedComponent } from '../is-liked/is-liked.component';
import { CartService } from '../cart/cart.service';
import { ProductPageComponent } from '../product-page/product-page.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [FormsModule, CommonModule, ReusableFormComponent, IsLikedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
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
  @Output() shifting = new EventEmitter<{id:string,switchToPosition:number}>()
  position:number = 0
  public isAdmin?: Observable<boolean>;
  public isEditing: string = '';
  public likedProds?: ProductKeyAndType[];
  public userID?: string;
  isUsedInSpecificParent = false;
  @Input() showSpecificContent = false;

  constructor(
    private sharedService: SharedServiceService,
    private authService: LoginAndRegistrationService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private cartService:CartService,
    @Optional() private specificParent: ProductPageComponent
  ) {
    if (this.specificParent) {
      this.isUsedInSpecificParent = true;
    }
  }
  ngOnInit(): void {
    this.authService.checkIfLoggedIn();

    this.authService.likedProducts.subscribe((res) => {
      this.likedProds = res;
    });
    this.authService.loggedUser.subscribe((user) => {
      this.authService.isAdmin.next(user?.user.isAdmin!);
      this.isAdmin = this.authService.isAdmin.asObservable();
      this.userID = user?.key;
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
    this.cd.detectChanges()
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
  switch(position:number){
    this.shifting.emit({id:this.product.key,switchToPosition:position})
  }
}
function SkipSelf(): (target: typeof CardComponent, propertyKey: undefined, parameterIndex: 5) => void {
  throw new Error('Function not implemented.');
}

