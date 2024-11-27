import { Repository } from 'typeorm'

import { CashBalance } from '../entities/CashBalance'

export class BalanceService {
  balanceRepository: Repository<CashBalance>
  constructor(balanceRepository: Repository<CashBalance>) {
    this.balanceRepository = balanceRepository
  }

  async getAll(): Promise<CashBalance[]> {
    // return this.balanceRepository.find()
    return this.balanceRepository.find()
  }
}
