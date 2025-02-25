import {
  CategorySelect,
  ItemSelect,
  itemTable,
  PresentationSelect,
  templates,
} from "@scope/pizzadb";
import { and, eq, inArray } from "drizzle-orm";
import { cache } from "../cache/index.ts";
import { db } from "../database.ts";

export interface ItemSelectRelations extends ItemSelect {
  presentation: PresentationSelect;
  product: {
    category: CategorySelect;
  };
}

export class TemplateRepository {
  async getTemplate(company: string = "PIZZA"): Promise<ItemSelectRelations[]> {
    const cached = cache.get("template:" + company);
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

    cache.set("template:" + company, JSON.stringify(items));

    return items;
  }
}
