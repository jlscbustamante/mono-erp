import { db } from "#app/database.ts";
import { RequirementDetail } from "#app/modules/requirement/entities/requirement-detail.entity.ts";
import { RequirementPresentation } from "#app/modules/requirement/entities/requirement-item.entity.ts";
import {
  CreateRequirementDto,
  REQUIREMENT_STATUS,
  UpdateRequirementDto,
} from "#app/modules/types/index.ts";
import { requirementItems, requirements, suppliers } from "@scope/pizzadb";
import { transformWhere } from "@scope/pizzadb/filter";
import type {
  RequirementInsert,
  RequirementItemInsert,
  RequirementItemSelect,
  RequirementSelect,
  SupplierSelect,
  WhereOption,
} from "@scope/pizzadb/types";
import dayjs from "dayjs";
import { aliasedTable, desc, eq, sql } from "drizzle-orm";

export class RequirementRepository {
  async filter(
    filters: WhereOption<RequirementItemSelect>[]
  ): Promise<RequirementPresentation[]> {
    const alias = aliasedTable(requirementItems, "reqitem");
    const query = transformWhere(filters, "reqitem").join(" AND ");

    const result = (await db
      .select()
      .from(alias)
      .leftJoin(requirements, eq(requirements.id, alias.request_id))
      .leftJoin(suppliers, eq(suppliers.id, requirements.supplier_id))
      .limit(500)
      .where(query ? sql.raw(query) : undefined)
      .orderBy(desc(alias.request_id))) as unknown as {
      reqitem: RequirementItemSelect;
      adm_request: RequirementSelect;
      inv_supplier: SupplierSelect;
    }[];

    return result.map((el) => new RequirementPresentation(el));
  }

  async saveAndApprove(data: UpdateRequirementDto, userName: string) {
    await db.transaction(async (manager) => {
      await manager
        .update(requirementItems)
        .set({
          cashbank_id: data.cashBankId,
          cashbank_name: data.cashBankName,
          expires_at: data.expiresAt,
          status: REQUIREMENT_STATUS.APPROVED,
          approved_by: userName,
          approved_at: dayjs().format("YYYY-MM-DD"),
          description: data.description,
        })
        .where(eq(requirementItems.id, data.id));
    });
  }

  async saveRequirement(data: UpdateRequirementDto, userName: string) {
    await db.transaction(async (manager) => {
      await manager
        .update(requirements)
        .set({
          description: data.globalDescription,
        })
        .where(eq(requirements.id, data.globalId));

      await manager
        .update(requirementItems)
        .set({
          cashbank_id: data.cashBankId,
          cashbank_name: data.cashBankName,
          expires_at: data.expiresAt,
          approved_by: userName,
          // approved_at: dayjs().format("YYYY-MM-DD"),
          description: data.description,
        })
        .where(eq(requirementItems.id, data.id));
    });
  }

  async getRequirement(id: number) {
    const result = (await db
      .select()
      .from(requirementItems)
      .where(eq(requirementItems.id, id))
      .leftJoin(requirements, eq(requirements.id, requirementItems.request_id))
      .leftJoin(suppliers, eq(suppliers.id, requirements.supplier_id))) as any;

    const req = result[0];
    if (!req) throw new Error("Requerimiento no encontrado");
    return new RequirementDetail({
      adm_request: req.adm_request,
      adm_request_item: req.adm_request_item,
      inv_supplier: req.inv_supplier,
    });
  }

  async createRequirement(data: CreateRequirementDto, name: string) {
    const requirement: RequirementInsert = {
      status: REQUIREMENT_STATUS.PENDING,
      amount: data.amount,
      company_id: data.company,
      supplier_id: data.supplier,
      legal_number: data.ruc,
      legal_name: data.legal_name,
      movecash_id: data.category_id,
      movecash_name: data.category_name,
      description: data.description,
      type_document: data.document_type,
      num_document: data.document_number,
      costcenter_id: data.cost_center,
      costcenter_name: data.cost_center_name,
      nro_quotas: data.quota,
      pay_method: data.payment_method,
      requested_at: dayjs().format("YYYY-MM-DD"),
      created_by: name,
    };
    const items: RequirementItemInsert[] = [];
    for (const quotaDetail of data.detailQuotas) {
      items.push({
        request_id: 0,
        description: "",
        cashbank_id: data.cashbank,
        cashbank_name: data.cashbank_name,
        amount: quotaDetail.amount,
        created_by: name,
        status: REQUIREMENT_STATUS.PENDING,
      });
    }

    await db.transaction(async (manager) => {
      const result = await manager.insert(requirements).values(requirement);
      const requirementId = result[0].insertId;
      await manager.insert(requirementItems).values(
        items.map((el) => ({
          ...el,
          request_id: requirementId,
          requested_at: requirement.requested_at,
        }))
      );
    });
  }

  async rejectRequirement(id: number) {
    //
  }
}
