import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import {
  KeyValueUser,
  Product,
  ProductKeyAndType,
  ProductKeyValue,
} from '../interfaces';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedServiceService } from '../sharedService/shared-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  public user?: KeyValueUser;
  public likedProducts?: Product[];
  public likedProductsKeys: ProductKeyAndType[] = [];
  public photos: string[] = [];
  public form = this.fb.group({
    category: ['', [Validators.required]],
    model: ['', Validators.required],
    price: ['', Validators.required],
    quantity: ['', Validators.required],
    discount: ['', Validators.required],
    description: ['', Validators.required],
  });
  constructor(
    private authService: LoginAndRegistrationService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private sharedService: SharedServiceService
  ) {}
  ngOnInit(): void {
    this.authService.loggedUser.subscribe((user) => {
      this.user = user;
      this.likedProductsKeys = user?.user.likedProducts.slice(1)!;
      this.getLikedProducts(user!.key);
      this.form.patchValue({
        category: 'guitar',
      });
      this.cd.detectChanges();
    });
  }

  public update() {
    if (this.user?.user.email) {
      this.authService.findUser(this.user?.user.email).subscribe((res) => {
        this.user = res;
      });
    } else {
      throw new Error('no user email found');
    }
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photos.push(e.target?.result as string);
        this.cd.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
  removeImg(url: string) {
    const photoIndex = this.photos.findIndex((x) => x === url);
    this.photos.splice(photoIndex, photoIndex);
    console.log(this.photos);
  }
  addNewProduct() {
    const category = this.form.get('category')?.getRawValue();
    const model = this.form.get('model')?.getRawValue();
    const price = this.form.get('price')?.getRawValue();
    const discount = this.form.get('discount')?.getRawValue();
    const quantity = this.form.get('quantity')?.getRawValue();
    const description = this.form.get('description')?.getRawValue();
    this.sharedService
      .addProduct(category, model, price, quantity, discount, this.photos,description)
      .subscribe({
        next: () => {
          this.form.get('category')?.setValue('');
          this.form.get('model')?.setValue('');
          this.form.get('price')?.setValue('');
          this.form.get('discount')?.setValue('');
          this.form.get('quantity')?.setValue('');
          this.form.get('description')?.setValue('');
          alert('Product was added successfully');
        },
        error: (err) => {
          console.log('add product error: ' + err.message);
        },
        complete: () => {
          console.log('Subscription completed');
        },
      });
  }
  getLikedProducts(userId: string) {
    this.sharedService
      .getAllLikedProducts(userId)
      .subscribe((res: Product[]) => {
        this.likedProducts = res.slice(1);
        this.cd.detectChanges();
      });
  }
  likeUnlikeProduct(
    productId: string,
    category: 'guitar' | 'drum' | 'bass' | 'piano' | 'other'
  ) {
    this.authService.loggedUser.subscribe((res) => {
      if (res !== undefined) {
        this.sharedService
          .likeUnlikeProduct(productId, res.key, category)
          .subscribe(() => {
            this.getLikedProducts(res.key);
            this.cd.detectChanges()
          });
      }
    }),
      (err: any) => {
        console.log('Error productPage: likeUnlikeProduct method: ', err);
      },
      () => {
        console.log('subscription completed');
      };
  }
}
