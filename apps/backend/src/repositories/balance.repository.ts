import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { CashBalance } from '../entities/CashBalance'

export interface BalanceRepository extends Repository<CashBalance> {}

const balanceRepository: BalanceRepository =
  AppDataSource.getRepository(CashBalance)

export default balanceRepository
