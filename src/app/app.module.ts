import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TopProductsComponent } from './top-products/top-products.component';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { firebaseConfig } from './interfaces';
import { AngularFireModule } from '@angular/fire/compat';
import { LoginAndRegistrationModule } from './loginAndRegistration/login-and-registration/login-and-registration.module';


@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    ProductPageComponent,
    HeaderComponent,
    FooterComponent,
    TopProductsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginAndRegistrationModule,
    AngularFireModule.initializeApp(firebaseConfig),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
