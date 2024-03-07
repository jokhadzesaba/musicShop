import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleProductPageComponent } from '../single-product-page.component';

const routes: Routes = [{path:"",component:SingleProductPageComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleProductPageRoutingModule { }
