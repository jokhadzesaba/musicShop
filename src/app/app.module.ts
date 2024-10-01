import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginAndRegistrationModule } from './loginAndRegistration/login-and-registration/login-and-registration.module';
import { ProductPageModule } from './product-page/product-page/product-page.module';
import { ProfileModuleModule } from './profile/profile-module/profile-module.module';
import { SingleProductPageModule } from './single-product-page/single-product-page/single-product-page.module';
import { CartComponent } from './cart/cart.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { SharedServiceService } from './sharedService/shared-service.service';
import { ShareDataService } from './sharedService/share-data.service';



@NgModule({
  declarations: [
    AppComponent,
  
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    LoginAndRegistrationModule,
    ProductPageModule,
    ProfileModuleModule,
    SingleProductPageModule,
    BrowserAnimationsModule,
    CartComponent,
    SuggestionsComponent,
  ],
  bootstrap: [AppComponent],
  providers:[ {
    provide: APP_INITIALIZER,
    useFactory: (productService: ShareDataService) => {
      return () => productService.getAllTypeOfProduct().subscribe() // Ensuring it's called at startup
    },
    deps: [ShareDataService],
    multi: true
  }]
})
export class AppModule {}
