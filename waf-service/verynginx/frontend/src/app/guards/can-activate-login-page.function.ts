import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {catchError, map} from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import {of} from "rxjs";

export const canActivateLoginPageFunction: CanActivateFn = () => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  return loginService.getStatus().pipe(
    map(userInfo => {
      if (userInfo) {
        router.navigate(['/main']);
        return false;
      } else {
        return true;
      }
    }),
    catchError(() => {
      return of(true);
    })
  );
};
