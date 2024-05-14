import {DestroyRef, inject} from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import {catchError, map} from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {of} from "rxjs";

export const CanActivateIsAuthorizedFunction: CanActivateFn = () => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  const destroyRef = inject(DestroyRef)

  return loginService.getStatus().pipe(
    map(userInfo => {
      if (userInfo) {
        loginService.user = userInfo;
        return true;
      } else {
        void router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      // void router.navigate(['/login']);
      // return of(false);
      return of(true);
    }),
    takeUntilDestroyed(destroyRef)
  );
};
