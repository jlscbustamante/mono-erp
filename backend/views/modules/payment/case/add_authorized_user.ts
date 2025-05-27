import { AUTHORIZED_USERS } from "#app/modules/payment/authorized_user_mock.ts";
import { ICreateMockAuthorizedUserDto } from "@scope/shared";
import { HTTPException } from "hono/http-exception";

export const add_authorized_user = (user: ICreateMockAuthorizedUserDto) => {
  if (AUTHORIZED_USERS.get.length >= 2) {
    throw new HTTPException(400, {
      message: "No se puede agregar más de 2 usuarios autorizados",
    });
  }
  AUTHORIZED_USERS.get.push({
    id: AUTHORIZED_USERS.get.length + 1,
    ...user,
  });
};
