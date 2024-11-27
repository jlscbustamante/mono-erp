import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { EntitiesTimeStampsCom } from '../config/EntitiesTimestampsCom'

@Entity({ name: 'sys_upload_log' })
export class FileUpload extends EntitiesTimeStampsCom {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number | null

  @Column({ type: 'varchar' })
  folder: string

  @Column({ type: 'varchar' })
  file_name: string

  @Column({ type: 'varchar' })
  upload_by: string

  @Column({ type: 'varchar' })
  file_type: string
}
