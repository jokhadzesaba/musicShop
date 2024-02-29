import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { KeyValueUser } from '../interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  public dropDown: boolean = false;
  public user?: KeyValueUser;
  constructor(
    private router: Router,
    private loginService: LoginAndRegistrationService
  ) {}
  ngOnInit(): void {
    this.loginService.loggedUser.subscribe((user) => {
      this.user = user;
    });
  }
  public changeDropDown() {
    console.log(this.dropDown);
    this.dropDown = !this.dropDown;
  }
  public navigate() {
    this.router.navigate([`profile/${this.user?.key}`]);
  }
}
