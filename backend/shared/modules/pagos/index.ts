import type {
  AdmPaymentOrderInsert,
  AdmReqNondocsSelect,
  AdmRequirementSelect,
  InvSupplierSelect,
} from "../../db/mods.ts";

export interface ICreateRequirementDto {
  company_id: string;
}

export enum REQUIREMENT_TYPE {
  SUPPLIER = "U",
  SIMPLE = "S",
  LIQUIDATION = "L",
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
  APPROVED = "A",
  CANCELED = "X",
  SENT_TO_BANK = "N",
  REJECTED = "R",
  PAYMENT_COMPLETED = "P",
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

export interface AdmReqNondocsViewDto extends AdmReqNondocsSelect {
  cashbank_source_name: string | null;
  cashbank_target_name: string | null;
}

export interface CreateOrderDto extends AdmPaymentOrderInsert {
  requirement_ids: number[];
}

// NOTE: This interface is used to mock the authorized user in the tests
export interface IMockAuthorizedUser {
  id: number;
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface ICreateMockAuthorizedUserDto
  extends Omit<IMockAuthorizedUser, "id"> {}

export interface ISelectMockAuthorizedUserDto
  extends Omit<IMockAuthorizedUser, "password"> {}

export interface IAdmRequirementWithSupplier extends AdmRequirementSelect {
  supplier: InvSupplierSelect;
}

export interface ITest {
  name: string;
  age: number;
}

export enum CONTRACT_STATUS {
  INGRESADO = "I",
  VIGENTE = "V",
  EXPIRADO = "E",
  PAGADO = "P",
  ANULADO = "X",
}

export const get_contract_status_name = (status: CONTRACT_STATUS) => {
  switch (status) {
    case CONTRACT_STATUS.INGRESADO:
      return "Ingresado";
    case CONTRACT_STATUS.VIGENTE:
      return "Vigente";
    case CONTRACT_STATUS.EXPIRADO:
      return "Expirado";
    case CONTRACT_STATUS.PAGADO:
      return "Pagado";
    case CONTRACT_STATUS.ANULADO:
      return "Anulado";
    default:
      return "Desconocido";
  }
};
