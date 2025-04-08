export default {
  API: import.meta.env.VITE_API_URL as string,
  Modules: import.meta.env.VITE_MODULES.split(',') as string[],
  apiAE: import.meta.env.VITE_API_AE_URL as string,
  allowViewAll: Boolean(Number(import.meta.env.VITE_ALLOW_VIEW_ALL)) as boolean,
  apiV2: import.meta.env.VITE_CLIENT_VIEW_URL as string,
  apiCentral: import.meta.env.VITE_CENTRAL_URL as string,

  // hosts
  hostMoto: import.meta.env.VITE_HOST_MOTO as string,
  hostPos: import.meta.env.VITE_HOST_POS as string,
}
