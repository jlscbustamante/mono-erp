import { IRequirementPresentation } from "#app/modules/requirement/interfaces/requirement-presentation.interface.ts";
import {
  RequirementItemSelect,
  RequirementSelect,
  SupplierSelect,
} from "@scope/pizzadb/types";
import { REQUIERMENT_TYPE, REQUIREMENT_STATUS } from "../interfaces/enums.ts";

export class RequirementPresentation implements IRequirementPresentation {
  readonly id: number;
  readonly supplier: string;
  readonly requestedAt: string;
  readonly numDoc: string;
  readonly description: string;
  readonly costCenter: string;
  readonly createdBy: string;
  readonly paymentMethod: string;
  readonly numQuota: number;
  readonly type: REQUIERMENT_TYPE;
  readonly amount: number;
  readonly category: string;
  readonly originName?: string | undefined;
  readonly destinyName?: string | undefined;
  readonly status: REQUIREMENT_STATUS;

  constructor(props: {
    reqitem: RequirementSelect;
    // adm_request: RequirementSelect;
    // 17
    items: RequirementItemSelect[];
    inv_supplier?: SupplierSelect;
  }) {
    this.id = props.reqitem.id;
    this.supplier = props.inv_supplier?.supplier ?? "";
    this.requestedAt = props.reqitem.requested_at?.split(" ")[0] ?? "";
    this.category = props.reqitem.movecash_name ?? "";
    this.type = props.reqitem.request_type as REQUIERMENT_TYPE;
    this.numDoc = props.reqitem.num_document ?? "";
    this.description = props.reqitem.description ?? "";
    this.costCenter = props.reqitem.costcenter_name ?? "";
    this.createdBy = props.reqitem.created_by ?? "";
    this.paymentMethod = props.reqitem.pay_method ?? "";
    // this.numQuota = props.reqitem.nro_quotas ?? 1;
    this.numQuota = props.items.filter(
      (el) => el.status != REQUIREMENT_STATUS.CANCELLED
    ).length;
    this.amount = props.reqitem.amount ?? 0;
    this.status = props.reqitem.status as REQUIREMENT_STATUS;

    if (this.type == REQUIERMENT_TYPE.TRANSFER) {
      this.originName =
        props.items.find((el) => el.amount > 0)?.cashbank_name ?? "";
      this.destinyName =
        props.items.find((el) => el.amount < 0)?.cashbank_name ?? "";
    }
  }
}
