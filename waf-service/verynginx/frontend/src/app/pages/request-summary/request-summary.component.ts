import { Component } from '@angular/core';
import {DataService} from "./data.service";
import {Observable, Subscription, tap} from "rxjs";
import {AsyncPipe, DecimalPipe, KeyValuePipe, NgForOf, NgIf, NgSwitchCase, NgTemplateOutlet} from "@angular/common";
import {TuiCheckboxModule, TuiTabsModule} from "@taiga-ui/kit";
import {TuiButtonModule} from "@taiga-ui/core";
import {ConfigsService} from "../../services/configs.service";
import {SummaryResponse} from "../../models/config-response.interface";

@Component({
  selector: 'app-request-summary',
  standalone: true,
  imports: [
    NgSwitchCase,
    NgTemplateOutlet,
    TuiTabsModule,
    AsyncPipe,
    NgForOf,
    NgIf,
    TuiButtonModule,
    TuiCheckboxModule,
    KeyValuePipe,
    DecimalPipe
  ],
  templateUrl: './request-summary.component.html',
  styleUrl: './request-summary.component.scss'
})
export class RequestSummaryComponent {

  summary$: Observable<SummaryResponse | null>
  protected readonly Math = Math;

  constructor(
    private readonly _configsService: ConfigsService
  ) {
    this.summary$ = this._configsService.getSummary$();
  }

  getPercent(success?: number, fail?: number): number {
    if (!success) {
      return 0;
    }
    if (!fail) {
      return 100;
    }
    return (success / (success + fail)) * 100 || 0;
  }
}
