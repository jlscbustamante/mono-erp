import { Attendance, RhEmployee } from "pizzadb";
import { AppDataSource } from "./database";

export const employeeRepository = AppDataSource.getRepository(RhEmployee);
export const attendanceRepository = AppDataSource.getRepository(Attendance);
