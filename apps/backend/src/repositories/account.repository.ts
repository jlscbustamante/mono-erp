import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { Account } from '../entities/Account'

export const AccountRepository = AppDataSource.getRepository(Account)

export interface AccountRepository extends Repository<Account> {}

const accountRepository = AppDataSource.getRepository(Account).extend(
  {},
) as AccountRepository

export default accountRepository
