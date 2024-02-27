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
    this.clearInputs()
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
    let email = this.form.get('email')?.value;
    let password = this.form.get('password')?.value;
    this.logInService.registration(email!, password!);
    this.clearInputs()
    this.selected = true;
  }
  public clearInputs(){
    this.form.get('email')?.setValue('');
    this.form.get('password')?.setValue('');
    this.form.get('email')?.markAsUntouched();
    this.form.get('password')?.markAsUntouched();
  }
}
