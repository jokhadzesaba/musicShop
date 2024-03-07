import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SingleProductPageRoutingModule } from './single-product-page-routing.module';
import { SingleProductPageComponent } from '../single-product-page.component';


@NgModule({
  declarations: [SingleProductPageComponent],
  imports: [
    CommonModule,
    SingleProductPageRoutingModule
  ],
  exports:[SingleProductPageComponent]
})
export class SingleProductPageModule { }
