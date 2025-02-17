import { Button, Drawer, Form, Input, Modal, Select, Table, Tag } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { ColumnsType } from 'antd/lib/table'
import levenshtein from 'fast-levenshtein'
import { useMemo, useReducer, useState } from 'react'
import { FaTrash } from 'react-icons/fa6'
import { FiSearch } from 'react-icons/fi'
import { MdEdit, MdOutlineCleaningServices } from 'react-icons/md'
import { toast } from 'react-toastify'

import {
  createPresentation,
  deletePresentation,
  updatePresentation,
} from '@/data/products/sdk/maintenance'

import { cn } from '@/utils'
import { IPresentation } from './types'
import { usePresentation } from './usePresentations'

const statusTag = (status: 1 | 0 | '1' | '0') => {
  if (status === 1 || status === '1') {
    return <Tag color="green">Activo</Tag>
  }
  return <Tag color="red">Inactivo</Tag>
}

export default function PresentationMaintenance() {
  const query = usePresentation()
  const [filterName, setFilterName] = useState<string | undefined>(undefined)
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState<IPresentation | null>(null)
  const [controler, loadSearch] = useReducer((state) => state + 1, 0)
  const isOpenEdit = useMemo(() => {
    return openEdit !== null
  }, [openEdit])

  const filteredData = useMemo(() => {
    if (!filterName) return query.data
    return query.data?.filter((item) =>
      item.presentation.toLowerCase().includes(filterName.toLowerCase()),
    )
  }, [query.data, controler])

  // const deletePresentation = async (id: number) => {
  //   try {
  //     await deletePresentationApi(id)
  //     toast.success('Presentacion eliminada', { autoClose: 1500 })
  //     query.refetch()
  //   } catch (err: any) {
  //     toast.error(err?.message)
  //   }
  // }

  const columns: ColumnsType<IPresentation> = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: 100,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Presentación',
      dataIndex: 'presentation',
      sorter: (a, b) => a.presentation.localeCompare(b.presentation),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      width: 120,
      render: (status) => {
        return statusTag(status)
      },
    },
    {
      title: '',
      width: 125,
      render: (record: IPresentation) => {
        return (
          <div className="flex items-center justify-around gap-2">
            <div
              className="flex justify-around cursor-pointer"
              onClick={() => {
                setOpenEdit(record)
              }}
            >
              <MdEdit className="h-auto w-6" />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                Modal.confirm({
                  title: 'Eliminar',
                  content: '¿Está seguro de eliminar esta presentación?',
                  onOk: () => {
                    deletePresentation(record.id)
                      .then((message) => {
                        toast.success(message.message)
                        query.refetch()
                      })
                      .catch((err) => {
                        toast.error(err)
                      })
                  },
                })
              }}
            >
              <FaTrash className="h-auto w-4" />
            </div>
          </div>
        )
      },
    },
  ]

  return (
    <div className="m-3">
      <div className="mb-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Input
            addonBefore="Presentación"
            placeholder="Buscar nombre"
            className="w-80"
            value={filterName}
            onChange={(e) => {
              if (e.target.value == '') setFilterName(undefined)
              else setFilterName(e.target.value)
            }}
            onPressEnter={() => {
              loadSearch()
            }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<FiSearch />}
            onClick={() => {
              loadSearch()
            }}
            className="flex items-center justify-center"
          />
          <Button
            type="primary"
            color="danger"
            shape="circle"
            icon={<MdOutlineCleaningServices />}
            onClick={() => {
              setFilterName(undefined)
              loadSearch()
            }}
            danger
          />
        </div>
        <Button
          type="primary"
          onClick={() => {
            setOpenCreate(true)
          }}
        >
          Nuevo
        </Button>
      </div>
      <div>
        <Table
          size="small"
          rowKey={'id'}
          dataSource={filteredData}
          loading={query.isLoading}
          columns={columns}
          // pagination={{ pageSize: 15 }}
          pagination={false}
        />
      </div>
      <CreateDrawer
        presentations={query.data ?? []}
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onRefetch={() => {
          query.refetch()
        }}
      />
      {openEdit && (
        <EditDrawer
          presentations={query.data ?? []}
          onRefetch={() => query.refetch()}
          open={isOpenEdit}
          presentation={openEdit as IPresentation}
          onClose={() => {
            setOpenEdit(null)
          }}
        />
      )}
    </div>
  )
}

