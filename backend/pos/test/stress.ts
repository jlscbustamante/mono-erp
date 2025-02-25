import { sucursalTable } from "@scope/pizzadb";
import { and, eq } from "drizzle-orm";
import { db } from "../database.ts";

const url = `https://erpraul.com/api/xpos/inventario/info?warehouse=$store&end=2025-02-22&start=2025-02-22`;

const sucursales = await db.query.sucursalTable.findMany({
  where: and(
    eq(sucursalTable.type_sede, "T"),
    eq(sucursalTable.trademark_id, "PIZZARAUL")
  ),
});

const promises: Promise<Response>[] = [];
console.log("Starting");
const startTime = Date.now();
for (const sucursal of sucursales) {
  promises.push(fetch(url.replace("$store", sucursal.id)));
}

await Promise.all(promises);
const endTime = Date.now();
console.log(`Execution time: ${endTime - startTime} ms`);
console.log("Done");
