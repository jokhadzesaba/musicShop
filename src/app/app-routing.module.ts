import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
