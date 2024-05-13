import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  latestData: any = null;
  urlTable: any = null;
  collectTable: any = null;
  dataSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  search(s: string) {
    if (this.urlTable) {
      this.urlTable.search(s).draw();
    }
    if (this.collectTable) {
      this.collectTable.search(s).draw();
    }
  }

  currentGroup(defaultBtnText: string): string {
    return defaultBtnText === 'All' ? 'persistent' : 'temporary';
  }

  tabSwitch(newType: string) {
    const type = newType === 'All' ? 'persistent' : 'temporary';
    this.getData(type);
  }

  clearData(group: string) {
    this.http.post('/status/clear', { group: group }).subscribe(
      response => {
        console.log(`Clear data group [${group}] success`);
        this.getData(group);
      },
      error => console.error('Error clearing data', error)
    );
  }

  getData(group: string) {
    const url = `/summary?type=${group === 'persistent' ? 'long' : 'short'}`;
    this.http.get(url).subscribe(
      (data: any) => {
        this.latestData = data;
        this.dataSubject.next(data);
        // Table handling logic will need to be re-implemented in Angular context
      },
      error => console.error('Failed to fetch data', error)
    );
  }
}
