import type { RequirementSelect } from "@scope/pizzadb/types";
import dayjs from "dayjs";

export enum PAYMENT_METHOD {
  CREDIT = "CREDITO",
  CASH = "CONTADO",
}
export enum REQUIREMENT_STATUS {
  APPROVED = "A",
  PENDING = "S",
  PAID = "P",
  CANCELLED = "R",
}

export enum REQUIREMENT_TYPE_DOCUMENT {
  FACTURA = "01",
  BOLETA = "03",
  TICKET_SALIDA = "04",
  NOTA_CREDITO = "07",
  NOTA_DEBITO = "08",
  GUIA_REMISION = "09",
  GUIA_TRANSPORTISTA = "31",
}

export class Requirement {
  readonly id: number;
  readonly companyId: number;
  readonly companyName: string;
  readonly supplierId: number | null;
  readonly supplierRuc: string | null;
  readonly supplierName: string | null;
  readonly cashId: number;
  readonly cashName: string;
  readonly requestedAt: string;
  readonly numDoc: string | null;
  readonly description: string;
  readonly costCenterId: number | null;
  readonly costCenterName: string | null;
  readonly createdBy: string;
  readonly paymentMethod: PAYMENT_METHOD;
  readonly amount: number;
  readonly quotaCount: number;
  readonly status: REQUIREMENT_STATUS;
  readonly typeDocument: REQUIREMENT_TYPE_DOCUMENT;
  readonly hasRetation: boolean;

  constructor(props: RequirementSelect) {
    this.id = props.id;
    this.supplierId = props.supplier_id;
    this.supplierRuc = props.legal_number;
    this.companyId = 0;
    this.companyName = "";
    this.supplierName = props.legal_name;
    this.cashId = 0;
    this.cashName = "";
    this.typeDocument = REQUIREMENT_TYPE_DOCUMENT.BOLETA;
    this.requestedAt = props.requested_at
      ? dayjs(props.requested_at).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");
    this.numDoc = props.num_document;
    this.description = props.description ?? "";
    this.costCenterId = props.costcenter_id;
    this.costCenterName = props.costcenter_name;
    this.createdBy = props.created_by ?? "";
    this.paymentMethod = props.pay_method as PAYMENT_METHOD;
    this.amount = props.amount ?? 0;
    this.quotaCount = props.nro_quotas ?? 0;
    this.status = props.status as REQUIREMENT_STATUS;
    this.hasRetation = false;
  }
}
