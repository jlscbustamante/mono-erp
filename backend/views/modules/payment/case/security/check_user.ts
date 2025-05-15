export const check_user = (
  user: string,
  password: string
): Promise<boolean> => {
  if (
    user.toLowerCase() === "Gerson".toLowerCase() &&
    password.toLowerCase() === "123456".toLowerCase()
  ) {
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};
