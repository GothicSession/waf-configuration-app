import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "../../components/sidebar/sidebar.component";
import {ConfigsService} from "../../services/configs.service";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {

  constructor(
    private readonly _configService: ConfigsService
  ) {
  }

  ngOnInit(): void {
    this._configService.loadConfig();
  }

}
