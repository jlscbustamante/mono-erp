import { BeforeUpdate, CreateDateColumn, UpdateDateColumn } from 'typeorm'

import { dateNow } from '../utils/getDate'
import { DateTransformer } from './transformers/dateTransformer'

export class EntitiesTimeStampsCom {
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    transformer: new DateTransformer(),
  })
  created_at: string

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    transformer: new DateTransformer(),
  })
  updated_at: string

  @BeforeUpdate()
  updateTimeStamps(): void {
    this.updated_at = dateNow()
  }
}
