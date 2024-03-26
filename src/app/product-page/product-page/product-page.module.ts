import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPageComponent } from '../product-page.component';
import { ProductPageRouting } from './product-page-routing';
import { TopProductsComponent } from 'src/app/top-products/top-products.component';
import { HeaderComponent } from 'src/app/header/header.component';
import { FooterComponent } from 'src/app/footer/footer.component';
import { CartComponent } from 'src/app/cart/cart.component';

@NgModule({
  declarations: [ProductPageComponent, TopProductsComponent],
  imports: [CommonModule, ProductPageRouting, FooterComponent, HeaderComponent,CartComponent],
  exports: [ProductPageComponent],
})
export class ProductPageModule {}
