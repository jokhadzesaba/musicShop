import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { KeyValueUser } from '../interfaces';
import { CommonModule } from '@angular/common';
import { CartComponent } from '../cart/cart.component';
import { AboutUsComponent } from '../about-us/about-us.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  public dropDown: boolean = false;
  public user?: KeyValueUser;
  public profilePicture?: string;
  public cart: boolean = false;
  constructor(
    private router: Router,
    private loginService: LoginAndRegistrationService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.loginService.loggedUser.subscribe((user) => {
      this.user = user;
      this.profilePicture = this.user?.user.photoUrl;
      this.cd.detectChanges();
    });
  }
  public changeDropDown() {
    this.dropDown = !this.dropDown;
  }
  public navigateToProfile() {
    this.router.navigate([`profile/${this.user?.key}`]);
  }
  public navigateToCategotyPage(categoty: string) {
    this.router.navigate([`categoty/${categoty}`]);
  }
  public openCloseCart() {
    this.cart = !this.cart;
  }
  public logOut() {
    this.loginService.logOut();
    this.router.navigate(['/products']);
  }
  public navigate(where: string) {
    this.router.navigate([`/${where}`])
  }
}
