import { Component } from '@angular/core';
import {DataService} from "./data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-request-summary',
  standalone: true,
  imports: [],
  templateUrl: './request-summary.component.html',
  styleUrl: './request-summary.component.scss'
})
export class RequestSummaryComponent {
  defaultButtonText = 'All';
  dataSubscription: Subscription;

  constructor(public dataService: DataService) {
    this.dataSubscription = this.dataService.dataSubject.subscribe(data => {
      this.updateTables(data);
    });
  }

  updateTables(data: any) {
    // Update your tables here
  }

  onSearch(value: string) {
    this.dataService.search(value);
  }

  onTabSwitch(newType: string) {
    this.defaultButtonText = newType;
    this.dataService.tabSwitch(newType);
  }

  onClearData() {
    const group = this.dataService.currentGroup(this.defaultButtonText);
    this.dataService.clearData(group);
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
