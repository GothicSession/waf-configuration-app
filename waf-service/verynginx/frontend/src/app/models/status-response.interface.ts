export interface StatusResponseInterface {
  boot_time: number,
  connections_active: string,
  connections_reading: string,
  connections_waiting: string,
  connections_writing: string,
  request_all_count: number,
  request_success_count: number,
  response_time_total: number,
  ret: string,
  time: number,
  traffic_read: number,
  traffic_write: number
}
