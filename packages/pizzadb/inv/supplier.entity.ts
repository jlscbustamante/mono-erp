import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { EntitiesTimeStamps } from "../transformers/entities-timestamps";

@Entity({ name: "inv_supplier" })
export class InvSupplier extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 150 })
  supplier: string;

  @Column({ type: "varchar", length: 150, name: "legal_name" })
  legalName: string;

  @Column({ type: "varchar", length: 15, name: "legal_number" })
  legalNumber: string;

  @Column({ type: "varchar", length: 250 })
  address: string;

  @Column({ type: "varchar", length: 15, name: "bank_name" })
  legalAccountBco: string;

  @Column({ type: "varchar", length: 5 })
  bank_code: string;

  @Column({ type: "varchar", length: 15, name: "bank_account_num" })
  legalAccountNum: string;

  @Column({ type: "varchar", length: 15, name: "bank_account_cci" })
  legalAccountCci: string;

  legalAccountCur: string;

  @Column({ type: "varchar", length: 15, name: "bank_account_type" })
  legalAccountType: string;

  @Column({ type: "tinyint" })
  status: number;
}
