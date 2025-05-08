import { db } from "#app/config/database.ts";
import { generateGuideWithTransportApi } from "#app/modules/inventory/invoice/ext/api_guide.ts";
import { generateInvoiceApi } from "#app/modules/inventory/invoice/ext/api_invoice.ts";
import { get_schema_guide } from "#app/modules/inventory/invoice/helpers/get_schema_guide.ts";
import { get_schema_invoice } from "#app/modules/inventory/invoice/helpers/get_schema_invoice.ts";

export const invoice_and_generate_guide = async (
  dispatch_id: number,
  transport: {
    transport_company_name: string;
    lincense_plate_number: string;
    driver_document_type: string;
    driver_document_number: string;
    driver_first_name: string;
    driver_last_name: string;
    driver_license_number: string;
  }
) => {
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

  const new_correlative_invoice = warehouse.cfd_seql_fa
    ? warehouse.cfd_seql_fa + 1
    : 1;
  const new_correlative_guide = warehouse.cfd_seql_gr
    ? warehouse.cfd_seql_gr + 1
    : 1;

  const schema_invoice = get_schema_invoice({
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
      correlativo: new_correlative_invoice,
      serie: warehouse.cfd_serie_fa ?? "",
      legal_name: warehouse.title ?? "",
      legal_number: warehouse.sede_nro_ruc ?? "",
      name: warehouse.title ?? "",
      legal_address: warehouse.ubi_address ?? "",
      id: warehouse.id,
      district: warehouse.ubi_district ?? "",
    },
  });

  const num_invoice = await generateInvoiceApi(schema_invoice);

  const schema_guide = get_schema_guide({
    dispatch,
    items,
    num_invoice,
    client: {
      legal_address: client.ubi_address ?? "",
      legal_number: client.sede_nro_ruc ?? "",
      legal_name: client.title ?? "",
      name: client.title ?? "",
      district: client.ubi_district ?? "",
    },
    warehouse: {
      correlativo: new_correlative_guide,
      serie: warehouse.cfd_serie_gr ?? "",
      legal_name: warehouse.title ?? "",
      legal_number: warehouse.sede_nro_ruc ?? "",
      name: warehouse.title ?? "",
      legal_address: warehouse.ubi_address ?? "",
      id: warehouse.id,
      district: warehouse.ubi_district ?? "",
    },
    transport: {
      transport_company_name: transport.transport_company_name,
      lincense_plate_number: transport.lincense_plate_number,
      driver_document_type: transport.driver_document_type,
      driver_document_number: transport.driver_document_number,
      driver_first_name: transport.driver_first_name,
      driver_last_name: transport.driver_last_name,
      driver_license_number: transport.driver_license_number,
    },
  });

  const num_guide = await generateGuideWithTransportApi(schema_guide);

  return {
    guide: schema_guide,
    invoice: schema_invoice,
  };

  // ACTUALIZAR NUM_INVOICE Y NUM_GUIDE actualizar
};
