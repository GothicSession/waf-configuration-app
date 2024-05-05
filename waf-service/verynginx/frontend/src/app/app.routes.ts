import { Routes } from '@angular/router';
import {MainLayoutComponent} from "./layouts/main-layout/main-layout.component";
import {LoginLayoutComponent} from "./layouts/login-layout/login-layout.component";
import {CanActivateIsAuthorizedFunction} from "./guards/can-activate-is-authorized-function";
import {canActivateLoginPageFunction} from "./guards/can-activate-login-page.function";
import {GraphicsComponent} from "./pages/graphics/graphics.component";
import {BasicsComponent} from "./pages/basics/basics.component";

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
    children: [
      {
        path: 'graphics',
        component: GraphicsComponent
      },
      {
        path: 'basics',
        component: BasicsComponent
      }
    ]
  },
  {
    path: 'login',
    component: LoginLayoutComponent,
    canActivate: [canActivateLoginPageFunction]
  }
];
