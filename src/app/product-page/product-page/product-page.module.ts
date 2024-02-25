import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPageComponent } from '../product-page.component';
import { ProductPageRouting } from './product-page-routing';
import { TopProductsComponent } from 'src/app/top-products/top-products.component';

@NgModule({
  declarations: [ProductPageComponent, TopProductsComponent],
  imports: [CommonModule, ProductPageRouting],
  exports: [ProductPageComponent],
})
export class ProductPageModule {}
