import { IamLog } from '../entities/IamLog'
import { IamLogRepository } from '../repositories/iamLog.repository'
import { EnvFilters } from '../types'
import { dateNow } from '../utils/getDate'

type EditIamLog = {
  user_id: number
  module_id: number
  action: string
  script: string
}
export class IamLogService {
  constructor(private readonly iamLogRepository: IamLogRepository) {}

  async getFilteredIamLogNt(filters: EnvFilters<IamLog>): Promise<IamLog[]> {
    return this.iamLogRepository.filterNt(filters)
  }

  async updateIamLog(existingIamLog: IamLog, args: EditIamLog): Promise<void> {
    try {
      existingIamLog.user_id = args.user_id
      existingIamLog.action = args.action
      existingIamLog.module_id = args.module_id
      existingIamLog.script = args.script
      await this.iamLogRepository.save(existingIamLog)
    } catch (error: any) {
      throw new Error(`Error al actualizar: ${error}`)
    }
  }

  async createIamLog(args: EditIamLog): Promise<void> {
    try {
      const newIamLog = new IamLog()
      newIamLog.created_at = dateNow()
      newIamLog.user_id = args.user_id
      newIamLog.action = args.action
      newIamLog.module_id = args.module_id
      newIamLog.script = args.script
      await this.iamLogRepository.save(newIamLog)
    } catch (err: any) {
      throw new Error(`Error al crear IamLog: ${err}`)
    }
  }
}
