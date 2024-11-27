import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { AccoutingItem } from '../entities/AccoutingItem'

export interface AccountItemRepository extends Repository<AccoutingItem> {}

const accountItemRepository = AppDataSource.getRepository(AccoutingItem).extend(
  {},
) as AccountItemRepository

export default accountItemRepository
