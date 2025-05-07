import { AUTHORIZED_USERS } from "#app/modules/payment/authorized_user_mock.ts";
import { ISelectMockAuthorizedUserDto } from "@scope/shared";

export const get_authorized_users = (): Promise<
  ISelectMockAuthorizedUserDto[]
> => {
  const list = AUTHORIZED_USERS.get.map((el) => {
    const { password: _password, ...rest } = el;
    return rest;
  });

  return Promise.resolve(list);
};
