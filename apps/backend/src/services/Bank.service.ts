import { badRequest } from '@hapi/boom'
import { IsNull } from 'typeorm'

import { BankReconciliation } from '../entities/BnkReconcilation'
import { BankReconciliationRepository } from '../repositories/bnkReconciliation.repository'
import { EnvFilters } from '../types'
import { OpFilter } from '../types/filter'

export class BankService {
  private readonly reconciliationRepository = BankReconciliationRepository

  async filter(
    conditions: EnvFilters<BankReconciliation>,
  ): Promise<BankReconciliation[]> {
    return this.reconciliationRepository.filter(conditions)
  }

  async getFirstReconciliation(): Promise<BankReconciliation[]> {
    const firstReconciliation = await this.reconciliationRepository.find({
      where: {
        req_id: IsNull(),
      },
      take: 1,
      order: {
        created_at: 'ASC',
      },
    })
    const date = firstReconciliation[0].bnk_date

    return this.reconciliationRepository.filter({
      bnk_date: [OpFilter.EqualDate, date],
    })
  }

  async reconcileTransaction(
    transactionkey: string,
    data: {
      requirement_id: number
      requirement_description: string
      requirement_amount: number
    },
    user: string,
  ): Promise<void> {
    const bankTransaction = await this.reconciliationRepository.findOneBy({
      transactionkey,
    })
    if (!bankTransaction) throw badRequest('No se encontró la transacción')
    bankTransaction.req_id = data.requirement_id
    bankTransaction.req_amount = data.requirement_amount
    bankTransaction.req_description = data.requirement_description
    bankTransaction.updated_by = user
    await this.reconciliationRepository.save(bankTransaction)
  }
}
