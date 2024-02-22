import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { LoginComponent } from '../login.component';
import {ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'products', component: LoginComponent },
  
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[LoginComponent]
})
export class LoginModule { }
