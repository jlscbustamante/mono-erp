import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { AccoutingMove } from '../entities/AccoutingMove'

export interface AccountMoveRepository extends Repository<AccoutingMove> {}

const accountMoveRepository = AppDataSource.getRepository(AccoutingMove).extend(
  {},
) as AccountMoveRepository

export default accountMoveRepository
