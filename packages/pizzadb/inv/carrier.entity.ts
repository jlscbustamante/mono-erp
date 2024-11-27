import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("inv_carrier")
export class Carrier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 150, name: "carrier_name", nullable: false })
  transportName: string;

  @Column("varchar", { length: 150, name: "carrier_razon_social" })
  transportCompanyName: string;

  @Column("varchar", { length: 20, name: "carrier_tipo_doc" })
  carrierDocType: string;

  @Column("varchar", { length: 20, name: "carrier_nro_doc" })
  carrierDocNumber: string;

  @Column("varchar", { length: 20, name: "transporte_nro_placa" })
  transportPlateNumber: string;

  @Column("varchar", { length: 20, name: "conductor_tipo" })
  driverType: string;

  @Column("varchar", { length: 20, name: "conductor_tipo_doc" })
  driverTypeDoc: string;

  @Column("varchar", { length: 20, name: "conductor_nro_doc" })
  driverDocNumber: string;

  @Column("varchar", { length: 200, name: "conductor_nombres" })
  driverFirstName: string;

  @Column("varchar", { length: 200, name: "conductor_apellidos" })
  driverLastName: string;

  @Column("varchar", { length: 20, name: "conductor_nro_licencia" })
  driverLicenseNumber: string;

  @Column("smallint", {
    name: "status",
    transformer: {
      from: (dat) => dat.toString(),
      to: (dat) => dat.toString(),
    },
  })
  status: string;
}
