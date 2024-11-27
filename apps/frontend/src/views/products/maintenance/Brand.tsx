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
  createBrand,
  deleteBrand,
  updateBrand,
} from '@/data/products/sdk/maintenance'

import { cn } from '@/utils'
import { IBrand } from './types'
import { useBrands } from './useBrands'

const statusTag = (status: 1 | 0 | '1' | '0') => {
  if (status === 1 || status === '1') {
    return <Tag color="green">Activo</Tag>
  }
  return <Tag color="red">Inactivo</Tag>
}

export default function BrandMaintenance() {
  const query = useBrands()
  const [openCreate, setOpenCreate] = useState(false)
  const [filterName, setFilterName] = useState<string | undefined>(undefined)
  const [openEdit, setOpenEdit] = useState<IBrand | null>(null)
  const isOpenEdit = useMemo(() => {
    return openEdit !== null
  }, [openEdit])
  const [controler, loadSearch] = useReducer((state) => state + 1, 0)

  const filteredData = useMemo(() => {
    if (!filterName) return query.data
    return query.data?.filter((item) =>
      item.brand.toLowerCase().includes(filterName.toLowerCase()),
    )
  }, [query.data, controler])

  const columns: ColumnsType<IBrand> = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: 100,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Marca',
      dataIndex: 'brand',
      sorter: (a, b) => a.brand.localeCompare(b.brand),
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
      width: 74,
      render: (record: IBrand) => {
        return (
          <div className="flex justify-between items-center gap-2">
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
                  content: '¿Está seguro de eliminar esta Marca ?',
                  onOk: () => {
                    deleteBrand(record.id)
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
            addonBefore="Marca"
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
        brands={query.data ?? []}
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onRefetch={() => {
          query.refetch()
        }}
      />
      {openEdit && (
        <EditDrawer
          brands={query.data ?? []}
          onRefetch={() => query.refetch()}
          open={isOpenEdit}
          brand={openEdit as IBrand}
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
  brands,
}: {
  open: boolean
  onClose: () => void
  onRefetch: () => void
  brands: IBrand[]
}) => {
  const [form] = useForm()

  const handleSubmit = async () => {
    try {
      const data: IBrand = form.getFieldsValue()
      await createBrand(data)
      toast.success('Marca creada', {
        autoClose: 1500,
      })
      onRefetch()
      form.resetFields()
      onClose()
    } catch (err: any) {
      toast.error(err?.message)
    }
  }

  const brandName = Form.useWatch('brand', form)

  const values = useMemo(() => {
    if (!brandName) return []
    return brands
      .map((el) => {
        const valueLower = brandName.toLowerCase()
        const iterateLower = el.brand.toLowerCase()
        const distance = levenshtein.get(valueLower, iterateLower)
        const isIncluded = iterateLower.includes(valueLower)
        const includedPrecision = valueLower.length > 4 ? 1 : 3
        return {
          name: el.brand,
          distance: distance > 4 && isIncluded ? includedPrecision : distance,
        }
      })
      .filter((el) => el.distance <= 4)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
  }, [brandName, brands])

  return (
    <Drawer
      open={open}
      onClose={() => {
        form.resetFields()
        onClose()
      }}
      width={510}
      title={'Crear marca'}
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
          label="Marca"
          className={cn({
            'mb-1': values.length > 0,
          })}
          name={'brand'}
          initialValue={''}
          rules={[
            { required: true },
            () => ({
              validator(_, value, callback) {
                const isUnique = brands.some(
                  (el) =>
                    el.brand?.toString().toLowerCase() ===
                    value.toString().toLowerCase(),
                )
                if (isUnique) {
                  callback('La marca ya existe')
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
            <p>
              Marcas similares:{' '}
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
  brand,
  onRefetch,
  brands,
}: {
  open: boolean
  onClose: () => void
  brand: IBrand
  onRefetch: () => void
  brands: IBrand[]
}) => {
  const [form] = useForm()

  const handleUpdate = async () => {
    try {
      await updateBrand(form.getFieldsValue())
      onRefetch()
      toast.success('Marca actualizada')
      onClose()
    } catch (err: any) {
      toast.error(err?.message)
    }
  }

  const brandForm = Form.useWatch('brand', form)

  const coincidences = useMemo(() => {
    const text = brandForm ?? ''
    if (!text || brand?.brand == text) return []

    return brands
      .map((el) => {
        const valueLower = text.toLowerCase()
        const iterateLower = el.brand.toLowerCase()
        const distance = levenshtein.get(valueLower, iterateLower)
        const isIncluded = iterateLower.replace(/\s/g, '').includes(valueLower)
        const includedPrecision = valueLower.length > 2 ? 1 : 3
        return {
          name: el.brand,
          distance: distance > 4 && isIncluded ? includedPrecision : distance,
        }
      })
      .filter((el) => el.distance <= 4)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
  }, [brandForm, brands, brand])

  return (
    <Drawer
      width={510}
      title={'Editar marca'}
      open={open}
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
        initialValues={{ ...brand, status: brand?.status?.toString() }}
      >
        <Form.Item label="Id" name={'id'}>
          <Input readOnly />
        </Form.Item>
        <Form.Item label="Marca" name={'brand'}>
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
            <p>Presentaciones similares: </p>
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
