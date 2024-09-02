import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import(
        './loginAndRegistration/login-and-registration/login-and-registration.module'
      ).then((m) => m.LoginAndRegistrationModule),
  },
  {
    path: 'about-us',
    loadComponent: () =>
      import('./about-us/about-us.component').then((m) => m.AboutUsComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contanct/contanct.component').then((m) => m.ContanctComponent),
  },

  {
    path: 'products',
    loadChildren: () =>
      import('./product-page/product-page/product-page.module').then(
        (m) => m.ProductPageModule
      ),
  },
  {
    path: 'profile/:id',
    loadChildren: () =>
      import('./profile/profile-module/profile-module.module').then(
        (m) => m.ProfileModuleModule
      ),
  },
  {
    path: 'single-product/:id',
    loadChildren: () =>
      import(
        './single-product-page/single-product-page/single-product-page.module'
      ).then((m) => m.SingleProductPageModule),
  },
  {
    path: 'categoty/:category',
    loadChildren: () =>
      import(
        './single-category-page/sinle-category-page-module/sinle-category-page-module.module'
      ).then((m) => m.SinleCategoryPageModuleModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
