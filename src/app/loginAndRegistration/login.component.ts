import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginAndRegistrationService } from './services/login.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SngPageService } from '../single-product-page/service/sng-page.service';
const passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  return password && confirmPassword && password !== confirmPassword ? { passwordsMismatch: true } : null;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('toggleState', [
      state('login', style({
        transform: 'translateX(0)'
      })),
      state('signup', style({
        transform: 'translateY(-10%)'
      })),
      transition('login <=> signup', [
        animate('0.4s ease-in-out')
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  public selected: boolean = true;
  public showPassword = 'password';
  public showConfirmPassword = 'password'; // Separate state for confirm password
  
  public form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordMatchValidator });

  constructor(
    private fb: FormBuilder,
    private logInService: LoginAndRegistrationService,
  ) {}

  ngOnInit(): void {}

  public select() {
    this.selected = !this.selected;
    this.clearInputs();
  }

  public togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = this.showPassword === 'password' ? '' : 'password';
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = this.showConfirmPassword === 'password' ? '' : 'password';
    }
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
    if (this.form.hasError('passwordsMismatch')) {
      console.log('Password mismatch detected');  // Debugging
      alert('Password and confirm password do not match');
      return;
    }
    let email = this.form.get('email')?.value;
    let password = this.form.get('password')?.value;
    this.logInService.registration(email!, password!);
    this.clearInputs();
    this.selected = true;
  }

  public clearInputs() {
    this.form.get('email')?.setValue('');
    this.form.get('password')?.setValue('');
    this.form.get('confirmPassword')?.setValue('');
    this.form.get('email')?.markAsUntouched();
    this.form.get('password')?.markAsUntouched();
    this.form.get('confirmPassword')?.markAsUntouched();
  }
}
