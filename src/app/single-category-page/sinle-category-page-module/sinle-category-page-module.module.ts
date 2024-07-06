import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SinleCategoryPageModuleRoutingModule } from './sinle-category-page-module-routing.module';
import { FormsModule } from '@angular/forms';
import { SingleCategoryPageComponent } from '../single-category-page.component';
import { HeaderComponent } from 'src/app/header/header.component';
import { FooterComponent } from 'src/app/footer/footer.component';
import { ReusableFormComponent } from 'src/app/reusable-form/reusable-form.component';
import { CardComponent } from 'src/app/card/card.component';


@NgModule({
  declarations: [SingleCategoryPageComponent],
  imports: [
    CommonModule,
    SinleCategoryPageModuleRoutingModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    ReusableFormComponent,
    CardComponent,

  ]
})
export class SinleCategoryPageModuleModule { }
