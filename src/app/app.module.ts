import { ChangeDetectorRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { firebaseConfig } from './interfaces';
import { AngularFireModule } from '@angular/fire/compat';
import { LoginAndRegistrationModule } from './loginAndRegistration/login-and-registration/login-and-registration.module';
import { ProductPageModule } from './product-page/product-page/product-page.module';
import { ProfileModuleModule } from './profile/profile-module/profile-module.module';
import { SingleProductPageModule } from './single-product-page/single-product-page/single-product-page.module';
import { CartComponent } from './cart/cart.component';



@NgModule({
  declarations: [
    AppComponent,
    
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginAndRegistrationModule,
    ProductPageModule,
    ProfileModuleModule,
    SingleProductPageModule,
    CartComponent,
    AngularFireModule.initializeApp(firebaseConfig),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
