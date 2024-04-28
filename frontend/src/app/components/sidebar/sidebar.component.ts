import { Component } from '@angular/core';
import {TuiAvatarModule, TuiMarkerIconModule} from "@taiga-ui/kit";
import {TuiSvgModule} from "@taiga-ui/core";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    TuiAvatarModule,
    TuiSvgModule,
    TuiMarkerIconModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
