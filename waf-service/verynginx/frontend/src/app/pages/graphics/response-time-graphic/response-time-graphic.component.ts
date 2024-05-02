import {AfterViewInit, Component, DestroyRef, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Chart, ChartConfiguration, ChartData, ChartType} from "chart.js";
import {GraphicsService} from "../../../services/graphics.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {pairwise, takeUntil} from "rxjs";

@Component({
  selector: 'app-response-time-graphic',
  standalone: true,
  imports: [],
  templateUrl: './response-time-graphic.component.html',
  styleUrl: './response-time-graphic.component.scss'
})
export class ResponseTimeGraphicComponent implements OnInit, AfterViewInit {

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
      let avg_response_time = 0;
      let requests_all_change = currentDataResponse.request_all_count - prevDataResponse.request_all_count;
      let response_time_change = currentDataResponse.response_time_total - prevDataResponse.response_time_total;

      if( requests_all_change != 0 ){
        avg_response_time = 1000 * response_time_change / requests_all_change ;
      }
      const currentDate = new Date();
      this._graphicsService.addLabel(this.chart, `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`);
      this._graphicsService.addData(this.chart, avg_response_time, 0);
    });
  }

  createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    if (ctx) {

      const data: ChartData = {
        labels: [],
        datasets: [
          {
            label: 'Среднее время ответа',
            data: [],
            fill: 'start',
            borderColor: 'rgb(73,93,100)',
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
            title: {display: true, text: 'Время ответа'}
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
