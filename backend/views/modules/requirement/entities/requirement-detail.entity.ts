import { REQUIREMENT_STATUS } from "#app/modules/requirement/interfaces/enums.ts";
import {
  RequirementItemSelect,
  RequirementSelect,
  SupplierSelect,
} from "@scope/pizzadb/types";
import { IRequirementDetail } from "../interfaces/requirement-detail.interface.ts";

export class RequirementDetail implements IRequirementDetail {
  readonly id: number;
  readonly companyId: string;
  readonly companyName: string;
  readonly costCenterId: number;
  readonly costCenterName: string;
  readonly supplierId: number;
  readonly supplierName: string;
  readonly supplierRuc: string;
  readonly globalDescription: string;
  readonly documentType: string;
  readonly documentNumber: string;

  readonly amount: number;
  readonly expiresAt: string | null;
  readonly cashBankId: number | null;
  readonly cashBankName: string | null;
  readonly status: REQUIREMENT_STATUS;
  readonly description: string;

  readonly globalAmount: number;
  readonly globalId: number;

  readonly createdBy: string;
  readonly createdAt: string;

  constructor({
    adm_request,
    adm_request_item,
    inv_supplier,
  }: {
    adm_request: RequirementSelect;
    adm_request_item: RequirementItemSelect;
    inv_supplier: SupplierSelect;
  }) {
    this.id = adm_request_item.id;
    this.companyId = adm_request.company_id ?? "";
    this.companyName = adm_request.costcenter_name ?? "";
    this.costCenterId = adm_request.costcenter_id ?? 0;
    this.costCenterName = adm_request.costcenter_name ?? "";
    this.supplierId = inv_supplier.id;
    this.description = adm_request_item.description ?? "";
    this.supplierName = inv_supplier.supplier;
    this.supplierRuc = inv_supplier.legal_number ?? "";
    this.globalDescription = adm_request.description ?? "";
    this.documentType = adm_request.type_document ?? "";
    this.documentNumber = adm_request.num_document ?? "";
    this.globalAmount = adm_request.amount ?? 0;
    this.globalId = adm_request.id;
    this.createdBy = adm_request.created_by ?? "";
    this.createdAt = adm_request.requested_at ?? "";
    this.amount = adm_request_item.amount ?? 0;
    this.expiresAt = adm_request_item.expires_at ?? null;
    this.status = adm_request_item.status as REQUIREMENT_STATUS;
    this.cashBankId = adm_request_item.cashbank_id;
    this.cashBankName = adm_request_item.cashbank_name;
  }
}
