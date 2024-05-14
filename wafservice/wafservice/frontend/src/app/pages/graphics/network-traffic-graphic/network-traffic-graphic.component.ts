import {AfterViewInit, Component, DestroyRef, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Chart, ChartConfiguration, ChartData, ChartType} from "chart.js";
import {GraphicsService} from "../../../services/graphics.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {pairwise, takeUntil} from "rxjs";

@Component({
  selector: 'app-network-traffic-graphic',
  standalone: true,
  imports: [],
  templateUrl: './network-traffic-graphic.component.html',
  styleUrl: './network-traffic-graphic.component.scss'
})
export class NetworkTrafficGraphicComponent implements OnInit, AfterViewInit {


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
      pairwise(),
      takeUntil(this._graphicsService.stopGraphic$),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(([prevDataResponse, currentDataResponse]) => {
      const currentDate = new Date();
      this._graphicsService.addLabel(this.chart, `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`);

      let traffic_read_change = currentDataResponse.traffic_read - prevDataResponse.traffic_read;
      let traffic_write_change = currentDataResponse.traffic_write - prevDataResponse.traffic_write;
      let time_change = currentDataResponse.time / prevDataResponse.time;
      let avg_traffic_read = traffic_read_change / (time_change * 1024);
      let avg_traffic_write = traffic_write_change / (time_change * 1024);

      this._graphicsService.addData(this.chart, avg_traffic_write, 1);
      this._graphicsService.addData(this.chart, avg_traffic_read, 0);
    });
  }

  createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    if (ctx) {

      const data: ChartData = {
        labels: [],
        datasets: [
          {
            label: 'Out',
            data: [],
            fill: 'start',
            borderColor: 'rgb(73,93,100)',
            tension: 0.4,
            borderWidth: 2
          },
          {
            label: 'In',
            data: [],
            fill: 'start',
            borderColor: 'rgb(97,137,32)',
            tension: 0.4,
            borderWidth: 2
          },
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
            title: {display: true, text: 'Трафик сети'}
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
