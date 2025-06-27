import { db } from "#app/database.ts";
import { IListaInsumo } from "@scope/shared";
import { Hono } from "hono";
import {
  inv_recipe,
  inv_recipe_mix,
} from "../../../pizzadb/schemas/recipe/recipe.ts";
//import { IListaInsumo } from "./backend/shared/modules/recetas/index.ts";
/*import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
*/

export const recipeRouter = new Hono()
  .get("/filter/insumos", async (c) => {
    /*
  const queryExecuted = await db.execute("select Now() as fecha");

  const result = queryExecuted[0] as unknown as { fecha: string }[];
  console.log("res : ", result);
  return c.json({ data: result, message: "ok" });
  */

    //resultado con data, cero es la fila con datos
    //const result = queryExecuted[0] as unknown as IListaInsumo[];

    const param1 = c.req.query("needle");
    const param2 = c.req.query("cat_selected");
    const queryUnion = `select 
imp.id as item_id
, imp.product as item_name
, imc.id as category_id
, imc.category as category_name
, imp.id as product_id
, imp.product as product_name
, imp.recipe_req
, null as recollect_id
, null as collection_name
from inv_menu_product imp
inner join inv_menu_items imi
on imp.id = imi.product_id
inner join inv_menu_category imc
on imi.category_id = imc.id
where imp.product like '%${param1}%'
and imi.category_id=ifnull(${param2},imi.category_id)
union
select 
 irc.id as item_id
, irc.collection as item_name
, null as category_id
, null as category_name
, null as product_id
, null as product_name
, null as recipe_req
, irc.id as recollect_id
, irc.collection _name
from inv_recollection irc
where irc.collection like '%${param1}%'
union
select 
ii.id as item_id
, ii.item_name
, null as category_id
, null as category_name
, null as product_id
, null as product_name
, null as recipe_req
, null as recollect_id
, null as collection_name
from inv_item ii 
where ii.item_name like '%${param1}%'
union 
select 
ii.id as item_id
, ii.item_name
, imc.id as category_id
, imc.category as category_name
, imp.id as product_id
, imp.product as product
, null as recipe_req
, null as recollect_id
, null as collection_name
from inv_productitem ipi
inner join inv_item ii
on ipi.item_id=ii.id
inner join inv_menu_product imp
on imp.id = ipi.product_id
inner join inv_menu_items imi
on imp.id = imi.product_id
inner join inv_menu_category imc
on imi.category_id = imc.id
where imp.product like '%${param1}%'
and imi.category_id=ifnull(${param2},imi.category_id);`;

    //const queryFecha = "select Now() as fecha";
    const queryExecuted = await db.execute(queryUnion);

    const result = queryExecuted[0] as unknown as IListaInsumo[];
    console.log("res : ", result);
    return c.json({ data: result, message: "ok" });
  })
  .get("/items", async (c) => {
    const param1 =
      c.req.query("product_id") == undefined ? null : c.req.query("product_id");
    const param2 =
      c.req.query("recipe_req") == undefined ? null : c.req.query("recipe_req");
    const param3 =
      c.req.query("recollection_id") == undefined
        ? null
        : c.req.query("recollection_id");

    const queryUnion = `select 
imp.id as product_id
,imp.product
,imp.recipe_req
, imi.category_id, icat.category, ir.id as recipe_id
, irecoll.id as recollection_id 
, irecoll.collection 
, ii.id as item_id, ii.item_name
, irm.quantity
, irm.measure_id
, im.measure
, irm.presentation_id
, ip.presentation
 from inv_menu_product imp 
left join inv_menu_items imi
on imp.id = imi.product_id
inner join inv_recipe ir
on imi.id = ir.menu_item_id
left join inv_recipe_mix irm
on ir.id = irm.recipe_id
left join inv_item ii
on irm.item_id=ii.id
left join inv_category icat
on imi.category_id=icat.id
left join inv_recollection irecoll
on irm.recollection_id = irecoll.id
left join inv_presentation ip
on irm.presentation_id = ip.id
left join inv_measure im
on irm.measure_id = im.id
where imp.id=ifnull(${param1},imp.id)
and imp.recipe_req=ifnull(${param2},imp.recipe_req)
and irecoll.id=ifnull(${param3},irecoll.id);

`;
    const queryExecuted = await db.execute(queryUnion);

    const result = queryExecuted[0]; //as unknown as InvRecipeMix[];
    console.log("res : ", result);
    return c.json({ data: result, message: "ok" });
  })
  .post("/nueva", async (c) => {
    const param1 = 9; //c.req.query("item_id");
    const data = await c.req.json();
    console.log("nueva receta");
    console.log("Data en post");
    console.log(data);
    //insert para nueva receta
    //const insertR = `insert into inv_recipe(company_id,recipe,menu_item_id,save_tag) values(?,?,?,?)`;

    const result = await db.insert(inv_recipe).values(data).$returningId();

    console.log("res : ", result);
    return c.json({ data: result, message: "ok" });
  })
  .post("/nueva-detalle", async (c) => {
    const data = await c.req.json();
    console.log("Detalle nueva receta");
    console.log("Data en post");
    console.log(data);
    //insert para nueva receta
    //const insertR = `insert into inv_recipe(company_id,recipe,menu_item_id,save_tag) values(?,?,?,?)`;

    const result = await db.insert(inv_recipe_mix).values(data).$returningId();

    console.log("res : ", result);
    return c.json({ data: result, message: "ok" });
  })
  .post("/nueva-coleccion", async (c) => {
    const data = await c.req.json();
    console.log("Cabecera nueva coleccion");
    console.log("Data en post");
    console.log(data);
    //insert para nueva receta
    //const insertR = `insert into inv_recipe(company_id,recipe,menu_item_id,save_tag) values(?,?,?,?)`;

    const result = await db.insert(inv_recipe_mix).values(data).$returningId();

    console.log("res : ", result);
    return c.json({ data: result, message: "ok" });
  })
  .post("/nueva-coleccion-detalle", async (c) => {
    const data = await c.req.json();
    console.log("Detalle nueva receta");
    console.log("Data en post");
    console.log(data);
    //insert para nueva receta
    //const insertR = `insert into inv_recipe(company_id,recipe,menu_item_id,save_tag) values(?,?,?,?)`;

    const result = await db.insert(inv_recipe_mix).values(data).$returningId();

    console.log("res : ", result);
    return c.json({ data: result, message: "ok" });
  });
