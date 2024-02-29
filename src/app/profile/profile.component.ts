import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { Observable } from 'rxjs';
import { KeyValueUser, User } from '../interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  public user?:KeyValueUser;
  constructor(private authService: LoginAndRegistrationService) {}
  ngOnInit(): void {

  }
}