const CreateDrawer = ({
  open,
  onClose,
  onRefetch,
  presentations,
}: {
  open: boolean
  onClose: () => void
  onRefetch: () => void
  presentations: IPresentation[]
}) => {
  const [form] = useForm()

  const handleSubmit = async () => {
    try {
      const data: IPresentation = form.getFieldsValue()
      await createPresentation(data)
      toast.success('Presentación creada', {
        autoClose: 1500,
      })
      onRefetch()
      form.resetFields()
      onClose()
    } catch (err: any) {
      toast.error(err?.message)
    }
  }

  const _presentationName = Form.useWatch('presentation', form)
  const presentationName = useMemo(() => {
    return _presentationName ?? ''
  }, [_presentationName])

  const values = useMemo(() => {
    if (presentationName.trim() == '') return []
    return presentations
      .map((el) => {
        const valueLower = presentationName.toLowerCase()
        const iterateLower = el.presentation.toLowerCase()
        const distance = levenshtein.get(valueLower, iterateLower)
        const isIncluded = iterateLower.replace(/\s/g, '').includes(valueLower)
        const includedPrecision = valueLower.length > 2 ? 1 : 3
        return {
          name: el.presentation,
          distance: distance > 4 && isIncluded ? includedPrecision : distance,
        }
      })
      .filter((el) => el.distance <= 4)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
  }, [presentations, presentationName])

  return (
    <Drawer
      open={open}
      onClose={() => {
        form.resetFields()
        onClose()
      }}
      width={510}
      title={'Crear presentación'}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        onFinish={() => {
          handleSubmit()
        }}
      >
        <Form.Item
          label="Presentación"
          name={'presentation'}
          className={cn({
            'mb-1': values.length > 0,
          })}
          initialValue={''}
          rules={[
            { required: true },
            () => ({
              validator(_, value, callback) {
                const isUnique = presentations.some(
                  (el) =>
                    el.presentation?.toString().toLowerCase() ===
                    value.toString().toLowerCase().trim(),
                )
                if (isUnique) {
                  callback('La presentación ya existe')
                } else callback()
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          wrapperCol={{ offset: 6, span: 18 }}
          className={cn('my-0', {
            hidden: values.length <= 0,
          })}
        >
          <div
            className={cn(
              'bg-slate-50 p-2 border border-dashed border-slate-200 rounded-md mb-3',
            )}
          >
            <p>Presentaciones existentes: </p>
            {values.map((el) => {
              return (
                <p key={el.name} className="font-bold text-slate-800">
                  {el.name}
                </p>
              )
            })}
            <p className="text-sm text-slate-600">
              * evita crear unidades de medida duplicadas
            </p>
          </div>
        </Form.Item>
        <Form.Item label="Estado" name={'status'} initialValue={'1'}>
          <Select>
            <Select.Option value="1">Activo</Select.Option>
            <Select.Option value="0">Inactivo</Select.Option>
          </Select>
        </Form.Item>
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </div>
      </Form>
    </Drawer>
  )
}

const EditDrawer = ({
  open,
  onClose,
  presentation,
  onRefetch,
  presentations,
}: {
  open: boolean
  onClose: () => void
  presentation: IPresentation
  onRefetch: () => void
  presentations: IPresentation[]
}) => {
  const [form] = useForm()

  const handleUpdate = async () => {
    try {
      await updatePresentation(form.getFieldsValue())
      onRefetch()
      toast.success('Marca actualizada')
      onClose()
    } catch (err: any) {
      toast.error(err?.message)
    }
  }
  const presentationForm = Form.useWatch('presentation', form)

  const coincidences = useMemo(() => {
    const text = presentationForm ?? ''
    if (!text || presentation?.presentation == text) return []

    return presentations
      .map((el) => {
        const valueLower = text.toLowerCase()
        const iterateLower = el.presentation.toLowerCase()
        const distance = levenshtein.get(valueLower, iterateLower)
        const isIncluded = iterateLower.replace(/\s/g, '').includes(valueLower)
        const includedPrecision = valueLower.length > 2 ? 1 : 3
        return {
          name: el.presentation,
          distance: distance > 4 && isIncluded ? includedPrecision : distance,
        }
      })
      .filter((el) => el.distance <= 4)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
  }, [presentationForm, presentations, presentation])

  return (
    <Drawer
      width={510}
      open={open}
      title={'Editar presentación'}
      onClose={() => {
        form.resetFields()
        onClose()
      }}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        onFinish={() => {
          handleUpdate()
        }}
        initialValues={{
          ...presentation,
          status: presentation?.status?.toString(),
        }}
      >
        <Form.Item label="Id" name={'id'}>
          <Input readOnly />
        </Form.Item>
        <Form.Item label="Presentación" name={'presentation'}>
          <Input />
        </Form.Item>
        <Form.Item
          wrapperCol={{ offset: 6, span: 18 }}
          className={cn('my-0', {
            hidden: coincidences.length <= 0,
          })}
        >
          <div
            className={cn(
              'bg-slate-50 p-2 border border-dashed border-slate-200 rounded-md mb-3',
            )}
          >
            <p>Presentaciones existentes: </p>
            {coincidences.map((el) => {
              return (
                <p key={el.name} className="font-bold text-slate-800">
                  {el.name}
                </p>
              )
            })}
            <p className="text-sm text-slate-600">
              * evita crear unidades de medida duplicadas
            </p>
          </div>
        </Form.Item>
        <Form.Item label="Estado" name={'status'}>
          <Select>
            <Select.Option value="1">Activo</Select.Option>
            <Select.Option value="0">Inactivo</Select.Option>
          </Select>
        </Form.Item>
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </div>
      </Form>
    </Drawer>
  )
}
