import { db } from "#app/config/database.ts";
import { generateGuideWithTransportApi } from "#app/modules/inventory/invoice/ext/api_guide.ts";
import { generateInvoiceApi } from "#app/modules/inventory/invoice/ext/api_invoice.ts";
import { get_schema_guide } from "#app/modules/inventory/invoice/helpers/get_schema_guide.ts";
import { get_schema_invoice } from "#app/modules/inventory/invoice/helpers/get_schema_invoice.ts";
import { HTTPException } from "hono/http-exception";
import {
  AdmSucursalSelect,
  AdmSucursalUpdate,
} from "../../../../../shared/db/mods.ts";
import {
  DISPATCH_STATUS,
  TransportInfoDto,
} from "../../../../../shared/types/index.ts";

export const invoice_and_generate_guide = async (
  dispatch_id: number,
  transport: TransportInfoDto
) => {
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

  if (!warehouse.cfd_serie_gr)
    throw new Error("Serie de guia no configurada almacen");
  const serie_guide: string = warehouse.cfd_serie_gr;
  const new_correlative_guide = warehouse.cfd_seql_gr
    ? +warehouse.cfd_seql_gr + 1
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

  const schema_guide = get_schema_guide({
    dispatch,
    items,
    num_invoice,
    client: {
      legal_address: client.ubi_address ?? "",
      legal_number: client.sede_nro_ruc ?? "",
      legal_name: client.sede_razon_social ?? "",
      name: client.title ?? "",
      district: client.ubi_district ?? "",
    },
    warehouse: {
      correlativo: new_correlative_guide,
      serie: serie_guide,
      legal_name: warehouse.sede_razon_social ?? "",
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

  let num_guide: string;
  try {
    const guide_number = await generateGuideWithTransportApi(schema_guide);
    num_guide = guide_number;
  } catch (err: any) {
    console.log("error al generar guia: ", err.message);
    num_guide = "";
  }

  // ACTUALIZAR NUM_INVOICE Y NUM_GUIDE actualizar

  await db.transaction().execute(async (trx) => {
    await trx
      .updateTable("inv_dispatch")
      .set({
        num_invoice: num_invoice,
        num_guide: num_guide,
        status: DISPATCH_STATUS.INVOICED,
        conductor_nro_doc: transport.driver_document_number,
        conductor_tipo_doc: transport.driver_document_type,
        conductor_nombres: transport.driver_first_name,
        conductor_apellidos: transport.driver_last_name,
        conductor_nro_licencia: transport.driver_license_number,
        transporte_nro_placa: transport.lincense_plate_number,
        transporte_razon_social: transport.transport_company_name,
      })
      .where("id", "=", dispatch_id)
      .execute();

    const update_sucursal: AdmSucursalUpdate = {
      cfd_seql_fa: new_correlative_invoice,
    };
    if (num_guide) {
      update_sucursal.cfd_seql_gr = new_correlative_guide;
    }

    await trx
      .updateTable("adm_sucursal")
      .set(update_sucursal)
      .where("id", "=", warehouse.id)
      .execute();
  });
};

function validate_suscursal_legal_attrs(sucursal: AdmSucursalSelect) {
  if (!sucursal.sede_nro_ruc) {
    throw new Error(`Sucursal ${sucursal.title} no tiene nro de ruc`);
  }
  if (!sucursal.sede_razon_social) {
    throw new Error(`Sucursal ${sucursal.title} no tiene razon social`);
  }
  if (!sucursal.ubi_address) {
    throw new Error(`Sucursal ${sucursal.title} no tiene direccion`);
  }
}
