import {AfterViewInit, Component, DestroyRef, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Chart, ChartConfiguration, ChartData, ChartType} from "chart.js";
import { takeUntil} from "rxjs";
import {GraphicsService} from "../../../services/graphics.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-tcp-graphic',
  standalone: true,
  imports: [],
  templateUrl: './tcp-graphic.component.html',
  styleUrl: './tcp-graphic.component.scss'
})
export class TcpGraphicComponent implements OnInit, AfterViewInit {

  @ViewChild('chartCanvas', {static: true}) chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  constructor(
    private readonly _destroyRef: DestroyRef,
    private readonly _graphicsService: GraphicsService
  ) {
  }

  ngOnInit(): void {
    this.startMonitoring();

    this._graphicsService.startGraphic$.pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(() => {
      this.startMonitoring();
    });
  }

  ngAfterViewInit() {
    this.createChart();
  }

  startMonitoring(): void {
    this._graphicsService.getStatusObservable$().pipe(
      takeUntil(this._graphicsService.stopGraphic$),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe((currentDataResponse) => {
      const currentDate = new Date();
      this._graphicsService.addLabel(this.chart, `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`);
      this._graphicsService.addData(this.chart, Number(currentDataResponse.connections_active), 0);
      this._graphicsService.addData(this.chart, Number(currentDataResponse.connections_reading), 1);
      this._graphicsService.addData(this.chart, Number(currentDataResponse.connections_writing), 2);
    });
  }

  createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    if (ctx) {

      const data: ChartData = {
        labels: [],
        datasets: [
          {
            label: 'Все TCP соединения',
            data: [],
            fill: 'start',
            borderColor: 'rgb(73,93,100)',
            tension: 0.4,
            borderWidth: 2
          },
          {
            label: 'Reading соединения',
            data: [],
            fill: 'start',
            borderColor: 'rgb(97,137,32)',
            tension: 0.4,
            borderWidth: 2
          },
          {
            label: 'Writing соединения',
            data: [],
            fill: 'start',
            borderColor: 'rgb(18, 53, 67)',
            tension: 0.4,
            borderWidth: 2
          }
        ]
      };

      const config: ChartConfiguration = {
        type: 'line' as ChartType,
        data: data,
        options: {
          scales: {
            x: {beginAtZero: true},
            y: {beginAtZero: true}
          },
          plugins: {
            legend: {display: true},
            title: {display: true, text: 'TCP Соединения'}
          },
          animation: {
            duration: 1000,
            easing: 'easeInOutQuad'
          },
          responsive: true,
          maintainAspectRatio: false,
        }
      };

      this.chart = new Chart(ctx, config);
    }
  }

}
