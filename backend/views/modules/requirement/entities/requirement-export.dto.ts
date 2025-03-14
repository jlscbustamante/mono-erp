export interface RequirementExportDto {
  id: number;
  proveedor: string;
  ruc: string;
  fecha_solicitud: string;
  documento: string;
  description: string;
  centro_costo: string;
  categoria: string;
  registrado_por: string;
  cuotas: string;
  monto_total: number;
  monto_pagado: number;
  monto_pendiente: number;
}
