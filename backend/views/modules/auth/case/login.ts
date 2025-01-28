import { db } from "#app/database.ts";
import { users } from "@scope/pizzadb";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export const login = async (email: string, password: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) throw new HTTPException(400, { message: "El usuario no existe" });
  if (user.status == 0)
    throw new HTTPException(400, { message: "El usuario no esta activo" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new HTTPException(400, { message: "La contraseña es incorrecta" });
  }
};
