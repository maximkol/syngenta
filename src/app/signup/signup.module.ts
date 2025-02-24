import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import { CustomerSignupComponent } from './customer-signup/customer-signup.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CustomerSignupComponent,
    
  ],
  imports: [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule
  ]
})
export class SignupModule { }
