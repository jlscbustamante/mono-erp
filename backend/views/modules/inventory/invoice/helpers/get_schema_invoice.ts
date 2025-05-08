import {
  InvoiceSchema,
  InvoiceSchemaItem,
} from "#app/modules/inventory/invoice/ext/api_invoice.ts";
import { InvDispatchItemSelect, InvDispatchSelect } from "@scope/shared";

export const get_schema_invoice = (props: {
  dispatch: InvDispatchSelect;
  items: InvDispatchItemSelect[];
  client: {
    legal_name: string;
    legal_number: string;
    legal_address: string;
  };
  warehouse: {
    correlativo: number;
    serie: string;
    legal_name: string;
    legal_number: string;
    name: string;
    legal_address: string;
    id: string;
  };
}) => {
  const invoice_schema: InvoiceSchema = {
    store_direction: props.warehouse.legal_address,
    store_ruc: props.warehouse.legal_number,
    store_name: props.warehouse.name,
    store_nro_doc: props.warehouse.legal_number,
    store_serie: props.warehouse.serie,
    store_id: props.warehouse.id,
    store_correlativo: props.warehouse.correlativo.toString(),
    store_razon_social: props.warehouse.legal_name,
    client_razon_social: props.client.legal_name,
    client_email: null,
    client_nro_doc: props.client.legal_name,
    client_direction: props.client.legal_address,
    orden_nro: props.dispatch.id,
    total_price: +props.dispatch.total_value,
    company_id: "ERPRAUL",
    items: props.items.map(
      (el) =>
        ({
          description: el.item_name,
          id: el.item_id,
          price: +el.unit_value,
          quantity: +el.quantity,
        } satisfies InvoiceSchemaItem)
    ),
  };

  return invoice_schema;
};
