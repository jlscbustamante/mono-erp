import { IMockAuthorizedUser } from "@scope/shared";

export const AUTHORIZED_USERS: { get: IMockAuthorizedUser[] } = {
  get: [
    {
      id: 1,
      name: "Gerson Berrocal",
      phone: "932250406",
      email: "gersonberrocaln@gmail.com",
      password: "123456",
    },
    {
      id: 2,
      name: "Usuario 2",
      phone: "987654321",
      email: "usuario2@gmail.com",
      password: "123456",
    },
  ],
};
