import { Component } from '@angular/core';
import {LoginFormComponent} from "../../components/login-form/login-form.component";

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [
    LoginFormComponent
  ],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.scss'
})
export class LoginLayoutComponent {

}
