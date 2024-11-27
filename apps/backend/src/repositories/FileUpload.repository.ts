import { Repository } from 'typeorm'

import { AppDataSource } from '../config/database'
import { FileUpload } from '../entities/FileUpload'
import { EnvFilters } from '../types'
import { filtersAdapterNt } from '../utils/filtersAdapter'

export interface FileUploadRepository extends Repository<FileUpload> {
  filters(filters: EnvFilters<FileUpload>): Promise<FileUpload[]>
}

const FileUploadRepository = AppDataSource.getRepository(FileUpload).extend({
  async filters(filters: EnvFilters<FileUpload>) {
    const whereClause = filtersAdapterNt(filters).join(' AND ')

    return this.createQueryBuilder('file_upload').where(whereClause).getMany()
  },
})

export default FileUploadRepository
