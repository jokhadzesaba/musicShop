import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { LoginComponent } from '../login.component';
import { GoogleAuthProvider,} from '@angular/fire/auth';
import { LoginRouting } from './loginRouting';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';

import { firebaseConfig } from 'src/app/interfaces';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    LoginRouting,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),

  ],
  providers: [GoogleAuthProvider],
  exports: [LoginComponent],
})
export class LoginAndRegistrationModule {}
