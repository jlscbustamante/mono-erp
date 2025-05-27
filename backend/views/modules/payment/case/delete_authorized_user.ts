import { AUTHORIZED_USERS } from "#app/modules/payment/authorized_user_mock.ts";

export const delete_authorized_user = (id: number) => {
  AUTHORIZED_USERS.get = AUTHORIZED_USERS.get.filter((el) => el.id !== id);
};
