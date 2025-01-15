export interface Session {
  id: number;
  name: string;
  mail: string;
  rol_id: number;
}

export interface SessionResponse {
  user: Session;
  token: string;
}

export interface LoginResponse {
  needVerifyEmail: boolean;
  otpToken: string;
}
