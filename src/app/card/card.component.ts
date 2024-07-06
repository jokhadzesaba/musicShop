import { CommonModule } from '@angular/common';
import {
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

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [FormsModule, CommonModule, ReusableFormComponent],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() product!: ProductKeyValue;
  @Output() removeEvent = new EventEmitter<{
    prodId: string;
    prodCategory: 'guitar' | 'bass' | 'piano' | 'drum' | 'other';
  }>();
  @Output() editEvent = new EventEmitter<{
    form: any;
    prodId: string;
    prodCategory: 'guitar' | 'bass' | 'piano' | 'drum' | 'other';
  }>();
  public isAdmin?:boolean = false;
  public likeProducts: ProductKeyAndType[] = [];
  public isEditing: string = '';
  constructor(
    private sharedService: SharedServiceService,
    private authService: LoginAndRegistrationService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.authService.likedProducts.subscribe((res) => {
      this.likeProducts = res;
      
    });
    this.isAdmin = this.authService.loggedUser.value?.user.isAdmin
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
    this.authService.loggedUser.subscribe((res) => {
      if (res !== undefined) {
        this.sharedService
          .likeUnlikeProduct(
            this.product?.key!,
            res.key,
            this.product?.product.category!
          )
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
  checkIfliked() {
    return this.likeProducts.some((prod) => prod.key === this.product?.key);
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
      form:formData,
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
    this.cancelEditing()
    
  }
}
