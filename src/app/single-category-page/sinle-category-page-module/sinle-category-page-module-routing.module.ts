import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleCategoryPageComponent } from '../single-category-page.component';

const routes: Routes = [
  {
    path: '',
    component: SingleCategoryPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SinleCategoryPageModuleRoutingModule {}
