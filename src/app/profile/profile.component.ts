import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { KeyValueUser, Product, ProductKeyAndType, ProductKeyValue } from '../interfaces';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { forkJoin, map, take } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  public user?: KeyValueUser;
  public likedProducts?: ProductKeyValue[];
  public photos: string[] = [];
  public addingProduct: boolean = false;
  public showMoreItems: boolean[] = [];
  public changeArrow: boolean[] = [];
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
    this.authService.loggedUser.pipe(take(1)).subscribe((user) => {
      this.user = user;
      this.form.patchValue({
        category: 'guitar',
      });
    });
  }

  public update() {
    if (this.user?.user.email) {
      this.authService.findUser(this.user?.user.email).subscribe((res) => {
        this.user = res;
        this.cd.detectChanges();
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
  addingProd() {
    this.addingProduct = !this.addingProduct;
  }
  removeImg(url: string) {
    const photoIndex = this.photos.findIndex((x) => x === url);
    this.photos.splice(photoIndex,1);
  }
  addNewProduct() {
    const category = this.form.get('category')?.getRawValue();
    const model = this.form.get('model')?.getRawValue();
    const price = this.form.get('price')?.getRawValue();
    const discount = this.form.get('discount')?.getRawValue();
    const quantity = this.form.get('quantity')?.getRawValue();
    const description = this.form.get('description')?.getRawValue();
    this.sharedService
      .addProduct(
        category,
        model,
        price,
        quantity,
        discount,
        this.photos,
        description
      )
      .subscribe({
        next: () => {
          this.form.get('category')?.setValue('');
          this.form.get('model')?.setValue('');
          this.form.get('price')?.setValue('');
          this.form.get('discount')?.setValue('');
          this.form.get('quantity')?.setValue('');
          this.form.get('description')?.setValue('');
          this.photos = [];
          this.cd.detectChanges()
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
  convertDate(date: Date) {
    let newDate = new Date(date);
    return `${newDate.getDate()}/${
      newDate.getMonth() + 1
    }/${newDate.getFullYear()}`;
  }
  upperCaseFirstLetter(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
