import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { EntitiesTimeStamps } from '../../config/EntitiesTimestamps'
import { Sucursal } from '../Sucursal'

@Entity({ name: 'inv_warehouse' })
export class InvWarehouse extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'name', type: 'varchar', length: 150 })
  name: string

  @Column({ name: 'sucursal_id', type: 'varchar' })
  sucursalId: string

  @Column({ type: 'smallint' })
  status: number

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.id)
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursal
}
