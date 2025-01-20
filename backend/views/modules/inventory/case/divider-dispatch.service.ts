import {
  dispatches,
  dispatchesItems,
  type DispatchInsert,
  type DispatchItemInsert,
  type DispatchItemSelect,
} from "@scope/pizzadb";
import { and, eq, inArray } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db } from "../../../database.ts";

export class DividerDispatchService {
  private readonly pathJson: string;
  private readonly defaultStore: string = "CORAL";
  constructor() {
    this.pathJson = Deno.cwd() + "/files/relation-divider.json";
  }

  async readRelation(): Promise<{ data: Record<string, string> }> {
    try {
      const text = await Deno.readTextFile(this.pathJson);
      return JSON.parse(text);
    } catch (err: any) {
      if (err.code == "ENOENT")
        throw new HTTPException(400, {
          message: "No se encontro una relacion",
        });
      throw err;
    }
  }

  async writeRelation(data: Record<string, string>) {
    await Deno.writeTextFile(this.pathJson, JSON.stringify({ data }));
  }

  async execute(ids: number[]) {
    if (ids.length == 0)
      throw new HTTPException(400, { message: "No se encontro el despacho" });

    const relation = await this.readRelation();
    const retrievedDispatches = await db.query.dispatches.findMany({
      where: and(
        inArray(dispatches.id, ids),
        inArray(dispatches.status, [1, 2, 3]),
        eq(dispatches.move_type, "D")
      ),
      with: {
        items: true,
      },
    });

    const updateCode: { code: string; id: number }[] = [];
    const insertData: {
      dispatch: DispatchInsert;
      items: DispatchItemInsert[];
    }[] = [];

    for (const dispatch of retrievedDispatches) {
      const record: Record<string, DispatchItemSelect[]> = {};
      for (const item of dispatch.items) {
        const storeCode = relation.data[item.item_id];
        if (storeCode) {
          if (!record[storeCode]) record[storeCode] = [];
          record[storeCode].push(item);
        } else {
          if (!record[this.defaultStore]) record[this.defaultStore] = [];
          record[this.defaultStore].push(item);
        }
      }
      const keysLen = Object.keys(record).length;
      if (keysLen == 0) {
        throw new HTTPException(400, {
          message: `El despacho ${dispatch.id} no tiene items`,
        });
      } else if (keysLen == 1) {
        const code = Object.keys(record)[0];
        if (dispatch.sucursal_from_id != code) {
          updateCode.push({
            code,
            id: dispatch.id,
          });
        }
      } else {
        const codes = Object.keys(record);
        const { items: _item, ...originalDispatch } = dispatch;
        for (const code of codes) {
          const total = record[code].reduce(
            (acc, el) => acc + el.total_value,
            0
          );
          const itemsToInsert: DispatchItemInsert[] = record[code].map(
            (el) => ({ ...el, id: undefined })
          );
          insertData.push({
            dispatch: {
              ...originalDispatch,
              sucursal_from_id: code,
              gloss: originalDispatch.gloss
                ? originalDispatch.gloss + ` (${code})`
                : `(${code})`,
              total_value: total,
              net_value: total,
            },
            items: itemsToInsert,
          });
        }
      }
    }

    await db.transaction(async (tx) => {
      const promisesUpdate = [];
      for (const { code, id } of updateCode) {
        promisesUpdate.push(
          tx
            .update(dispatches)
            .set({ sucursal_from_id: code })
            .where(eq(dispatches.id, id))
        );
      }
      await Promise.all(promisesUpdate);

      const insertedId = insertData
        .map((el) => el.dispatch.id)
        .filter((el) => el) as number[];

      if (insertedId.length > 0) {
        await tx
          .delete(dispatchesItems)
          .where(inArray(dispatchesItems.dispatch_id, insertedId));
        await tx.delete(dispatches).where(inArray(dispatches.id, insertedId));
      }

      for (const { dispatch, items } of insertData) {
        const [result] = await tx
          .insert(dispatches)
          .values({ ...dispatch, id: undefined });
        const resultId = result.insertId;
        await tx.insert(dispatchesItems).values(
          items.map((el) => ({
            ...el,
            dispatch_id: resultId,
          }))
        );
      }
    });
  }
}
