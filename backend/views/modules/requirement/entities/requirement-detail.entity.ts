import {
  REQUIERMENT_TYPE,
  REQUIREMENT_STATUS,
} from "#app/modules/requirement/interfaces/enums.ts";
import {
  CashBankSelect,
  RequirementItemSelect,
  RequirementSelect,
  SupplierSelect,
} from "@scope/pizzadb/types";
import {
  IRequirementDetail,
  IRequirementDetailItem,
} from "../interfaces/requirement-detail.interface.ts";

export class RequirementDetail implements IRequirementDetail {
  readonly id: number;
  readonly companyId: string;
  readonly supplierId: number;
  readonly amount: number;
  readonly ruc: string;
  readonly legalName: string;
  readonly description: string;
  readonly documentType: string;
  readonly documentNumber: string;
  readonly categoryId: number | null;
  readonly categoryName: string | null;
  readonly costCenterName: string | null;
  readonly numQuotas: number;
  readonly createdBy: string;
  readonly paymentMethod: string;
  readonly status: REQUIREMENT_STATUS;
  readonly costCenterId: number | null;
  readonly items: IRequirementDetailItem[];
  readonly type: REQUIERMENT_TYPE;

  constructor({
    requirement,
    items,
    supplier,
  }: {
    requirement: RequirementSelect;
    items: (RequirementItemSelect & { cashbank: CashBankSelect | null })[];
    supplier?: SupplierSelect;
  }) {
    this.id = requirement.id;
    this.type = requirement.request_type as REQUIERMENT_TYPE;
    this.companyId = requirement.company_id!;
    this.amount = requirement.amount!;
    this.supplierId = supplier?.id ?? 0;
    this.ruc = supplier?.legal_number ?? "";
    this.legalName = supplier?.legal_name ?? "";
    this.description = requirement.description ?? "";
    this.documentType = requirement.type_document ?? "";
    this.documentNumber = requirement.num_document ?? "";
    this.paymentMethod = requirement.pay_method!;
    this.numQuotas = requirement.nro_quotas ?? 1;
    this.costCenterId = requirement.costcenter_id ?? null;
    this.costCenterName = requirement.costcenter_name ?? null;
    this.categoryId = requirement.movecash_id ?? null;
    this.categoryName = requirement.movecash_name ?? null;
    this.status = requirement.status as REQUIREMENT_STATUS;
    this.createdBy = requirement.created_by!;
    this.items = items.map((item) => {
      const hasRetention = item.retention == "1";
      return {
        id: item.id,
        amount: item.amount!,
        hasRetention,
        retention: hasRetention ? item.amount_ret! : 0,
        netAmount: hasRetention ? item.amount_net! : item.amount!,
        cashbankId: item.cashbank_id ?? null,
        paymentMethod: requirement.pay_method!,
        description: item.description ?? "",
        expiresAt: item.expires_at?.split(" ")[0] ?? null,
        cashbankName: item.cashbank?.cashbank ?? null,
      } satisfies IRequirementDetailItem;
    });
  }
}
