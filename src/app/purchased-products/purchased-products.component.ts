import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { take } from 'rxjs';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { KeyValueUser, Purchase } from '../interfaces';
import { CommonModule,  } from '@angular/common';
import { UpperCasePipe } from '../pipes/upper-case.pipe';
import { DatePipe } from '../pipes/date.pipe';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-purchased-products',
  standalone: true,
  imports: [CommonModule,UpperCasePipe,DatePipe,HeaderComponent,FooterComponent],
  templateUrl: './purchased-products.component.html',
  styleUrl: './purchased-products.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PurchasedProductsComponent {
  public user?: KeyValueUser;
  public purchasedProducts: Purchase[] = [];
  public showMoreItems: boolean[] = [];
  public changeArrow: boolean[] = [];
  constructor(
    private authService: LoginAndRegistrationService,
    private cd:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.checkIfLoggedIn()
    this.authService.loggedUser.pipe(take(1)).subscribe((user) => {
      if (user && user.user.purchasedProducts) {
        this.user = user;
        this.purchasedProducts = user?.user.purchasedProducts.slice(1);
        console.log('Purchased products:', this.purchasedProducts);
      } else {
        console.log('No user or purchased products found.');
      }
    }, (error) => {
      console.error('Error fetching user data:', error);
      
    });
  }
  
}
