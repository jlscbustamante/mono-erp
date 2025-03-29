import type { Insertable, Selectable } from "kysely";
import type { AdmSucursal, InvEquivalence, InvStock } from "./generated.ts";

export type AdmSucursalSelect = Selectable<AdmSucursal>;
export type InvEquivalenceSelect = Selectable<InvEquivalence>;

export type InvStockInsert = Insertable<InvStock>;
export type InvStockSelect = Selectable<InvStock>;
