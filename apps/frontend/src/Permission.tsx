export function usePermissions(locations: string, permission: string) {
  let moduleFound = false
  try {
    let location = locations
    const parsedPermission = JSON.parse(permission)

    if (parsedPermission && parsedPermission.permissions) {
      const cleanedPermissions = location.slice(1)

      switch (cleanedPermissions) {
        case 'bank':
          location = 'Banco'
          break
        case 'maintenance':
          location = 'Mantenimiento'
          break
        case 'security':
          location = 'Seguridad'
          break
        case 'digitization':
          location = 'Digitalización'
          break
        case 'reports':
          location = 'Reportes'
          break
        case 'products':
          location = 'Mercadería'
          break
        case 'stores':
          location = 'Caja de Tiendas'
          break
        default:
          location = '/'
      }

      for (const module of parsedPermission.permissions) {
        if (location.includes(module.module_name)) {
          moduleFound = true
        }
      }

      if (!moduleFound) {
        //window.location.href = '/modules'
      }
    }
  } catch (error) {
    console.error('Error parsing permission:', error)
  }
  return moduleFound
}
