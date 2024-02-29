import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileModuleRoutingModule } from './profile-module-routing.module';
import { ProfileComponent } from '../profile.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileModuleRoutingModule,
    ReactiveFormsModule
  ],
  exports:[ProfileComponent]
})
export class ProfileModuleModule { }
