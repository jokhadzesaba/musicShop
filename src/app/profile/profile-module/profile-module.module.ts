import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileModuleRoutingModule } from './profile-module-routing.module';
import { ProfileComponent } from '../profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/header/header.component';
import { FooterComponent } from 'src/app/footer/footer.component';
import { CardComponent } from 'src/app/card/card.component';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileModuleRoutingModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    CardComponent
    
  ],
  exports:[ProfileComponent]
})
export class ProfileModuleModule { }
