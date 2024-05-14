import { Routes } from '@angular/router';
import {MainLayoutComponent} from "./layouts/main-layout/main-layout.component";
import {LoginLayoutComponent} from "./layouts/login-layout/login-layout.component";
import {CanActivateIsAuthorizedFunction} from "./guards/can-activate-is-authorized-function";
import {canActivateLoginPageFunction} from "./guards/can-activate-login-page.function";
import {GraphicsComponent} from "./pages/graphics/graphics.component";
import {BasicsComponent} from "./pages/basics/basics.component";
import {ActionsComponent} from "./pages/actions/actions.component";
import {BackendComponent} from "./pages/backend/backend.component";
import {SummaryComponent} from "./pages/summary/summary.component";
import {SystemComponent} from "./pages/system/system.component";
import {RequestSummaryComponent} from "./pages/request-summary/request-summary.component";

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
      },
      {
        path: 'actions',
        component: ActionsComponent
      },
      {
        path: 'backend',
        component: BackendComponent
      },
      {
        path: 'summary',
        component: SummaryComponent
      },
      {
        path: 'system',
        component: SystemComponent
      },
      {
        path: 'requests',
        component: RequestSummaryComponent
      }
    ]
  },
  {
    path: 'login',
    component: LoginLayoutComponent,
    canActivate: [canActivateLoginPageFunction]
  }
];
