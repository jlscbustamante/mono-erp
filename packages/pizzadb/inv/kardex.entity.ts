import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Sucursal } from "../shared";
import { DecimalTransformer } from "../transformers/decimalTransformer";


@Entity({ name: 'inv_kardex' })
export class InvKardex {
  @PrimaryGeneratedColumn()
  id: number

  @Column("int")
  item_id: number

  @Column("varchar", { length: 150 })
  item_name: string

  @Column("int")
  presentation_id: number

  @Column("varchar", { length: 150 })
  presentation_name: string

  @Column("char")
  move_type: string

  @Column("int")
  move_id: number

  @Column("char")
  move_flow: string

  @Column("char")
  type_doc: string | null

  @Column("varchar", { length: 15 })
  num_doc: string | null

  @Column("varchar", { length: 10 })
  warehouse_id: string

  @Column("datetime")
  move_at: Date

  @Column("decimal", { precision: 16, scale: 3, transformer: new DecimalTransformer() })
  quantity: number

  @Column("decimal", { precision: 8, scale: 2, transformer: new DecimalTransformer() })
  unit_purchase: number

  @Column("decimal", { precision: 8, scale: 2, transformer: new DecimalTransformer() })
  unit_price: number

  @Column("decimal", { precision: 16, scale: 2, transformer: new DecimalTransformer() })
  total_price: number

  @Column("decimal", { precision: 16, scale: 3, transformer: new DecimalTransformer() })
  stock_last: number

  @Column("decimal", { precision: 16, scale: 3, transformer: new DecimalTransformer() })
  stock_current: number

  @Column("decimal", { precision: 16, scale: 2, transformer: new DecimalTransformer() })
  total_last: number

  @Column("decimal", { precision: 16, scale: 2, transformer: new DecimalTransformer() })
  total_current: number

  @Column("varchar", { length: 150, default: 'sys' })
  created_by: string

  @ManyToOne(() => Sucursal)
  @JoinColumn({name: 'warehouse_id'})
  warehouse: Sucursal

  @CreateDateColumn({})
  created_at: Date

  @UpdateDateColumn({})
  updated_at: Date

  @BeforeInsert()
  private setCreatedAt() {
    this.created_at = new Date()
    this.updated_at = new Date()
  }

  @BeforeUpdate()
  private setUpdatedAt() {
    this.updated_at = new Date()
  }


}

export interface IKardex extends Omit<InvKardex, "created_at" | "updated_at" | "setCreatedAt" | "setUpdatedAt"> {
  created_at: string
  updated_at: string
}