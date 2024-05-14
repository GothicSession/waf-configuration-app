export class StatusHelper {

  static adaptRequestChartData(currentRequestsAllCount: number, currentRequestsSuccessCount: number, currentTime: number, latestRequestsAllCount: number, latestSuccessCount: number, latestTime: number): {
    avgRequestAll: number,
    avgRequestSuccess: number,
    timeChange: number
  } {
    let requestsAllChange = currentRequestsAllCount - latestRequestsAllCount;
    let requestsSuccessChange = currentRequestsSuccessCount - latestSuccessCount;
    let timeChange = currentTime - latestTime;
    let avgRequestAll = requestsAllChange / timeChange;
    let avgRequestSuccess = requestsSuccessChange / timeChange;

    return {
      avgRequestAll,
      avgRequestSuccess,
      timeChange
    };
  }

}
