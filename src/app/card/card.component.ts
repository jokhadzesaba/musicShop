import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductKeyAndType, ProductKeyValue } from '../interfaces';
import { ReusableFormComponent } from '../reusable-form/reusable-form.component';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [FormsModule, CommonModule, ReusableFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() product!: ProductKeyValue;
  @Input() singleProdPage:boolean = false;
  @Output() removeEvent = new EventEmitter<{
    prodId: string;
    prodCategory: 'guitar' | 'bass' | 'piano' | 'drum' | 'other';
  }>();
  @Output() editEvent = new EventEmitter<{
    form: any;
    prodId: string;
    prodCategory: 'guitar' | 'bass' | 'piano' | 'drum' | 'other';
  }>();
  
  public isAdmin?: Observable<boolean>;
  public isEditing: string = '';
  constructor(
    private sharedService: SharedServiceService,
    private authService: LoginAndRegistrationService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.authService.checkIfLoggedIn();
    this.authService.loggedUser.subscribe((user) => {
      this.authService.isAdmin.next(user?.user.isAdmin!);
      this.isAdmin = this.authService.isAdmin.asObservable(); 
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
  likeUnlikeProduct() {   
    this.authService.loggedUser.pipe(take(1)).subscribe((res) => {
      if (res !== undefined) {
        this.sharedService
          .likeUnlikeProduct(
            this.product?.key!,
            res.key,
            this.product?.product.category!
          )
          .subscribe(() => {
            setTimeout(() => {
              this.cd.detectChanges();
            }, 300);
            this.cd.detectChanges();
          });
      }
    }, (err: any) => {
      console.error('Error in likeUnlikeProduct:', err);
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
  }
  addInCart() {
    this.sharedService.cartOperations('add', this.product!);
  }
  checkIfliked(): boolean {
    let isLiked = false;
    this.authService.loggedUser.pipe(take(1)).subscribe((user) => {
      if (user && user.user.likedProducts) {
       const likedProduct = user.user.likedProducts.find(x=>x.key === this.product.key);
       isLiked = likedProduct !== undefined
      }
    });
    return isLiked;
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
}
