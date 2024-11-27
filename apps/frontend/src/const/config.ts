export interface AppConfig {
  apiUrl: string
  apiv2Url: string
}

export const appConfig: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  apiv2Url: import.meta.env.VITE_APIV2_URL as string,
}
