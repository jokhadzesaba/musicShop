import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { LoginComponent } from '../login.component';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { LoginRouting } from './loginRouting';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    LoginRouting,
    HttpClientModule
  ],
  providers: [GoogleAuthProvider],
  exports: [LoginComponent],
})
export class LoginAndRegistrationModule {}
