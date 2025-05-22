import { db } from "#app/database.ts";
import { CreateCostCenterDto } from "#app/modules/requirement/interfaces/create-costcenter.dto.ts";
import {
  cashBanks,
  costCenters,
  finMoveCash,
  storeTable,
  suppliers,
} from "@scope/pizzadb";
import { asc, eq } from "drizzle-orm";
import {
  CostCenterSelecet,
  MoveCashInsert,
  MoveCashSelect,
} from "../../../pizzadb/types/index.ts";

export class RequirementResourceService {
  async companies() {
    const data = await db.query.companies.findMany({});
    return data;
  }

  async costCenter() {
    const data = await db.query.costCenters.findMany({
      orderBy: asc(costCenters.costcenter),
    });
    return data;
  }

  async createCostCenter(data: CreateCostCenterDto) {
    await db.insert(costCenters).values({
      costcenter: data.costcenter,
      company_id: data.company_id,
      type_cc: data.type_cc,
      sucursal_id: data.sucursal_id,
      account_link1: data.account_link1,
      account_link2: data.account_link2,
      account_link3: data.account_link3,
      status: data.status,
    });
  }

  async updateCostCenter(data: CostCenterSelecet) {
    await db
      .update(costCenters)
      .set({
        costcenter: data.costcenter,
        company_id: data.company_id,
        type_cc: data.type_cc,
        sucursal_id: data.sucursal_id,
        account_link1: data.account_link1,
        account_link2: data.account_link2,
        account_link3: data.account_link3,
        status: data.status,
      })
      .where(eq(costCenters.id, data.id));
  }

  async updateCategory(data: MoveCashSelect) {
    await db
      .update(finMoveCash)
      .set({
        movetype: data.movetype,
        account_id: data.account_id,
        used_to: data.used_to,
        origin_from: data.origin_from,
        cash_flow: data.cash_flow,
        account_flow: data.account_flow,
        status: data.status,
      })
      .where(eq(finMoveCash.id, data.id));
  }

  async createCategory(data: MoveCashInsert) {
    await db.insert(finMoveCash).values(data);
  }

  async cashBank() {
    const data = await db.query.cashBanks.findMany({
      orderBy: asc(cashBanks.cashbank),
    });

    return data;
  }

  async suppliers() {
    const data = await db.query.suppliers.findMany({
      orderBy: asc(suppliers.supplier),
    });
    return data;
  }

  async movesCash() {
    const data = await db.query.finMoveCash.findMany({
      orderBy: asc(finMoveCash.movetype),
    });
    return data;
  }

  async stores() {
    const data = await db.query.storeTable.findMany({
      orderBy: asc(storeTable.title),
    });

    return data;
  }
}
