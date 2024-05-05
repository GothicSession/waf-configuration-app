import { Injectable} from '@angular/core';
import {Chart} from "chart.js";
import {defer, interval, Observable, of, shareReplay, Subject, switchMap, takeUntil} from "rxjs";
import {StatusResponseInterface} from "../models/status-response.interface";
import {LoginService} from "./login.service";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GraphicsService {
  private readonly statusObservable$: Observable<StatusResponseInterface>;

  intervalValue = 2000;

  stopGraphic$: Subject<void> = new Subject<void>();
  startGraphic$: Subject<void> = new Subject();

  mockData: StatusResponseInterface = {
    boot_time: 1714583594,
    connections_active: "1",
    connections_reading: "0",
    connections_waiting: "0",
    connections_writing: "1",
    request_all_count: 3475,
    request_success_count: 991,
    response_time_total: 0,
    ret: "success",
    time: 1714667440.044,
    traffic_read: 2737539,
    traffic_write: 4897339,
  }

  constructor(
    private readonly _loginService: LoginService,
  ) {
    this.statusObservable$ = this.createStatusObservable();
  }

  addData(chart: Chart, newData: number, datasetIndex: number): void {
    chart.data.datasets[datasetIndex].data.push(newData);
    chart.update();
  }

  addLabel(chart: Chart, label: string): void {
    chart.data.labels?.push(label);
    chart.update();
  }

  private createStatusObservable() {
    return defer(() => interval(this.intervalValue)).pipe(
      switchMap(() => this._loginService.getStatus()),
      shareReplay(1),
      takeUntil(this.stopGraphic$)
    );
  }

  getStatusObservable$(): Observable<StatusResponseInterface> {
    return this.statusObservable$;
  }

}
