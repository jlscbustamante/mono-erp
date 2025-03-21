import { db } from "#app/database.ts";
import { IRelatedRequirement } from "#app/modules/requirement/interfaces/related-requirements.interface.ts";
import {
  SummaryBox,
  SummaryItem,
} from "#app/modules/requirement/interfaces/summary-box.dto.ts";
import { UpdateTransferRequirementDto } from "#app/modules/requirement/interfaces/update-requirement.dto.ts";
import { RequirementRepository } from "#app/modules/requirement/repository/requirement.repository.ts";
import {
  CreateRequirementDto,
  CreateRequirementTransferDto,
  REQUIERMENT_TYPE,
  REQUIREMENT_STATUS,
  UpdateRequirementDto,
} from "#app/modules/types/index.ts";
import { requirementItems, requirements } from "@scope/pizzadb";
import type {
  RequirementInsert,
  RequirementItemInsert,
  RequirementRelationsSelect,
  RequirementSelect,
  WhereOption,
} from "@scope/pizzadb/types";
import { format } from "date-fns";
import { and, eq, inArray, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { transformWhere } from "../../../pizzadb/filter/transform.ts";

export class RequirementService {
  constructor(private readonly requirementRepository: RequirementRepository) {}

  async filter(filters: WhereOption<RequirementSelect>[]) {
    const data = await this.requirementRepository.filter(filters);
    return data;
  }

  async filterCount(filters: WhereOption<RequirementSelect>[], month?: number) {
    const data = await this.requirementRepository.filterCountByType(
      filters,
      month
    );
    return data;
  }

  async createRequirement(data: CreateRequirementDto, name: string) {
    await this.requirementRepository.createRequirement(data, name);
  }

  async getRequirement(id: number) {
    return await this.requirementRepository.getRequirement(id);
  }

  async saveAndApprove(data: UpdateRequirementDto, userName: string) {
    await this.requirementRepository.saveAndApprove(data, userName);
  }

  async approve(id: number, userName: string) {
    await this.requirementRepository.approve(id, userName);
  }

  async saveRequirement(data: UpdateRequirementDto) {
    await this.requirementRepository.saveRequirement(data);
  }

  async saveTransferRequirement(data: UpdateTransferRequirementDto) {
    await this.requirementRepository.saveTransferRequirement(data);
  }

  async undoApproval(id: number) {
    await db.transaction(async (manager) => {
      await manager
        .update(requirements)
        .set({
          status: REQUIREMENT_STATUS.PENDING,
        })
        .where(eq(requirements.id, id));
      await manager
        .update(requirementItems)
        .set({
          status: REQUIREMENT_STATUS.PENDING,
        })
        .where(eq(requirementItems.request_id, id));
    });
  }

  async getRelatedRequirements(
    requirementId: number
  ): Promise<IRelatedRequirement[]> {
    const requirementItem = await db
      .select()
      .from(requirements)
      .leftJoin(
        requirementItems,
        eq(requirements.id, requirementItems.request_id)
      )
      .where(
        and(
          eq(requirements.id, requirementId),
          eq(requirementItems.status, REQUIREMENT_STATUS.PENDING)
        )
      );

    return requirementItem
      .map((el) => {
        if (!el.adm_request_item || !el.adm_request) return null;
        return {
          id: el.adm_request_item.id,
          quota: el.adm_request.nro_quotas ?? 1,
          value: el.adm_request_item.amount ?? 0,
          description: el.adm_request_item.description ?? "",
          status: el.adm_request_item.status as REQUIREMENT_STATUS,
        } satisfies IRelatedRequirement;
      })
      .filter((el) => el) as IRelatedRequirement[];
  }

  async rejectRequirements(ids: number[]) {
    const first = await db.query.requirementItems.findFirst({
      where: eq(requirementItems.id, ids[0]),
    });
    if (!first) {
      throw new HTTPException(400, {
        message: "No se encontraron requerimientos",
      });
    }
    const requirement = await db.query.requirements.findFirst({
      where: eq(requirements.id, first.request_id),
      with: {
        items: true,
      },
    });
    if (!requirement) {
      throw new HTTPException(400, {
        message: "No se encontraron requerimientos",
      });
    }
    await db.transaction(async (manager) => {
      await manager
        .update(requirementItems)
        .set({
          status: REQUIREMENT_STATUS.CANCELLED,
        })
        .where(inArray(requirementItems.id, ids));

      if (
        requirement.items.filter(
          (el) => el.status == REQUIREMENT_STATUS.PENDING
        ).length === ids.length
      ) {
        await manager
          .update(requirements)
          .set({
            status: REQUIREMENT_STATUS.CANCELLED,
          })
          .where(eq(requirements.id, first.request_id));
      }
    });
  }

  async requirementAmountsMont(
    month: string,
    status: REQUIREMENT_STATUS[],
    filters?: WhereOption<RequirementSelect>[]
  ) {
    const statusQuery = status.map((el) => `"${el}"`).join(",");
    const fieldName = "requested_at";
    const query = filters
      ? transformWhere<RequirementSelect>(filters, "ari").join(" AND ")
      : "";
    const [result] =
      await db.execute(`SELECT ari.${fieldName} date,SUM(ari.amount) total FROM adm_request ari
WHERE ari.status IN (${statusQuery}) AND MONTH(ari.${fieldName})=${month} ${
        query ? `AND ${query}` : ""
      } GROUP BY DAY(ari.${fieldName})`);

    return (result as any).map((el: any) => {
      return {
        date: el.date.split(" ")[0],
        total: Number(el.total),
      };
    });
  }

  async createTransfer(data: CreateRequirementTransferDto, name: string) {
    const newRequiremnt: RequirementInsert = {
      created_by: name,
      requested_at: format(new Date(), "yyyy-MM-dd"),
      description: data.description,
      amount: data.amount,
      status: REQUIREMENT_STATUS.PENDING,
      pay_method: data.payment_method,
      type_document: data.document_type,
      num_document: data.document_number,
      request_type: REQUIERMENT_TYPE.TRANSFER,
    };

    const newRequirementItemOrigin: RequirementItemInsert = {
      request_id: 0,
      expires_at: data.expiration_date,
      amount: data.amount * -1,
      cashbank_id: data.cashbank_origin,
      cashbank_name: data.cashbank_origin_name,
    };

    const newRequirementItemDestiny: RequirementItemInsert = {
      request_id: 0,
      expires_at: data.expiration_date,
      amount: data.amount,
      cashbank_id: data.cashbank_destiny,
      cashbank_name: data.cashbank_destiny_name,
    };

    await db.transaction(async (manager) => {
      const [result] = await manager.insert(requirements).values(newRequiremnt);
      const resultId = result.insertId;
      await manager.insert(requirementItems).values([
        {
          ...newRequirementItemOrigin,
          request_id: resultId,
        },
        {
          ...newRequirementItemDestiny,
          request_id: resultId,
        },
      ]);
    });
  }

  async getDetailedReport(
    date: string,
    cashAccountId: number
  ): Promise<RequirementRelationsSelect[]> {
    const [result] = (await db.execute(
      `SELECT ari.request_id FROM adm_request_item ari left join adm_request ar ON ar.id=ari.request_id  WHERE cashbank_id=${cashAccountId} AND DATE(ar.requested_at)="${date}"`
    )) as unknown as [{ request_id: number }[]];
    const ids = result.map((el) => el.request_id);
    if (ids.length === 0) return [];
    const listRequirements = await db.query.requirements.findMany({
      where: inArray(requirements.id, ids),
      with: {
        items: true,
      },
    });
    return listRequirements;
  }
  async getInitialBalance(cashId: number, date: string) {
    const elments = await db.query.requirementItems.findMany({
      columns: {
        amount: true,
      },
      where: and(
        eq(requirementItems.cashbank_id, cashId),
        sql.raw(`DATE(requested_at) < "${date}"`)
      ),
    });
    const total = elments.reduce((acc, el) => acc + el.amount, 0);
    return total * -1;
  }

  async getSupplierCurrentAccount(filters: WhereOption<RequirementSelect>[]) {
    const query = transformWhere(filters).join(" AND ");

    const result = await db.query.requirements.findMany({
      where: query ? sql.raw(query) : undefined,
      with: {
        items: true,
        supplier: true,
      },
    });

    return result;
  }

  async resumeCashBox(cashId: number, date: string): Promise<SummaryBox> {
    const initial = await this.getInitialBalance(cashId, date);
    const [result] = (await db.execute(
      `SELECT ari.request_id FROM adm_request_item ari left join adm_request ar ON ar.id=ari.request_id  WHERE cashbank_id=${cashId} AND DATE(ar.requested_at)="${date}" AND ar.status IN ("${REQUIREMENT_STATUS.APPROVED}","${REQUIREMENT_STATUS.PAID}")`
    )) as unknown as [{ request_id: number }[]];
    const ids = result.map((el) => el.request_id);
    if (ids.length === 0) {
      return {
        initial,
        list: [],
        final: initial,
      };
    }

    const listRequirements = await db.query.requirements.findMany({
      where: inArray(requirements.id, ids),
      with: {
        items: true,
      },
    });

    const record: Record<string, SummaryItem> = {};
    for (const req of listRequirements) {
      if (req.request_type == REQUIERMENT_TYPE.TRANSFER) {
        const otherCash = req.items.find((el) => el.cashbank_id != cashId);
        if (!otherCash || !otherCash.cashbank_name)
          throw new HTTPException(400, {
            message: "ERROR_DATA. Transferencia",
          });
        if (!record[otherCash.cashbank_name])
          record[otherCash.cashbank_name] = {
            title: otherCash.cashbank_name,
            total: 0,
          };
        record[otherCash.cashbank_name].total = otherCash.amount;
      } else {
        const category = req.movecash_name
          ? req.movecash_name
          : "SIN CATEGORIA";
        if (!record[category]) {
          record[category] = {
            title: category,
            total: 0,
          };
        }
        for (const item of req.items) {
          if (item.cashbank_id == cashId) {
            record[category].total += item.amount;
          }
        }
      }
    }
    const list = Object.values(record);
    const final = list.reduce((acc, el) => acc + el.total, initial);

    return {
      initial,
      list,
      final,
    };
  }
}
