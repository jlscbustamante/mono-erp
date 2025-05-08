import { db } from "#app/config/database.ts";
import { get_schema_invoice } from "#app/modules/inventory/invoice/helpers/get_schema_invoice.ts";

export const dispatch_invoice = async (dispatch_id: number) => {
  const dispatch = await db
    .selectFrom("inv_dispatch")
    .selectAll()
    .where("id", "=", dispatch_id)
    .executeTakeFirstOrThrow();
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
  const warehouse = await db
    .selectFrom("adm_sucursal")
    .selectAll()
    .where("id", "=", dispatch.sucursal_from_id)
    .executeTakeFirstOrThrow();

  const new_correlative = warehouse.cfd_seql_fa ? warehouse.cfd_seql_fa + 1 : 1;

  const schema = get_schema_invoice({
    dispatch,
    items,
    client: {
      legal_address: client.ubi_address ?? "",
      legal_number: client.sede_nro_ruc ?? "",
      legal_name: client.title ?? "",
      district: client.ubi_district ?? "",
      name: client.title ?? "",
    },
    warehouse: {
      correlativo: new_correlative,
      serie: warehouse.cfd_serie_fa ?? "",
      legal_name: warehouse.title ?? "",
      legal_number: warehouse.sede_nro_ruc ?? "",
      name: warehouse.title ?? "",
      legal_address: warehouse.ubi_address ?? "",
      id: warehouse.id,
      district: warehouse.ubi_district ?? "",
    },
  });

  return schema;
  // const num_invoice = await generateInvoiceApi(schema);
  // ACTUALIAR NUM INVOICE
};
