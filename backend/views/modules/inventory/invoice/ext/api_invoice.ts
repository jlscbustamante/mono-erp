export interface InvoiceSchema {
  store_direction: string;
  store_ruc: string;
  store_name: string;
  store_nro_doc: string;
  store_serie: string;
  store_id: string;
  store_correlativo: string;
  store_razon_social: string;
  client_razon_social: string;
  client_email: null;
  client_nro_doc: string;
  client_direction: string;
  orden_nro: number;
  total_price: number;
  items: InvoiceSchemaItem[];
  company_id: string;
}

export interface InvoiceSchemaItem {
  quantity: number;
  price: number;
  id: number;
  description: string;
}
