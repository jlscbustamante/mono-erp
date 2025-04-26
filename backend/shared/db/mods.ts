import type { Insertable, Selectable } from "kysely";
import type {
  AdmSucursal,
  InvDispatch,
  InvDispatchbase,
  InvDispatchbaseItem,
  InvDispatchItem,
  InvEquivalence,
  InvPurchase,
  InvPurchaseItem,
  InvStock,
} from "./generated.ts";

export type AdmSucursalSelect = Selectable<AdmSucursal>;
export type InvEquivalenceSelect = Selectable<InvEquivalence>;

export type InvStockInsert = Insertable<InvStock>;
export type InvStockSelect = Selectable<InvStock>;
export interface InvStockSelectOptionalId extends Omit<InvStockSelect, "id"> {
  id?: number;
}

export type InvDispatchBaseSelect = Selectable<InvDispatchbase>;
export type InvDispatchBaseItemSelect = Selectable<InvDispatchbaseItem>;

export type InvDispatchSelect = Selectable<InvDispatch>;
export type InvDispatchInsert = Insertable<InvDispatch>;

export type InvDispatchItemSelect = Selectable<InvDispatchItem>;
export type InvDispatchItemInsert = Insertable<InvDispatchItem>;

export type InvPurchaseSelect = Selectable<InvPurchase>;
export type InvPurchaseItemSelect = Selectable<InvPurchaseItem>;
