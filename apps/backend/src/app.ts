import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import path from 'path'

import config from './config/config'
import {
  boomErrorHandler,
  errorHandler,
  invalidRoute,
  logErrors,
} from './middleware/errorHandler'
import { loadAuthEndpoints } from './router/auth.router'
import { loadAwsServiceEndpoints } from './router/awsService'
import { loadBankEndpoints } from './router/bank.router'
import { loadCashAccountEndpoints } from './router/cashAccount.router'
// import { loadCashMoveEndpoints } from './router/cashMove.router'
import { loadCategoryEndpoints } from './router/category.router'
import { loadCategoryTypeEndpoints } from './router/categoryType.router'
import { loadCostCenterEndopoints } from './router/costCenter.router'
import { loadDigitizationEndpoints } from './router/digitization'
import { loadDigitizationPaymentsEndpoints } from './router/digitization/fileUpload.router'
import { loadExternalEndpoints } from './router/external/external.router'
import { authEndpoints } from './router/hex/auth'
import { loadPointstHexEfis } from './router/hex/efis'
import { loadHexInventoryEndpoints } from './router/hex/inventory'
import { movementEndpoints } from './router/hex/movements'
import { paramterEndpoints } from './router/hex/parameters'
import { purchaseEndpoints } from './router/hex/purchase'
import { loadiamFunctionEndpoints } from './router/iamFunction.router'
import { loadIamLogEndpoints } from './router/iamLog.router'
import { loadIamModuleEndpoints } from './router/iamModule.router'
import { loadIamPermissionEndpoints } from './router/iamPermission.router'
import { loadiamRoleEndpoints } from './router/iamRole.router'
import { loadIamUserEndpoints } from './router/iamUser.router'
import { loadInventoryMaintenanceEndpoints } from './router/inventory/maintenance.router'
import { loadProductEndpoints } from './router/inventory/product.controller'
import { loadMenuReportEndpoints } from './router/menuReport.router'
import { loadParametersEndpoints } from './router/parameters.route'
import { loadReportsEndpoints } from './router/reports.router'
// import { loadRequestEndpoints } from './router/request.router'
import { loadRequestEndpoints } from './router/request'
import { loadStoreEndpoints } from './router/store'
// import { loadStoreEndpoints } from './router/store.router'
import './modules/auth'
import { commonEndopoints } from './modules/common'
import { driverEndpoints } from './modules/driver'
import './modules/ext'
import './modules/inventory'
import { loadSucursalEndpoints } from './router/sucursal.router'
import { loadSupplierEndpoints } from './router/supplier.router'
import { loadTerminalPostEndpoints } from './router/terminalPost.router'
import { globalRouter } from './utils/decorators/router-app'

// Create Express server
const app = express()
// const apiv2Router = express.Router()

// Express configuration
app.set('url_depend', config.url_depend)
app.set('port', config.port)
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true }))

app.use(
  express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 }),
)
app.get('/', (req, res) => {
  res.json({ message: 'Apis admin pr' })
})

// ---

driverEndpoints(globalRouter)
commonEndopoints(globalRouter)

// ---
authEndpoints(app)
movementEndpoints(app)
loadPointstHexEfis(app)
purchaseEndpoints(app)
paramterEndpoints(app)
loadHexInventoryEndpoints(app)
loadExternalEndpoints(app)
loadRequestEndpoints(app)
loadCostCenterEndopoints(app)
loadDigitizationEndpoints(app)
loadCashAccountEndpoints(app)
loadAuthEndpoints(app)
loadReportsEndpoints(app)
loadDigitizationPaymentsEndpoints(app)
loadBankEndpoints(app)
loadIamPermissionEndpoints(app)
loadCategoryEndpoints(app)
loadCategoryTypeEndpoints(app)
loadTerminalPostEndpoints(app)
loadSucursalEndpoints(app)
loadMenuReportEndpoints(app)
loadParametersEndpoints(app)
loadSupplierEndpoints(app)
loadIamLogEndpoints(app)
loadIamUserEndpoints(app)
loadiamRoleEndpoints(app)
loadiamFunctionEndpoints(app)
loadIamModuleEndpoints(app)
loadProductEndpoints(app)
loadStoreEndpoints(app)
loadInventoryMaintenanceEndpoints(app)
loadAwsServiceEndpoints(app)
// app.use('/api/v2', apiv2Router)
app.use('/api/v2', globalRouter)
app.use(invalidRoute)
app.use(logErrors)
app.use(boomErrorHandler)
app.use(errorHandler)

export default app
