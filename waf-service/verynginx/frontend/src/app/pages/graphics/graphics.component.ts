import {AfterViewInit, Component, DestroyRef, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TuiAxesModule, TuiLineChartModule} from "@taiga-ui/addon-charts";
import {Chart, ChartConfiguration, ChartData, ChartType} from "chart.js";
import {LoginService} from "../../services/login.service";
import {interval, of, pairwise, Subject, switchMap, takeUntil, tap, timeout, timer} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {StatusHelper} from "../../helper/status.helper";
import {catchError} from "rxjs/operators";
import {formatDate} from "@angular/common";
import {TuiButtonModule} from "@taiga-ui/core";
import {RequestsGraphicComponent} from "./requests-graphic/requests-graphic.component";
import {TcpGraphicComponent} from "./tcp-graphic/tcp-graphic.component";
import {ResponseTimeGraphicComponent} from "./response-time-graphic/response-time-graphic.component";
import {NetworkTrafficGraphicComponent} from "./network-traffic-graphic/network-traffic-graphic.component";

@Component({
  selector: 'app-graphics',
  standalone: true,
  imports: [
    TuiButtonModule,
    RequestsGraphicComponent,
    TcpGraphicComponent,
    ResponseTimeGraphicComponent,
    NetworkTrafficGraphicComponent,
  ],
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.component.scss'
})
export class GraphicsComponent {

}
