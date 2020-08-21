import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { UserActivate } from './guard/user.guard';
import { LoginRouteActivate } from './guard/login-route.guard';


const routes: Routes = [
  {
    path: '', component: IndexComponent, canActivate: [UserActivate]
  },
  {
    path: 'login', component: LoginComponent, canActivate: [LoginRouteActivate]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
