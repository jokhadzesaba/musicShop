import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginAndRegistrationService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  public selected: boolean = true;

  public form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private logInService: LoginAndRegistrationService
  ) {}
  ngOnInit(): void {}
  public select() {
    this.selected = !this.selected;
  }
  public googleLogin() {
    this.logInService.loginWithGoogle();
  }
  public emailAndPasswordLogin() {
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    this.logInService.loginWithEmailAndPassword(email!, password!);
  }
  public registration() {
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    this.logInService.registration(email!, password!);
  }
}
