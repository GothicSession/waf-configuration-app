import {AfterViewInit, Component, DestroyRef, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TuiAxesModule, TuiLineChartModule} from "@taiga-ui/addon-charts";
import {Chart, ChartConfiguration, ChartData, ChartType} from "chart.js";
import {pairwise, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TuiButtonModule, TuiDialogModule, TuiErrorModule} from "@taiga-ui/core";
import {StatusHelper} from "../../../helper/status.helper";
import {GraphicsService} from "../../../services/graphics.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TUI_VALIDATION_ERRORS, TuiFieldErrorPipeModule, TuiInputModule} from "@taiga-ui/kit";
import {AsyncPipe} from "@angular/common";
import {TuiAutoFocusModule} from "@taiga-ui/cdk";

@Component({
  selector: 'app-requests-graphic',
  standalone: true,
  imports: [
    TuiAxesModule,
    TuiLineChartModule,
    TuiButtonModule,
    TuiDialogModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiErrorModule,
    AsyncPipe,
    TuiFieldErrorPipeModule,
    TuiAutoFocusModule,
  ],
  providers: [
    {
    provide: TUI_VALIDATION_ERRORS,
    useValue: {
      pattern: 'Введите целое число от 1000',
      required: 'Введите целое число от 1000',
      min: 'Введите целое число от 1000',
    },
    }
  ],
  templateUrl: './requests-graphic.component.html',
  styleUrl: './requests-graphic.component.scss'
})
export class RequestsGraphicComponent implements AfterViewInit, OnInit {

  @ViewChild('chartCanvas', {static: true}) chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  isGraphicsRunning = false;

  intervalFormGroup = new FormGroup({
    intervalControl: new FormControl(this._graphicsService.intervalValue, {nonNullable: true, validators: [
      Validators.required, Validators.min(1000), Validators.pattern(/^[1-9][0-9]*$/)
      ]}),
  });

  open = false;

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

  startGraphic(): void {
    this._graphicsService.startGraphic$.next();
  }

  startMonitoring(): void {
    this._graphicsService.getStatusObservable$().pipe(
      tap(() => {this.isGraphicsRunning = true}),
      pairwise(),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(([prevDataResponse, currentDataResponse]) => {
      const adaptedData = StatusHelper.adaptRequestChartData(
        currentDataResponse.request_all_count,
        currentDataResponse.request_success_count,
        currentDataResponse.time,
        prevDataResponse.request_all_count,
        prevDataResponse.request_success_count,
        prevDataResponse.time
      );
      const currentDate = new Date();
      this._graphicsService.addLabel(this.chart, `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`);
      this._graphicsService.addData(this.chart, adaptedData.avgRequestAll, 0);
      this._graphicsService.addData(this.chart, adaptedData.avgRequestSuccess, 1);
    });
  }

  stopGraphic(): void {
    this.isGraphicsRunning = false;
    this._graphicsService.stopGraphic$.next();
  }

  createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    if (ctx) {

      const data: ChartData = {
        labels: [],
        datasets: [{
          label: 'Все запросы',
          data: [],
          fill: 'start',
          borderColor: 'rgb(18, 53, 67)',
          tension: 0.4,
          borderWidth: 2
        },
          {
            label: 'Успешные запросы',
            data: [],
            fill: 'start',
            borderColor: 'rgb(97,137,32)',
            tension: 0.4,
            borderWidth: 2
          }]
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
            title: {display: true, text: 'Количество запросов за определенный период'}
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

  changeConfig(): void {
    this.open = true;
  }

  submitPopup(observer: any): void {
    this._graphicsService.intervalValue = this.intervalFormGroup.controls.intervalControl.value;
    this._graphicsService.stopGraphic$.next();
    this._graphicsService.startGraphic$.next();
    observer.complete();
  }

}
