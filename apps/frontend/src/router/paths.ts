import { bankPahts } from './bank'
import { digitizationPahts } from './digitization'
import { maintenancePaths } from './maintenance'
import { productsPaths } from './products'
import { reportPaths } from './report'
import { requestsPahts } from './request'
import { securityPaths } from './security'
import { storesPahts } from './store'

export const PATHS = {
  root: '/',
  login: '/auth/login',
  firstLogin: '/auth/firstLogin',
  profile: '/auth/profile',
  resetPassword: '/auth/reset-password',
  modules: '/modules',
  updatePassword: '/auth/updatePassword/',
  requests: requestsPahts,
  stores: storesPahts,
  bank: bankPahts,
  digitization: digitizationPahts,
  report: reportPaths,
  maintenance: maintenancePaths,
  security: securityPaths,
  products: productsPaths,
}
