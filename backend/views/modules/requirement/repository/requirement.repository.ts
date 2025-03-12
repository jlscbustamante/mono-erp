import { db } from "#app/database.ts";
import { RequirementDetail } from "#app/modules/requirement/entities/requirement-detail.entity.ts";
import { UpdateTransferRequirementDto } from "#app/modules/requirement/interfaces/update-requirement.dto.ts";
import {
  CreateRequirementDto,
  REQUIREMENT_STATUS,
  UpdateRequirementDto,
} from "#app/modules/types/index.ts";
import { requirementItems, requirements } from "@scope/pizzadb";
import { transformWhere } from "@scope/pizzadb/filter";
import type {
  RequirementInsert,
  RequirementItemInsert,
  RequirementSelect,
  WhereOption,
} from "@scope/pizzadb/types";
import dayjs from "dayjs";
import { eq, sql } from "drizzle-orm";
import { RequirementPresentation } from "../entities/requirement-presentation.entity.ts";

export class RequirementRepository {
  async filter(
    filters: WhereOption<RequirementSelect>[]
  ): Promise<RequirementPresentation[]> {
    const query = transformWhere(filters).join(" AND ");

    const result = await db.query.requirements.findMany({
      where: query ? sql.raw(query) : undefined,
      with: {
        items: true,
        supplier: true,
      },
      limit: 500,
    });

    return result.map((el) => {
      const { items, supplier, ...reqitem } = el;
      return new RequirementPresentation({
        reqitem,
        items,
        inv_supplier: supplier ?? undefined,
      });
    });
  }

  async filterCountByType(
    filters: WhereOption<RequirementSelect>[],
    month?: number
  ) {
    let allowFilters = filters.filter((el) => el.field !== "request_type");
    if (month) {
      allowFilters = allowFilters.filter((el) => el.field !== "requested_at");
      allowFilters.push({
        field: "requested_at",
        key: "requested_at",
        operator: "equal",
        value: month,
        useMods: true,
        mods: {
          field: "MONTH",
        },
      });
    }
    const query = transformWhere(allowFilters).join(" AND ");

    const [result] = await db.execute(
      `SELECT request_type type,COUNT(*) count FROM adm_request ${
        allowFilters.length > 0 ? `WHERE ${query}` : ""
      } GROUP BY request_type`
    );

    return result;
  }

  async saveAndApprove(data: UpdateRequirementDto) {
    await db.transaction(async (manager) => {
      await manager
        .update(requirements)
        .set({
          company_id: data.companyId,
          supplier_id: data.supplierId,
          legal_name: data.supplierName,
          legal_number: data.ruc,
          description: data.description,
          type_document: data.documentType,
          num_document: data.documentNumber,
          movecash_id: data.categoryId,
          movecash_name: data.categoryName,
          amount: data.amount,
          pay_method: data.paymentMethod,
        })
        .where(eq(requirements.id, data.id));

      const promises = [];
      for (const item of data.items) {
        promises.push(
          manager
            .update(requirementItems)
            .set({
              amount: item.amount,
              retention: item.hasRetention ? "1" : "0",
              amount_ret: item.retention,
              amount_net: item.amount - item.retention,
              cashbank_id: item.cashbankId,
              cashbank_name: item.cashbankName,
              description: item.description,
            })
            .where(eq(requirementItems.id, item.id))
        );
      }
      await Promise.all(promises);
    });
  }

  async approve(id: number, userName: string) {
    await db.transaction(async (manager) => {
      await manager
        .update(requirements)
        .set({
          status: REQUIREMENT_STATUS.APPROVED,
        })
        .where(eq(requirements.id, id));
      await manager
        .update(requirementItems)
        .set({
          status: REQUIREMENT_STATUS.APPROVED,
          approved_by: userName,
          approved_at: dayjs().format("YYYY-MM-DD"),
        })
        .where(eq(requirementItems.request_id, id));
    });
  }

  async saveRequirement(data: UpdateRequirementDto) {
    await db.transaction(async (manager) => {
      await manager
        .update(requirements)
        .set({
          company_id: data.companyId,
          supplier_id: data.supplierId,
          legal_name: data.supplierName,
          legal_number: data.ruc,
          description: data.description,
          type_document: data.documentType,
          num_document: data.documentNumber,
          movecash_id: data.categoryId,
          movecash_name: data.categoryName,
          amount: data.amount,
          pay_method: data.paymentMethod,
        })
        .where(eq(requirements.id, data.id));

      const promises = [];
      for (const item of data.items) {
        promises.push(
          manager
            .update(requirementItems)
            .set({
              amount: item.amount,
              retention: item.hasRetention ? "1" : "0",
              amount_ret: item.retention,
              amount_net: item.amount - item.retention,
              cashbank_id: item.cashbankId,
              cashbank_name: item.cashbankName,
              description: item.description,
            })
            .where(eq(requirementItems.id, item.id))
        );
      }
      await Promise.all(promises);
    });
  }

  async saveTransferRequirement(data: UpdateTransferRequirementDto) {
    await db.transaction(async (manager) => {
      await manager
        .update(requirements)
        .set({
          company_id: data.companyId,
          description: data.description,
          type_document: data.documentType,
          num_document: data.documentNumber,
          amount: data.amount,
        })
        .where(eq(requirements.id, data.id));
      await Promise.all([
        manager
          .update(requirementItems)
          .set({
            amount: data.amount,
            cashbank_id: data.cash_origin_id,
            cashbank_name: data.cash_origin_name,
          })
          .where(eq(requirementItems.id, data.origin_id)),
        manager
          .update(requirementItems)
          .set({
            amount: data.amount,
            cashbank_id: data.cash_destiny_id,
            cashbank_name: data.cash_destiny_name,
            expires_at: data.expiration_date ?? null,
          })
          .where(eq(requirementItems.id, data.destiny_id)),
      ]);
    });
  }

  async getRequirement(id: number) {
    const result = await db.query.requirements.findFirst({
      where: eq(requirements.id, id),
      with: {
        items: {
          with: {
            cashbank: true,
          },
        },
        supplier: true,
      },
    });

    if (!result) throw new Error("Requerimiento no encontrado");

    const { supplier, items, ...requirement } = result;
    return new RequirementDetail({
      requirement,
      items,
      supplier: supplier ?? undefined,
    });
  }

  async createRequirement(data: CreateRequirementDto, name: string) {
    const requirement: RequirementInsert = {
      status: REQUIREMENT_STATUS.PENDING,
      amount: data.amount,
      request_type: data.request_type,
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
    const initialExpiresAt = data.quota == 1 ? data.expiration_date : null;
    for (const quotaDetail of data.detailQuotas) {
      items.push({
        request_id: 0,
        description: "",
        cashbank_id: data.cashbank,
        cashbank_name: data.cashbank_name,
        amount: -1 * quotaDetail.amount,
        created_by: name,
        status: REQUIREMENT_STATUS.PENDING,
        expires_at: initialExpiresAt ?? quotaDetail.expiresAt,
        retention: data.hasRetention ? "1" : "2",
        amount_net: (data.hasRetention ? data.amount - data.retention : 0) * -1,
        amount_ret: (data.hasRetention ? data.retention : 0) * -1,
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
