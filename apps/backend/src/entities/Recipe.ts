import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

//imports de entidades relacionadas

@Entity({ name: 'inv_recipe' })
export class Recipe {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar' })
  company_id: string

  @Column({ type: 'varchar' })
  recipe: string

  @Column({ type: 'int' })
  menu_item_id: number

  @Column({ type: 'varchar' })
  save_tag: string

  @Column({ type: 'smallint' })
  status: number
}
