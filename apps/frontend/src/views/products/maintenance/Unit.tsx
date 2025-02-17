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
  createMeasure,
  deleteMeasure,
  updateMeasure,
} from '@/data/products/sdk/maintenance'

import { cn } from '@/utils'
import { IMeasure } from './types'
import { useMeasure } from './useMeasure'

const statusTag = (status: 1 | 0 | '1' | '0') => {
  if (status === 1 || status === '1') {
    return <Tag color="green">Activo</Tag>
  }
  return <Tag color="red">Inactivo</Tag>
}

export default function UnitMaintenance() {
  const query = useMeasure()
  const [filterName, setFilterName] = useState<string | undefined>(undefined)
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState<IMeasure | null>(null)
  const [controler, loadSearch] = useReducer((state) => state + 1, 0)
  const isOpenEdit = useMemo(() => {
    return openEdit !== null
  }, [openEdit])

  const filteredData = useMemo(() => {
    if (!filterName) return query.data
    return query.data?.filter((item) =>
      item.measure.toLowerCase().includes(filterName.toLowerCase()),
    )
  }, [query.data, controler])

  const columns: ColumnsType<IMeasure> = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: 100,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Medida',
      dataIndex: 'measure',
      sorter: (a, b) => a.measure.localeCompare(b.measure),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Codigo',
      dataIndex: 'code',
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
      width: 84,
      render: (record: IMeasure) => {
        return (
          <div className="flex items-center justify-around">
            <div
              className="flex justify-around cursor-pointer"
              onClick={() => {
                setOpenEdit(record)
              }}
            >
              <MdEdit className="h-auto w-5" />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                Modal.confirm({
                  title: 'Eliminar',
                  content: '¿Está seguro de eliminar esta categoria?',
                  onOk: () => {
                    deleteMeasure(record.id)
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
            addonBefore="Unidad"
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
        units={query.data ?? []}
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onRefetch={() => {
          query.refetch()
        }}
      />
      {isOpenEdit && (
        <EditDrawer
          measures={query.data ?? []}
          onRefetch={() => query.refetch()}
          open={isOpenEdit}
          presentation={openEdit as IMeasure}
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
  units,
}: {
  open: boolean
  onClose: () => void
  onRefetch: () => void
  units: IMeasure[]
}) => {
  const [form] = useForm()

  const handleSubmit = async () => {
    try {
      const data: IMeasure = form.getFieldsValue()
      await createMeasure(data)
      toast.success('Medida creada', {
        autoClose: 1500,
      })
      onRefetch()
      form.resetFields()
      onClose()
    } catch (err: any) {
      toast.error(err?.message)
    }
  }

  const measureName = Form.useWatch('measure', form)

  const values = useMemo(() => {
    if (!measureName) return []
    return units
      .map((el) => {
        const distance = levenshtein.get(
          measureName.toLowerCase(),
          el.measure.toLowerCase(),
        )
        return {
          name: el.measure,
          distance,
        }
      })
      .filter((el) => el.distance <= 3)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
  }, [measureName, units])

  return (
    <Drawer
      open={open}
      onClose={() => {
        form.resetFields()
        onClose()
      }}
      width={510}
      title={'Crear unidad de medida'}
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
          label="Medida"
          className={cn({
            'mb-1': values.length > 0,
          })}
          name={'measure'}
          initialValue={''}
          rules={[
            {
              required: true,
            },
            () => ({
              validator(_, value, callback) {
                const isUnique = units.some(
                  (el) =>
                    el.measure?.toString().toLowerCase() ===
                    value.toString().toLowerCase().trim(),
                )
                if (isUnique) {
                  callback('La unidad de medida ya existe')
                } else callback()
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          wrapperCol={{ offset: 6, span: 18 }}
          className={cn('mb-0', {
            hidden: values.length <= 0,
          })}
        >
          <div
            className={cn(
              'bg-slate-50 p-2 border border-dashed border-slate-200 rounded-md mb-3',
            )}
          >
            <p>
              Unidades existentes:{' '}
              <span className="font-bold text-slate-800">
                {values.map((el) => el.name).join(', ')}
              </span>
            </p>
            <p className="text-sm text-slate-600">
              * evita crear unidades de medida duplicadas
            </p>
          </div>
        </Form.Item>
        <Form.Item label="Codigo" name={'code'} initialValue={''}>
          <Input />
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
  measures,
}: {
  open: boolean
  onClose: () => void
  presentation: IMeasure
  onRefetch: () => void
  measures: IMeasure[]
}) => {
  const [form] = useForm()

  const handleUpdate = async () => {
    try {
      await updateMeasure(form.getFieldsValue())
      onRefetch()
      toast.success('Medida actualizada')
      onClose()
    } catch (err: any) {
      toast.error(err?.message)
    }
  }

  const measureForm = Form.useWatch('measure', form)

  const coincidences = useMemo(() => {
    const text = measureForm ?? ''
    if (!text || presentation?.measure == text) return []

    return measures
      .map((el) => {
        const valueLower = text.toLowerCase()
        const iterateLower = el.measure.toLowerCase()
        const distance = levenshtein.get(valueLower, iterateLower)
        const isIncluded = iterateLower.replace(/\s/g, '').includes(valueLower)
        const includedPrecision = valueLower.length > 2 ? 1 : 3
        return {
          name: el.measure,
          distance: distance > 4 && isIncluded ? includedPrecision : distance,
        }
      })
      .filter((el) => el.distance <= 4)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
  }, [measureForm, measures, presentation])

  return (
    <Drawer
      width={510}
      open={open}
      title={'Editar unidad de medida'}
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
        <Form.Item label="Medida" name={'measure'}>
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
        <Form.Item label="Codigo" name={'code'}>
          <Input />
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
