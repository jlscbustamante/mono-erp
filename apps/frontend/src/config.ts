export default {
  API: import.meta.env.VITE_API_URL as string,
  Modules: import.meta.env.VITE_MODULES.split(',') as string[],
  apiAE: import.meta.env.VITE_API_AE_URL as string,
  allowViewAll: Boolean(Number(import.meta.env.VITE_ALLOW_VIEW_ALL)) as boolean,

  // hosts
  hostMoto: import.meta.env.VITE_HOST_MOTO as string,
  hostPos: import.meta.env.VITE_HOST_POS as string,
}
