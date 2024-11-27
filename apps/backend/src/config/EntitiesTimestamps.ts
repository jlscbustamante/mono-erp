import { BeforeUpdate, CreateDateColumn, UpdateDateColumn } from 'typeorm'

import { dateNow } from '../utils/getDate'
import { DateTransformer } from './transformers/dateTransformer'

export class EntitiesTimeStamps {
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
    transformer: new DateTransformer(),
  })
  createdAt: string

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
    transformer: new DateTransformer(),
  })
  updatedAt: string

  @BeforeUpdate()
  updateTimeStamps?(): void {
    this.updatedAt = dateNow()
  }
}
