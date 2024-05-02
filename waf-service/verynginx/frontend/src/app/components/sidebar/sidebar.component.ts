import {Component} from '@angular/core';
import {TuiAvatarModule, TuiMarkerIconModule} from "@taiga-ui/kit";
import {TuiSvgModule} from "@taiga-ui/core";
import {CookieService} from "ngx-cookie-service";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    TuiAvatarModule,
    TuiSvgModule,
    TuiMarkerIconModule,
    RouterLink,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  constructor(
    private readonly _cookieService: CookieService,
    private readonly _router: Router
  ) {
  }

  logout(): void {
    this._cookieService.delete('verynginx_user', '/wafservice', 'localhost');
    this._cookieService.delete('verynginx_session', '/wafservice', 'localhost');

    this._router.navigate(['/login'])
  }
}
