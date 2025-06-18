import type { Insertable, Selectable, Updateable } from "kysely";
import type {
  AdmPaymentOrder,
  AdmReqContract,
  AdmReqNondocs,
  AdmRequirement,
  FinCashbank,
  InvSupplier,
} from "./generated.ts";

export type AdmRequirementInsert = Insertable<AdmRequirement>;
export type AdmRequirementSelect = Selectable<AdmRequirement>;

export type InvSupplierSelect = Selectable<InvSupplier>;

export type AdmPaymentOrderInsert = Insertable<AdmPaymentOrder>;
export type AdmPaymentOrderSelect = Selectable<AdmPaymentOrder>;
export type AdmPaymentOrderUpdate = Updateable<AdmPaymentOrder>;

export type AdmReqNondocsInsert = Insertable<AdmReqNondocs>;
export type AdmReqNondocsSelect = Selectable<AdmReqNondocs>;

export type FinCashbankSelect = Selectable<FinCashbank>;

export type AdmReqContractSelect = Selectable<AdmReqContract>;
export type AdmReqContractInsert = Insertable<AdmReqContract>;
