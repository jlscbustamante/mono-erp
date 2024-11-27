/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line unused-imports/no-unused-vars

import { IamUserRoles } from '../../services/IamUserRoles.service'

const iamUserRolesService = new IamUserRoles()
class PermissionSingleton {
  // eslint-disable-next-line no-use-before-define
  private static instance: PermissionSingleton | null = null
  permissions: string[] = []
  rol: string

  private constructor() {}

  public static getInstance(): PermissionSingleton {
    if (!PermissionSingleton.instance) {
      PermissionSingleton.instance = new PermissionSingleton()
    }

    return PermissionSingleton.instance
  }

  public async fetchPermissionsFromDatabase(rolId: string): Promise<void> {
    const permissions = await iamUserRolesService.permission(String(rolId))
    this.rol = rolId
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const moduleNames = permissions.permissions.map(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      (permission: any) => permission.function_ids,
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const allPermissions = moduleNames.flatMap(
      (permissions: any) => permissions,
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    const paths = allPermissions.map(
      (permission: { path: any }) => permission.path,
    )

    this.permissions = paths
  }

  public hasPermission(currentUrl: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return this.permissions.includes(currentUrl)
  }

  public getPermissions(): string[] {
    return this.permissions
  }
}
export default PermissionSingleton
