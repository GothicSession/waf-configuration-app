export interface LoginResponseInterface {
  cookies?: {
    wafservice_session: string,
    wafservice_user: string
  }
  ret: string
}
