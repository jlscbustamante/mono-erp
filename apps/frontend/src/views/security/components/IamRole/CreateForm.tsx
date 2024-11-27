import { Button, Checkbox, Form, Input, Select, Table } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import {
  createIIamRole,
  getFunction,
  getModule,
  groupFunction,
  nameIamRol,
  updateRol,
} from '@/data/security/IamRole/sdk'
import { ICreateIamRole, IIamRole } from '@/data/security/IamRole/type/IamRole'
import { IamRoleStatus } from '@/data/security/IamRole/type/status'

interface Permission {
  rol_id: number
  module_id: number
  function_id: any
  granted: number
}
type Module = {
  id: number
  name: string
  status: number
  created_at: string
  updated_at: string
}
type Funciones = {
  id: number
  name: string
  module_id: string
  path_function: string
  path_view: string
  status: number
}
const groupedResults: Record<number, any[]> = {}

export const CreateForm: React.FC<{
  iamRole: ICreateIamRole | null
  setIamRole: Dispatch<SetStateAction<IIamRole | null>>
  onClose: () => void
  reload: () => void
  showUnsign?: boolean
}> = ({ onClose, reload }) => {
  const [moduleData, setModuleData] = useState<any[]>([])
  const [form] = Form.useForm()
  const [selectedFunctions, setSelectedFunctions] = useState<Funciones[]>([])
  const [funcionRol] = useState<Permission[]>([])
  const [selectedFunctionsInLastTable, setSelectedFunctionsInLastTable] =
    useState<Funciones[]>([])
  const [menuSelect, setMenuSelect] = useState<number[]>([])
  const [menSelect, setMenSelect] = useState<string[]>([])
  const [meSelect, setMeSelect] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modules: Module[] = await getModule()
        const funciones: Funciones[] = await getFunction()

        for (const module of modules) {
          const result = await groupFunction(String(module.id))

          if (!groupedResults[module.id]) {
            groupedResults[module.id] = []
            groupedResults[module.id].push(result)
          }
        }

        setSelectedFunctions(funciones)
        setModuleData(modules)
      } catch (err: any) {
        toast.dark(err.message, NOTIFICATION.error)
      }
    }

    fetchData()
  }, [])
  const handleCheckboxChange = (func: Funciones) => {
    setSelectedFunctionsInLastTable((prevSelectedFunctions) => [
      ...prevSelectedFunctions,
      func,
    ])
  }
  const handleCheckboxChanges = (funcs: Funciones[], isChecked: boolean) => {
    setSelectedFunctionsInLastTable((prevSelectedFunctions) => {
      if (isChecked) {
        return [...prevSelectedFunctions, ...funcs]
      } else {
        return prevSelectedFunctions.filter(
          (func) => !funcs.some((selectedFunc) => func.id === selectedFunc.id),
        )
      }
    })
  }
  const onFinish = async (values: ICreateIamRole) => {
    try {
      await createIIamRole(values)

      const idNot = toast.loading('Creando rol ...', NOTIFICATION.loading)

      const data: any = await nameIamRol(String(values.name))
      const id = data[0].id

      try {
        const newPermissions: Permission[] = selectedFunctionsInLastTable.map(
          (funcion: Funciones) => ({
            rol_id: id,
            module_id: Number(funcion.module_id),
            function_id: funcion.id,
            granted: 1,
          }),
        )
        await updateRol(newPermissions)
      } catch (error: any) {
        toast.error(error.message, NOTIFICATION.error)
      }
      toast.update(idNot, {
        render: 'Rol creado',
        ...NOTIFICATION.updateLoading,
      })
      reload()

      onClose()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
      reload()
      onClose()
    }
  }

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
            label="Nombre"
            name="name"
            labelAlign="left"
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

      <div style={{ marginTop: '30px' }}>
        <Table
          dataSource={moduleData.map((module) => ({
            id: module.id,
            name: module.name,
            key: module.id.toString(),
          }))}
          columns={[
            {
              title: 'Permisos del nuevo rol',
              dataIndex: 'name',
              key: 'name',
              render: (text, record) => (
                <React.Fragment>
                  <span style={{ marginRight: '10px' }}>
                    <Checkbox
                      defaultChecked={funcionRol.some(
                        (a) => a.module_id === record.id,
                      )}
                      onChange={(e) => {
                        const matchingFunctions = selectedFunctions.filter(
                          (func) => func.module_id === record.id,
                        )
                        const functions = groupedResults[record.id]
                        if (e.target.checked) {
                          const uniqueNames = new Set([...meSelect])

                          for (const a of matchingFunctions) {
                            uniqueNames.add(a.name)
                          }

                          setMeSelect([...uniqueNames])

                          setMenSelect((prevMenSelect) => {
                            const uniqueSet = new Set(prevMenSelect)

                            functions
                              .flatMap((func) => func.pathFunctionsArray)
                              .forEach((newElement) => {
                                uniqueSet.add(newElement)
                              })

                            const uniqueArray = Array.from(uniqueSet)

                            return uniqueArray
                          })

                          setMenuSelect((prevMenuSelect) => {
                            if (!prevMenuSelect.includes(record.id)) {
                              return [...prevMenuSelect, record.id]
                            }

                            return prevMenuSelect
                          })
                          handleCheckboxChanges(
                            matchingFunctions,
                            e.target.checked,
                          )
                        } else {
                          setMenSelect((prevSelect) => {
                            const elementsToRemove = functions.flatMap(
                              (func) => func.pathFunctionsArray,
                            )

                            const updatedMenSelect = prevSelect.filter(
                              (element) => !elementsToRemove.includes(element),
                            )

                            return updatedMenSelect
                          })

                          setMeSelect((prevSelect) =>
                            prevSelect.filter(
                              (value) =>
                                !matchingFunctions.some(
                                  (a) => a.name === value,
                                ),
                            ),
                          )

                          setMenuSelect((prevMenuSelect) =>
                            prevMenuSelect.filter((id) => id !== record.id),
                          )
                          setMenSelect((prevMenuSelect) =>
                            prevMenuSelect.filter((id) => id !== record.id),
                          )
                          setSelectedFunctionsInLastTable(
                            (prevSelectedFunctions) =>
                              prevSelectedFunctions.filter(
                                (func) => func.module_id !== record.id,
                              ),
                          )
                        }
                      }}
                    />
                  </span>
                  {text}
                </React.Fragment>
              ),
            },
          ]}
          pagination={false}
          size="small"
          expandable={{
            expandedRowRender: (record) => {
              const functions = groupedResults[record.id]

              return (
                <Table
                  dataSource={(functions || []).flatMap((func, index) => {
                    const rows = func.pathFunctionsArray.map(
                      (functionName: any, subIndex: any) => ({
                        id: `${index}-${subIndex}`,
                        name: functionName,
                        key: `${record.id}-${index}-${subIndex}`,
                        module_id: record.id,
                        module_name: record.name,
                      }),
                    )

                    return rows
                  })}
                  columns={[
                    {
                      title: '',
                      dataIndex: 'name',
                      key: 'name',
                      render: (text, menus) => (
                        <React.Fragment>
                          <span style={{ marginRight: '10px' }}>
                            <Checkbox
                              defaultChecked={(() => {
                                for (const a of funcionRol) {
                                  for (const b of selectedFunctions) {
                                    if (
                                      a.function_id === b.id &&
                                      b.path_function === menus.name
                                    ) {
                                      return true
                                    }
                                  }
                                }
                                return false
                              })()}
                              onChange={(e) => {
                                const matchingFunctions =
                                  selectedFunctions.filter(
                                    (func) =>
                                      func.path_function === menus.name &&
                                      func.module_id === menus.module_id,
                                  )

                                if (e.target.checked) {
                                  const uniqueNames = new Set([...meSelect])

                                  for (const a of matchingFunctions) {
                                    uniqueNames.add(a.name)
                                  }

                                  setMeSelect([...uniqueNames])

                                  setMenSelect((prevMenSelect) => {
                                    if (!prevMenSelect.includes(text)) {
                                      return [...prevMenSelect, text]
                                    }

                                    return prevMenSelect
                                  })

                                  handleCheckboxChanges(matchingFunctions, true)
                                } else {
                                  setMeSelect((prevSelect) =>
                                    prevSelect.filter(
                                      (value) =>
                                        !matchingFunctions.some(
                                          (a) => a.name === value,
                                        ),
                                    ),
                                  )

                                  setMenSelect((prevMenSelect) =>
                                    prevMenSelect.filter(
                                      (item) => item !== text,
                                    ),
                                  )

                                  setSelectedFunctionsInLastTable(
                                    (prevSelectedFunctions) => {
                                      const updatedFunctions =
                                        prevSelectedFunctions.filter(
                                          (func) =>
                                            func.path_function !== menus.name ||
                                            func.module_id !== menus.module_id,
                                        )
                                      return updatedFunctions
                                    },
                                  )
                                }
                              }}
                              checked={
                                menSelect.some((a) => a === text) ||
                                menuSelect.some((a) => a === menus.module_id)
                              }
                            />
                          </span>
                          {text}
                        </React.Fragment>
                      ),
                    },
                  ]}
                  pagination={false}
                  size="small"
                  expandable={{
                    expandedRowRender: (record) => {
                      const functions = record.name
                      const module = record.module_id
                      const matchingFunctions = selectedFunctions.filter(
                        (func) =>
                          func.path_function === functions &&
                          func.module_id === module,
                      )
                      const module_name = record.module_id

                      return (
                        <Table
                          dataSource={matchingFunctions.map((func) => ({
                            id: func.id,
                            name: func.name,
                            key: func.id.toString(),
                          }))}
                          columns={[
                            {
                              title: '',
                              dataIndex: 'name',
                              key: 'name',
                              render: (text, funcRecord) => (
                                <React.Fragment>
                                  <span style={{ marginRight: '10px' }}>
                                    <Checkbox
                                      defaultChecked={funcionRol.some(
                                        (func) =>
                                          func.function_id === funcRecord.id,
                                      )}
                                      onChange={(e) => {
                                        const selectedFunction =
                                          matchingFunctions.find(
                                            (func) => func.id === funcRecord.id,
                                          )

                                        if (selectedFunction) {
                                          if (e.target.checked) {
                                            setMeSelect((prevMenSelect) => {
                                              if (
                                                !prevMenSelect.includes(text)
                                              ) {
                                                return [...prevMenSelect, text]
                                              }

                                              return prevMenSelect
                                            })
                                            handleCheckboxChange(
                                              selectedFunction,
                                            )
                                          } else {
                                            setMeSelect((prevMenSelect) =>
                                              prevMenSelect.filter(
                                                (item) => item !== text,
                                              ),
                                            )

                                            setSelectedFunctionsInLastTable(
                                              (prevSelectedFunctions) =>
                                                prevSelectedFunctions.filter(
                                                  (func) =>
                                                    func.id !==
                                                    selectedFunction.id,
                                                ),
                                            )
                                          }
                                        }
                                      }}
                                      checked={
                                        meSelect.some((a) => a === text) ||
                                        (menuSelect.some(
                                          (a) => a === module_name,
                                        ) &&
                                          menSelect.some(
                                            (a) => a === functions,
                                          ))
                                      }
                                    />
                                  </span>
                                  {text}
                                </React.Fragment>
                              ),
                            },
                          ]}
                          pagination={false}
                          size="small"
                        />
                      )
                    },
                  }}
                />
              )
            },
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Button
          type="primary"
          onClick={async () => {
            await form.validateFields()
            await onFinish(form.getFieldsValue())
          }}
          style={{ marginTop: '30px', marginLeft: '300px' }}
        >
          Crear
        </Button>
      </div>
    </>
  )
}

export default CreateForm
