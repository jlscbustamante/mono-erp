import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'

import { DateTransformer } from '../config/transformers/dateTransformer'
import { RequestEntity } from '../entities/Request'
import { FileType } from '../types/admFile'

@Entity({ name: 'adm_file' })
export class AdmFile {
  @PrimaryColumn({ type: 'int' })
  id: number | null

  @Column({ type: 'enum', enum: FileType })
  doc_type: FileType

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  doc_date: string

  @Column({ type: 'varchar' })
  doc_number: string

  @Column({ type: 'varchar' })
  doc_ocr: string

  @Column({ type: 'varchar' })
  doc_url: string

  @Column({ type: 'int' })
  doc_request: number

  @Column({ type: 'varchar' })
  doc_description: string

  @Column({ type: 'varchar' })
  created_by: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  created_at: string

  @OneToOne(() => RequestEntity)
  @JoinColumn({ name: 'doc_request' })
  requirement: RequestEntity
}
