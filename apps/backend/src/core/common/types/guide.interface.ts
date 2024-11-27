export interface GuideSchema {
  store_from: {
    store_id: string
    cfd_serie: string
    cfd_correlativo: string
    street_name: string
    title: string
    nro_ruc: string
    razon_social: string
    district: string
  }
  store_to: {
    street_name: string
    title: string
    nro_ruc: string
    razon_social: string
    district: string
  }
  dispatch_items: GuideSchemaItem[]
  efact_document: string
}

export interface GuideSchemaItem {
  dispatch_order: string
  product_id: string
  quantity: string
  unit_value: string
  item_name: string
  mesure_code: string
}

export interface GuideWithTransportScheme extends GuideSchema {
  dispatch: {
    transporte_razon_social: string
    transporte_nro_placa: string
    conductor_tipo_doc: string
    conductor_nro_doc: string
    conductor_nombres: string
    conductor_apellidos: string
    conductor_nro_licencia: string
  }
}
