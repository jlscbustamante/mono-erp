import { db } from "#app/database.ts";
import { templates } from "@scope/pizzadb";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class TemplateService {
  async load() {
    // call redis
  }

  async getTemplate(sucursalType: string) {
    const template = await db.query.templates.findFirst({
      with: {
        items: true,
      },
      where: eq(templates.sucursal_type, sucursalType),
    });
    if (!template)
      throw new HTTPException(400, {
        message: "No se encontro el template",
      });

    return template;
  }
}
