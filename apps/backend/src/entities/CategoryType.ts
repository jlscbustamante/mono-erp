import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { CategoryTypeId } from '../types/category'

@Entity({ name: 'adm_type_category' })
export class CategoryType {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'enum', enum: CategoryTypeId })
  type_id: CategoryTypeId

  @Column({ type: 'char' })
  status: 'A' | 'E'
}
