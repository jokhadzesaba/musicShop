import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { KeyValueUser, User } from '../interfaces';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  public user?: KeyValueUser;
  public form = this.fb.group({
    category: ['', [Validators.required]],
    model: ['', Validators.required],
    price: ['', Validators.required],
    quantity: ['', Validators.required],
    discount: ['', Validators.required],
    photoUrl: ['', Validators.required],
  });
  constructor(
    private authService: LoginAndRegistrationService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.authService.loggedUser.subscribe((user) => {
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
        this.form.patchValue({
          photoUrl: e.target?.result as string,
        });
        this.cd.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
}
