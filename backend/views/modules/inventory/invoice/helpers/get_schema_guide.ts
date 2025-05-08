import {
  GuideSchemaItem,
  GuideWithTransportScheme,
} from "#app/modules/inventory/invoice/ext/api_guide.ts";
import { InvDispatchItemSelect, InvDispatchSelect } from "@scope/shared";

export const get_schema_guide = (props: {
  num_invoice?: string;
  dispatch: InvDispatchSelect;
  items: InvDispatchItemSelect[];
  transport: {
    transport_company_name: string;
    lincense_plate_number: string;
    driver_document_type: string;
    driver_document_number: string;
    driver_first_name: string;
    driver_last_name: string;
    driver_license_number: string;
  };
  client: {
    legal_name: string;
    legal_number: string;
    legal_address: string;
    name: string;
    district: string;
  };
  warehouse: {
    correlativo: number;
    serie: string;
    legal_name: string;
    legal_number: string;
    name: string;
    legal_address: string;
    district: string;
    id: string;
  };
}) => {
  const schema: GuideWithTransportScheme = {
    efact_document: props.num_invoice ?? "",
    store_from: {
      store_id: props.warehouse.id,
      cfd_serie: props.warehouse.serie,
      cfd_correlativo: props.warehouse.correlativo.toString(),
      street_name: props.warehouse.legal_address,
      title: props.warehouse.name,
      nro_ruc: props.warehouse.legal_number,
      razon_social: props.warehouse.legal_name,
      district: props.warehouse.district,
    },
    store_to: {
      street_name: props.client.legal_address,
      title: props.client.name,
      nro_ruc: props.client.legal_number,
      razon_social: props.client.legal_name,
      district: props.client.district,
    },
    dispatch: {
      conductor_apellidos: props.transport.driver_last_name,
      conductor_nombres: props.transport.driver_first_name,
      conductor_nro_doc: props.transport.driver_document_number,
      conductor_nro_licencia: props.transport.driver_license_number,
      conductor_tipo_doc: props.transport.driver_document_type,
      transporte_nro_placa: props.transport.lincense_plate_number,
      transporte_razon_social: props.transport.transport_company_name,
    },
    dispatch_items: props.items.map(
      (el) =>
        ({
          dispatch_order: props.dispatch.id.toString(),
          product_id: el.item_id.toString(),
          quantity: el.quantity.toString(),
          unit_value: el.unit_value.toString(),
          item_name: el.item_name,
          mesure_code: "KG",
        } satisfies GuideSchemaItem)
    ),
  };

  return schema;
};
