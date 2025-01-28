import { db } from "#app/database.ts";
import { users } from "@scope/pizzadb";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export async function ValidateUser(id: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      role: true,
    },
  });

  if (!user)
    throw new HTTPException(400, {
      message: "El usuario no fue encontrado",
    });
  if (user.status == 0)
    throw new HTTPException(400, {
      message: "El usuario no esta activo",
    });

  return {
    userId: user.id,
    userName: user.name,
    mail: user.email,
    roleId: user.role_id,
    roleName: user.role.role,
    views: [],
    modules: [],
    parameters: {},
  } as {
    userId: number;
    userName: string;
    mail: string;
    roleId: number;
    roleName: string;
    views: string[];
    modules: number[];
    parameters: Record<string, string>;
  };
}
