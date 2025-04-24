import { db } from "#app/config/database.ts";

export const generate_payment = async (order_id: number) => {
  const order = await db
    .selectFrom("adm_payment_order")
    .selectAll()
    .where("id", "=", order_id)
    .executeTakeFirstOrThrow();
  const requirements = await db
    .selectFrom("adm_requirement")
    .selectAll()
    .where("payment_order_id", "=", order_id)
    .execute();

  const relative_path_bcp = "./../../bcp";
  const placeholder_bank_file = `xxxxx-4444 USUSARIO NOMBRE 3143.33\nxxxxx-4444 USUSARI2 NOMBRE 1543.12`;
  await Deno.writeTextFile(
    `${relative_path_bcp}/files/bcp.txt`,
    placeholder_bank_file
  );

  // Ejecutar main.js con Node.js y esperar la respuesta
  const command = new Deno.Command("node", {
    args: [`${relative_path_bcp}/main.js`],
    stdout: "piped",
    stderr: "piped",
  });

  const { stdout, stderr, success } = await command.output();

  if (!success) {
    const errorOutput = new TextDecoder().decode(stderr);
    console.error("Error al ejecutar main.js con Node:", errorOutput);
    throw new Error(`Fallo al ejecutar main.js: ${errorOutput}`);
  }

  const output = new TextDecoder().decode(stdout).trim();
  if (output !== "ok") {
    throw new Error(
      `La ejecución de main.js no retornó 'ok'. Resultado: ${output}`
    );
  }

  console.log("Main.js ejecutado exitosamente con Node");

  return {
    order,
    requirements,
  };
};
