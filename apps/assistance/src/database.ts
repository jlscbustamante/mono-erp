import { Attendance, RhEmployee, Sucursal } from "pizzadb";
import { DataSource } from "typeorm";
import { config } from "./config";

const AppDataSource = new DataSource({
  type: "mysql",
  host: config.mysql.host,
  port: config.mysql.port,
  username: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  entities: [RhEmployee, Attendance, Sucursal],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.log("Error during Data Source initialization:", err);
  });

export { AppDataSource };
