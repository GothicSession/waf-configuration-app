import {Component, DestroyRef} from '@angular/core';
import {TuiInputModule} from "@taiga-ui/kit";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TuiButtonModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    TuiInputModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiButtonModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  loginForm: FormGroup<{
    loginControl: FormControl<string>,
    passwordControl: FormControl<string>
  }> = new FormGroup<any>({
    loginControl: new FormControl<string>(''),
    passwordControl: new FormControl<string>('')
  });

  constructor(
    private readonly _loginService: LoginService,
    private readonly _router: Router,
    private readonly _destroyRef: DestroyRef
  ) {
  }


  login(): void {
    this._loginService.login(this.loginForm.controls.loginControl.value, this.loginForm.controls.passwordControl.value).pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(response => {
      this._loginService.user = response.cookies?.wafservice_user;
      void this._router.navigate(['/main']);
    });
  }

}
