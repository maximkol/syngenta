import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerSignupComponent } from './customer-signup/customer-signup.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { ProfileComponent } from '../profile/profile.component';

const routes: Routes = [
  { path: 'customer-signup', component: CustomerSignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignupRoutingModule { }
