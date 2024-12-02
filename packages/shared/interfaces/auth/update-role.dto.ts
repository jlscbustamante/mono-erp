export interface UpdateRoleDto {
  id: number;
  name: string;
  status: number;

  permissions: number[];
}
