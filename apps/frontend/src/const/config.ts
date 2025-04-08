export interface AppConfig {
  apiUrl: string
  apiv2Url: string
  apiCentral: string
  ui: {
    fullAccess: boolean
  }
  clients: {
    view: string
  }
}

export const appConfig: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  apiv2Url: import.meta.env.VITE_APIV2_URL as string,
  apiCentral: import.meta.env.VITE_CENTRAL_URL as string,
  clients: {
    view: import.meta.env.VITE_CLIENT_VIEW_URL as string,
  },
  ui: {
    fullAccess: import.meta.env.VITE_ENABLE_FULL_ACCESS == 'true',
  },
}
