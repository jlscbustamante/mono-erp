import { get_authorized_user } from "#app/modules/payment/queries/get_authorized_users.ts";

export const check_authorized_user = (
  user: string,
  password: string
): Promise<boolean> => {
  const users = get_authorized_user();

  const userFound = users.find(
    (el) =>
      el.name.toLowerCase() === user.toLowerCase() &&
      el.password.toLowerCase() === password.toLowerCase()
  );

  return Promise.resolve(!!userFound);
};
