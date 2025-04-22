import { AdmPaymentOrderInsert } from "../../db/mods.ts";

export interface ICreateRequirementDto {
  company_id: string;
}

// I: Ingresado; D: Programado; A: Aprobado; N: Enviado Banco;  R: Rechazado; P: Pagado X: Anulado (S: Solicitado; A: Aprobado;  P: Pagado; R: Rechazado;
export enum PAYMENT_STATUS {
  REGISTERED = "I",
  SCHEDULED = "D",
  APPROVED = "A",
  SENT_TO_BANK = "N",
  REJECTED = "R",
  PAID = "P",
  CANCELED = "X",
}

export enum ORDER_PAYMENT_STATUS {
  REGISTERED = "I",
  AUTHORIZED = "A",
}

export interface RequirementViewDto {
  id: number;
  code: string;
  supplier_name: string;
  supplier_id: number;
  doc: string;
  description: string;
  cost_center: string | null;
  cost_center_id: number | null;
  movetype_id: number;
  movetype: string;
  amount: number;
  created_by: string;
  requested_at: string;
  expires_at: string | null;
  status: PAYMENT_STATUS;
}

export interface CreateOrderDto extends AdmPaymentOrderInsert {
  requirement_ids: number[];
}
