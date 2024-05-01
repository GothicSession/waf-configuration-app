import { Routes } from '@angular/router';
import {MainLayoutComponent} from "./layouts/main-layout/main-layout.component";
import {LoginLayoutComponent} from "./layouts/login-layout/login-layout.component";
import {CanActivateIsAuthorizedFunction} from "./guards/can-activate-is-authorized-function";
import {canActivateLoginPageFunction} from "./guards/can-activate-login-page.function";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: MainLayoutComponent,
    canActivate: [CanActivateIsAuthorizedFunction],
  },
  {
    path: 'login',
    component: LoginLayoutComponent,
    canActivate: [canActivateLoginPageFunction]
  }
];
