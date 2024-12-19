import { DataSource } from 'typeorm'

import {
  Attendance,
  Brand,
  Carrier,
  IamFunction,
  IamPermission,
  IamRole,
  IamUser,
  InvDispatch,
  InvDispatchItem,
  InvStock,
  InvSupplier,
  Item,
  JobTitle,
  Measure,
  Presentation,
  Product,
  ProductCategory,
  RhEmployee,
  Sucursal,
  SucursalAsWarehouse,
} from 'pizzadb'
import { Parameters } from '../parameters'
import config from './config'

const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.mysqlHost,
  port: config.mysqlPort,
  username: config.mysqlUser,
  password: config.mysqlPassword,
  database: config.mysqlDatabase,
  entities: [
    'src/entities/**/*{.js,.ts}',
    Carrier,
    Sucursal,
    IamUser,
    IamRole,
    IamPermission,
    IamFunction,
    Brand,
    ProductCategory,
    InvDispatchItem,
    InvDispatch,
    Item,
    Measure,
    Presentation,
    Product,
    InvSupplier,
    SucursalAsWarehouse,
    InvStock,
    RhEmployee,
    Attendance,
    JobTitle,
  ],
  logging: config.showTypeormLog,
})

AppDataSource.initialize()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Data Source has been initialized!')
    const parameter = Parameters.getInstance()
    return parameter.loadParameters()
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Parameters loaded')
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log('Error during Data Source initialization:', err)
  })

// const AppDataSource_Courrier = new DataSource({
//   type: 'mysql',
//   host: config.mysqlHost_driver,
//   port: config.mysqlPort_driver,
//   username: config.mysqlUser_driver,
//   password: config.mysqlPassword_driver,
//   database: config.mysqlDatabase_driver,
//   entities: [Courrier, CourrierStore, StoreCourrier],
//   logging: config.showTypeormLog,
// })

// AppDataSource_Courrier.initialize()
//   .then(() => {
//     // eslint-disable-next-line no-console
//     console.log('Data Source Driver has been initialized!')
//   })
//   .catch((err) => {
//     // eslint-disable-next-line no-console
//     console.log('Error during Data Source Driver initialization:', err)
//   })

// export { AppDataSource, AppDataSource_Courrier }
export { AppDataSource }
