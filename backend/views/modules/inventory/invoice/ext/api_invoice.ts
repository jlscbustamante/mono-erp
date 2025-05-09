import { appConfig } from "#app/config/index.ts";

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

interface ApiResponse {
  message: string;
  CODIGO: string;
  IdDoc: number;
}

export const generateInvoiceApi = async (
  invoceSchema: InvoiceSchema
): Promise<string> => {
  const request = await fetch(
    `${appConfig.facturacion.host}/api/documentSaleInvoiceDocument`,
    {
      method: "POST",
      body: JSON.stringify(invoceSchema),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!is2xxStatusCode(request.status) || !request.ok) {
    // console.log("schema error : ", invoceSchema);
    await handleError(request);
  }
  const data: ApiResponse = await request.json();
  console.log(
    "[Factura] generada : ",
    data.CODIGO + " - ",
    invoceSchema.store_correlativo
  );
  return data.CODIGO;
};

const handleError = async (res: Response) => {
  try {
    const data: any = await res.json();
    console.log("Error al generar la factura : ", data);
    throw new Error(data.message);
  } catch {
    throw new Error("Error al generar la factura");
  }
};

const is2xxStatusCode = (status: number) => {
  return status >= 200 && status < 300;
};
