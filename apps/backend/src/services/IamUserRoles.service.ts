/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DataSource } from 'typeorm'

import { AppDataSource } from '../config/database'

export class IamUserRoles {
  dataSource: DataSource
  constructor() {
    this.dataSource = AppDataSource
  }

  async permission(rol: string): Promise<{
    [x: string]: any
    permissions: any
  }> {
    const findedUsers = await this.dataSource.query(
      `
      SELECT
      permission.module_id AS moduleId,
      module.name AS module_name,
      permission.function_id AS function_id,
      fn.name AS function_name,
      fn.path_function AS path_function,
      fn.path_view AS path_view
    FROM
      iam_permission permission
    INNER JOIN
      iam_role rol 
      ON permission.rol_id = rol.id
    INNER JOIN
      iam_module module
      ON permission.module_id = module.id
    INNER JOIN
      iam_function AS fn
      ON permission.function_id = fn.id
    WHERE permission.rol_id = ${rol}
        `,
    )

    const groupedPermissions: { [moduleId: string]: any } = {}

    findedUsers.forEach(
      (row: {
        moduleId: string | number
        module_name: string
        function_id: string
        function_name: string
        path_function: string
        path_view: string
      }) => {
        const moduleId = String(row.moduleId)
        if (!groupedPermissions[moduleId]) {
          groupedPermissions[moduleId] = {
            module_name: row.module_name,
            function_ids: [],
          }
        }
        groupedPermissions[moduleId].function_ids.push({
          function_name: row.function_name,
          menu: row.path_function,
          path: row.path_view,
        })
      },
    )

    const permissions = Object.values(groupedPermissions)

    return { permissions }
  }
}
