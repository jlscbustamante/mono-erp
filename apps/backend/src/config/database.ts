import { DataSource } from 'typeorm'

import {
  Carrier,
  IamFunction,
  IamPermission,
  IamRole,
  IamUser,
  Sucursal,
} from 'pizzadb'
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
  ],
  logging: config.showTypeormLog,
})

AppDataSource.initialize()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Data Source has been initialized!')
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
