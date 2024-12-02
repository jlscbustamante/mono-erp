import {
  Button,
  Form,
  Input,
  Select,
  Tree,
  TreeDataNode,
  TreeProps,
} from 'antd'
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { modules } from '@/const'
import { ICreateIamRole, IIamRole } from '@/data/security/IamRole/type/IamRole'
import { IamRoleStatus } from '@/data/security/IamRole/type/status'
import { authApi } from '@/lib/api/auth'
import { useMutation, useQuery } from '@tanstack/react-query'
import { IamFunction } from 'pizzadb'
import { UpdateRoleDto } from 'shared'

export interface IamFunctionWithChilds extends IamFunction {
  childs: IamFunctionWithChilds[]
}

function addChildsToItems(items: IamFunction[]): IamFunctionWithChilds[] {
  // Crear un mapa de los elementos por su path_view
  const map: { [path: string]: IamFunctionWithChilds } = {}

  // Inicializar los hijos para cada item
  items.forEach((item) => {
    map[item.path_view] = { ...item, childs: [] } // Copiar el item y agregarle la propiedad 'childs'
  })

  // Relacionar los elementos padres e hijos
  const result: IamFunctionWithChilds[] = []

  items.forEach((item) => {
    const parentPath = item.path_view.split('/').slice(0, -1).join('/') // Obtener la URL padre

    // Verificar si tiene un padre
    if (parentPath && map[parentPath]) {
      map[parentPath].childs.push(map[item.path_view]) // Agregar el item como hijo del padre
    } else {
      result.push(map[item.path_view]) // Si no tiene padre, es un elemento raíz
    }
  })

  return result
}

export const UpdateRolForm: React.FC<{
  iamRole: ICreateIamRole | null
  setIamRole: Dispatch<SetStateAction<IIamRole | null>>
  onClose: () => void
  reload: () => void
  showUnsign?: boolean
}> = ({ iamRole, onClose, reload }) => {
  const [form] = Form.useForm()

  const views = useQuery({
    queryKey: ['url-views'],
    queryFn: () => authApi.getFunctions(),
    staleTime: 60000 * 2,
  })

  const rolePermissions = useQuery({
    queryKey: ['role-permissions', iamRole?.id],
    enabled: !!iamRole?.id,
    queryFn: () => authApi.getRolePermissions(iamRole!.id),
  })

  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue as React.Key[])
  }

  const treeData: TreeDataNode[] = useMemo(() => {
    if (!views.data) return []
    const urls = addChildsToItems(views.data)
    return modules.map((el) => {
      return {
        title: el.module,
        key: el.module,
        children: urls
          .filter((url) => {
            return url.module_id === el.id
          })
          .map((el) => {
            return {
              title: el.name,
              key: el.id,
              children: el.childs.map((child) => {
                return {
                  title: child.name,
                  key: child.id,
                }
              }),
            }
          }),
      }
    })
  }, [views.data])

  const updateRoleMt = useMutation({
    mutationFn: (upd: UpdateRoleDto) => authApi.updateRole(upd),
    onSuccess: () => {
      reload()
      onClose()
    },
  })

  const onFinish = async (values: any) => {
    const permissions = checkedKeys.filter((el) => typeof el == 'number')
    const updateRole: UpdateRoleDto = {
      id: values.id,
      name: values.name,
      status: +values.status,
      permissions: permissions as number[],
    }
    await updateRoleMt.mutateAsync(updateRole)
  }

  useEffect(() => {
    if (rolePermissions.data) {
      setCheckedKeys(rolePermissions.data?.map((el) => el.function_id) || [])
    }
  }, [rolePermissions.data])
  return (
    <>
      <div>
        <Form
          form={form}
          name="createIamRole"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            name="id"
            label="ID"
            initialValue={iamRole ? iamRole.id : ''}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Nombre"
            name="name"
            labelAlign="left"
            initialValue={iamRole ? iamRole.name : ''}
            rules={[
              {
                required: true,
                message: 'Por favor ingrese el nombre',
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Input style={{ marginBottom: '8px' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Estado"
            labelAlign="left"
            initialValue={iamRole ? iamRole.status : ''}
            rules={[
              {
                required: true,
                message: 'Por favor ingrese estado',
              },
            ]}
            style={{ marginBottom: '8px' }}
          >
            <Select style={{ width: '100%' }}>
              <Select.Option
                key={IamRoleStatus.Active}
                value={IamRoleStatus.Active}
              >
                Activo
              </Select.Option>
              <Select.Option
                key={IamRoleStatus.Inactive}
                value={IamRoleStatus.Inactive}
              >
                Inactivo
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
      <div className="my-3">
        <Tree
          checkable
          treeData={treeData}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Button
          loading={updateRoleMt.isPending}
          type="primary"
          onClick={async () => {
            await form.validateFields()
            await onFinish(form.getFieldsValue())
          }}
          style={{ marginTop: '30px', marginLeft: '300px' }}
        >
          Guardar
        </Button>
      </div>
    </>
  )
}

export default UpdateRolForm
