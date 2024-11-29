import { IamUser } from 'pizzadb'
import { AppDataSource } from '../config/database'

export const iamUserRepository = AppDataSource.getRepository(IamUser)
