import {
  CategorySelect,
  ItemSelect,
  itemTable,
  PresentationSelect,
  templates,
} from "@scope/pizzadb";
import { minutesToSeconds } from "date-fns";
import { and, eq, inArray } from "drizzle-orm";
import { redis } from "../cache/index.ts";
import { db } from "../database.ts";

export interface ItemSelectRelations extends ItemSelect {
  presentation: PresentationSelect;
  product: {
    category: CategorySelect;
  };
}

export class TemplateRepository {
  async getTemplate(
    company: string = "PIZZARAUL"
  ): Promise<ItemSelectRelations[]> {
    const cached = await redis.get("template:" + company);
    if (cached) return JSON.parse(cached);
    const templateDb = await db.query.templates.findFirst({
      columns: {
        id: true,
        sucursal_type: true,
      },
      where: and(
        eq(templates.sucursal_type, company),
        eq(templates.used_to, "D")
      ),
      with: {
        items: {
          columns: {
            item_stock_id: true,
          },
        },
      },
    });
    if (!templateDb) {
      return [];
    }
    const itemIds = templateDb.items.map((item) => item.item_stock_id);
    const uniqueItemIds = [...new Set(itemIds)];
    const items = await db.query.itemTable.findMany({
      where: inArray(itemTable.id, uniqueItemIds),
      with: {
        presentation: true,
        product: {
          with: {
            category: true,
          },
        },
      },
    });

    await redis.set(
      "template:" + company,
      JSON.stringify(items),
      "EX",
      minutesToSeconds(60 * 2)
    );

    return items;
  }
}
