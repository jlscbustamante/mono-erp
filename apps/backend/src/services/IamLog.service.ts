import { IamLog } from '../entities/IamLog'
import { IamLogRepository } from '../repositories/iamLog.repository'
import { EnvFilters } from '../types'
import { dateNow } from '../utils/getDate'

//version anterior del tipo IamLog

// type EditIamLog = {
//   user_id: number
//   module_id: number
//   action: string
//   script: string
// }

interface CreateIamLog extends Omit<IamLog, 'id' | 'created_at'> {}

export class IamLogService {
  constructor(private readonly iamLogRepository: IamLogRepository) {}

  async getFilteredIamLogNt(filters: EnvFilters<IamLog>): Promise<IamLog[]> {
    return this.iamLogRepository.filterNt(filters)
  }

  async updateIamLog(existingIamLog: IamLog, args: IamLog): Promise<void> {
    try {
      existingIamLog.id = args.id
      existingIamLog.user_id = args.user_id
      existingIamLog.user_name = args.user_name
      existingIamLog.user_email = args.user_email
      existingIamLog.module_id = args.module_id
      existingIamLog.module_name = args.module_name
      existingIamLog.action = args.action
      existingIamLog.tbl_name = args.tbl_name
      existingIamLog.tbl_primary_id = args.tbl_primary_id

      await this.iamLogRepository.save(existingIamLog)
    } catch (error: any) {
      throw new Error(`Error al actualizar: ${error}`)
    }
  }

  async createIamLog(args: CreateIamLog): Promise<void> {
    try {
      const newIamLog = new IamLog()

      newIamLog.user_id = args.user_id
      newIamLog.user_name = args.user_name
      newIamLog.user_email = args.user_email
      newIamLog.module_id = args.module_id
      newIamLog.module_name = args.module_name
      newIamLog.action = args.action
      newIamLog.tbl_name = args.tbl_name
      newIamLog.tbl_primary_id = args.tbl_primary_id

      await this.iamLogRepository.save(newIamLog)
    } catch (err: any) {
      throw new Error(`Error al crear IamLog: ${err}`)
    }
  }
}
