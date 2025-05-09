import { db } from "#app/config/database.ts";
import { generateInvoiceApi } from "#app/modules/inventory/invoice/ext/api_invoice.ts";
import { get_schema_invoice } from "#app/modules/inventory/invoice/helpers/get_schema_invoice.ts";
import { validate_suscursal_legal_attrs } from "#app/modules/inventory/invoice/helpers/validate_sucursal_legal_attrs.ts";
import { HTTPException } from "hono/http-exception";
import {
  AdmSucursalUpdate,
  DISPATCH_STATUS,
} from "../../../../../shared/types/index.ts";

export const generate_invoice = async (dispatch_id: number) => {
  const dispatch = await db
    .selectFrom("inv_dispatch")
    .selectAll()
    .where("id", "=", dispatch_id)
    .executeTakeFirstOrThrow();

  if (dispatch.status != DISPATCH_STATUS.DISPATCHED) {
    throw new HTTPException(400, {
      message: "El despacho no se encuentra en estado DESPACHADO",
    });
  }

  const items = await db
    .selectFrom("inv_dispatch_item")
    .selectAll()
    .where("dispatch_id", "=", dispatch_id)
    .execute();

  const client = await db
    .selectFrom("adm_sucursal")
    .selectAll()
    .where("id", "=", dispatch.sucursal_to_id)
    .executeTakeFirstOrThrow();

  validate_suscursal_legal_attrs(client);
  const warehouse = await db
    .selectFrom("adm_sucursal")
    .selectAll()
    .where("id", "=", dispatch.sucursal_from_id)
    .executeTakeFirstOrThrow();
  validate_suscursal_legal_attrs(warehouse);

  if (client.sede_nro_ruc == warehouse.sede_nro_ruc) {
    throw new HTTPException(400, {
      message: "No se puede facturar a la misma razón social",
    });
  }

  if (!warehouse.cfd_serie_fa)
    throw new Error("Serie de factura no configurada almacen");
  const serie_invoice: string = warehouse.cfd_serie_fa;
  const new_correlative_invoice = warehouse.cfd_seql_fa
    ? +warehouse.cfd_seql_fa + 1
    : 1;

  const schema_invoice = get_schema_invoice({
    dispatch,
    items,
    client: {
      legal_address: client.ubi_address ?? "",
      legal_number: client.sede_nro_ruc ?? "",
      legal_name: client.sede_razon_social ?? "",
      district: client.ubi_district ?? "",
      name: client.title ?? "",
    },
    warehouse: {
      correlativo: new_correlative_invoice,
      serie: serie_invoice,
      legal_name: warehouse.sede_razon_social ?? "",
      legal_number: warehouse.sede_nro_ruc ?? "",
      name: warehouse.title ?? "",
      legal_address: warehouse.ubi_address ?? "",
      id: warehouse.id,
      district: warehouse.ubi_district ?? "",
    },
  });

  const num_invoice = await generateInvoiceApi(schema_invoice);

  await db.transaction().execute(async (trx) => {
    await trx
      .updateTable("inv_dispatch")
      .set({
        num_invoice: num_invoice,
        status: DISPATCH_STATUS.INVOICED,
      })
      .where("id", "=", dispatch_id)
      .execute();

    const update_sucursal: AdmSucursalUpdate = {
      cfd_seql_fa: new_correlative_invoice,
    };

    await trx
      .updateTable("adm_sucursal")
      .set(update_sucursal)
      .where("id", "=", warehouse.id)
      .execute();
  });
};
