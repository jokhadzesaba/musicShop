import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TopProductsComponent } from './top-products/top-products.component';
import { LoginModule } from './login/login/login.module';

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
    LoginModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
