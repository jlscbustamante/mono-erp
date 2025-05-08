export interface GuideSchema {
  store_from: {
    store_id: string;
    cfd_serie: string;
    cfd_correlativo: string;
    street_name: string;
    title: string;
    nro_ruc: string;
    razon_social: string;
    district: string;
  };
  store_to: {
    street_name: string;
    title: string;
    nro_ruc: string;
    razon_social: string;
    district: string;
  };
  dispatch_items: GuideSchemaItem[];
  efact_document: string;
}

export interface GuideSchemaItem {
  dispatch_order: string;
  product_id: string;
  quantity: string;
  unit_value: string;
  item_name: string;
  mesure_code: string;
}

export interface GuideWithTransportScheme extends GuideSchema {
  dispatch: {
    transporte_razon_social: string;
    transporte_nro_placa: string;
    conductor_tipo_doc: string;
    conductor_nro_doc: string;
    conductor_nombres: string;
    conductor_apellidos: string;
    conductor_nro_licencia: string;
  };
}

interface ApiResponse {
  message: string;
  CODIGO: string;
  ID: number;
}

export const generateGuideApi = async (
  guideSchema: GuideSchema
): Promise<string> => {
  const request = await fetch("url_guia", {
    method: "POST",
    body: JSON.stringify(guideSchema),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!is2xxStatusCode(request.status) || !request.ok) {
    console.log("schema error : ", guideSchema);
    await handleError(request);
  }
  const data: ApiResponse = await request.json();
  console.log("[Guia] generada : ", data.CODIGO);
  return data.CODIGO;
};

export const generateGuideWithTransportApi = async (
  guideSchema: GuideWithTransportScheme
): Promise<string> => {
  return Promise.resolve("T01313");
  const request = await fetch("url_guide", {
    method: "POST",
    body: JSON.stringify(guideSchema),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!is2xxStatusCode(request.status) || !request.ok) {
    console.log("schema error : ", guideSchema);
    await handleError(request);
  }
  const data: ApiResponse = await request.json();
  console.log("[Guia] generada : ", data.CODIGO);
  return data.CODIGO;
};

const handleError = async (res: Response) => {
  try {
    const data: any = await res.json();
    console.log("Error al generar la guia: ", data);
    throw new Error(data.message);
  } catch (err: any) {
    throw new Error("Error al generar la guia");
  }
};

const is2xxStatusCode = (status: number) => {
  return status >= 200 && status < 300;
};
