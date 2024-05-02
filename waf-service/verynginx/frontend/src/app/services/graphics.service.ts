import { Injectable} from '@angular/core';
import {Chart} from "chart.js";
import {defer, interval, Observable, shareReplay, Subject, switchMap, takeUntil} from "rxjs";
import {StatusResponseInterface} from "../models/status-response.interface";
import {LoginService} from "./login.service";

@Injectable({
  providedIn: 'root'
})
export class GraphicsService {
  private readonly statusObservable$: Observable<StatusResponseInterface>;

  intervalValue = 2000;

  stopGraphic$: Subject<void> = new Subject<void>();
  startGraphic$: Subject<void> = new Subject();

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
