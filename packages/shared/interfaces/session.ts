import { AppParameters } from "./parameters.interface";

export interface Session {
  userId: number;
  userName: string;
  mail: string;
  roleId: number;
  roleName: string;
  views: string[];
  modules: number[];
  parameters: AppParameters;
}
