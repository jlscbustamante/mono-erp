import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { EntitiesTimeStamps } from '../../config/EntitiesTimestamps'

export enum DispatchUsedTo {
  Store = 'D',
  // StoreInventory = 'I',
  Warehouse = 'W',
}

@Entity({ name: 'inv_tmplt_dispatch' })
export class InvDispatchBase extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'smallint', default: 1, nullable: false })
  status: 0 | 1

  @Column({ type: 'varchar', length: 15, name: 'company_id' })
  sucursal_type: string

  @Column({ type: 'char' })
  used_to: DispatchUsedTo
}
