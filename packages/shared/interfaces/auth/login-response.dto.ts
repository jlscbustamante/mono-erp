export interface LoginResponse {
  needPassword?: boolean;
  needValidate?: boolean;
  token: string;
}
