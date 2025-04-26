import { db } from "#app/config/database.ts";
import {
  DISPATCH_MOVE_TYPE,
  InvDispatchInsert,
  InvDispatchItemInsert,
} from "@scope/shared";

export const create_dispatch = async ({
  dispatch,
  items,
  username,
}: {
  dispatch: InvDispatchInsert;
  items: InvDispatchItemInsert[];
  username: string;
}) => {
  await db.transaction().execute(async (trx) => {
    const total = items.reduce(
      (acc, el) => acc + (el.total_value ? +el.total_value : 0),
      0
    );
    const result = await trx
      .insertInto("inv_dispatch")
      .values({
        ...dispatch,
        gloss: dispatch.gloss ?? "",
        move_type: DISPATCH_MOVE_TYPE.WAREHOUSE_TO_STORE,
        net_value: total,
        total_value: total,
        created_by: username,
      })
      .execute();
    const insert_id = result[0].insertId;
    if (!insert_id) throw new Error("No se pudo crear el despacho");
    await trx
      .insertInto("inv_dispatch_item")
      .values(items.map((el) => ({ ...el, dispatch_id: Number(insert_id) })))
      .execute();
  });
};
