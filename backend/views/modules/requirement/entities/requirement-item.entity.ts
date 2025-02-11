import { IRequirementPresentation } from "#app/modules/requirement/interfaces/requirement-presentation.interface.ts";
import {
  RequirementItemSelect,
  RequirementSelect,
  SupplierSelect,
} from "@scope/pizzadb/types";

export class RequirementPresentation implements IRequirementPresentation {
  readonly id: number;
  readonly supplier: string;
  readonly requestedAt: string;
  readonly numDoc: string;
  readonly description: string;
  readonly costCenter: string;
  readonly createdBy: string;
  readonly approvedBy: string;
  readonly paymentMethod: string;
  readonly numQuota: number;
  readonly expiresAt: string;
  readonly amount: number;

  constructor(props: {
    reqitem: RequirementItemSelect;
    adm_request: RequirementSelect;
    inv_supplier: SupplierSelect;
  }) {
    this.id = props.reqitem.id;
    this.supplier = props.inv_supplier.supplier;
    this.requestedAt = props.reqitem.requested_at ?? "";
    this.numDoc = props.adm_request.num_document ?? "";
    this.description = props.reqitem.description ?? "";
    this.costCenter = props.adm_request.costcenter_name ?? "";
    this.createdBy = props.adm_request.created_by ?? "";
    this.paymentMethod = props.adm_request.pay_method ?? "";
    this.numQuota = props.adm_request.nro_quotas ?? 1;
    this.expiresAt = props.reqitem.expires_at ?? "";
    this.amount = props.reqitem.amount ?? 0;
    this.approvedBy = props.reqitem.approved_by ?? "sys";
  }
}
