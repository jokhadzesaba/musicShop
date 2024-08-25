import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SingleProductPageRoutingModule } from './single-product-page-routing.module';
import { SingleProductPageComponent } from '../single-product-page.component';
import { HeaderComponent } from 'src/app/header/header.component';
import { FooterComponent } from 'src/app/footer/footer.component';
import { SuggestionsComponent } from "../../suggestions/suggestions.component";
import { IsLikedComponent } from 'src/app/is-liked/is-liked.component';



@NgModule({
  declarations: [SingleProductPageComponent],
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    SingleProductPageRoutingModule,
    SuggestionsComponent,
    IsLikedComponent
],
  exports:[SingleProductPageComponent]
})
export class SingleProductPageModule { }
