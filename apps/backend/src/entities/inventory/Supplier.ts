import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { EntitiesTimeStamps } from '../../config/EntitiesTimestamps'
import { DecimalTransformer } from '../../config/transformers/decimalTransformer'
import { StatusEntityNumber } from '../../types'
import { Brand } from './Brand'
import { Measure } from './Measure'
import { Presentation } from './Presentation'
import { ProductCategory } from './ProductCategory'

@Entity({ name: 'inv_supplier' })
export class InvSupplier extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 150 })
  supplier: string

  @Column({ type: 'varchar', length: 150, name: 'legal_name' })
  legalName: string

  @Column({ type: 'varchar', length: 15, name: 'legal_number' })
  legalNumber: string

  @Column({ type: 'varchar', length: 250 })
  address: string

  @Column({ type: 'varchar', length: 15, name: 'legal_account_bco' })
  legalAccountBco: string

  @Column({ type: 'varchar', length: 15, name: 'legal_account_num' })
  legalAccountNum: string

  @Column({ type: 'varchar', length: 15, name: 'legal_account_cci' })
  legalAccountCci: string

  @Column({ type: 'varchar', length: 15, name: 'legal_account_cur' })
  legalAccountCur: string

  @Column({ type: 'varchar', length: 15, name: 'legal_account_type' })
  legalAccountType: string

  @Column({ type: 'tinyint' })
  status: StatusEntityNumber
}
