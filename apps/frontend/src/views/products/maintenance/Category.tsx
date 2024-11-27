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
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/data/products/sdk/maintenance'

import { cn } from '@/utils'
import { ICategory } from './types'
import { useCategory } from './useCategory'

const statusTag = (status: 1 | 0 | '1' | '0') => {
  if (status === 1 || status === '1') {
    return <Tag color="green">Activo</Tag>
  }
  return <Tag color="red">Inactivo</Tag>
}

export default function CategoryMaintenance() {
  const query = useCategory()
  const [filterName, setFilterName] = useState<string | undefined>(undefined)
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState<ICategory | null>(null)
  const [controler, loadSearch] = useReducer((state) => state + 1, 0)
  const isOpenEdit = useMemo(() => {
    return openEdit !== null
  }, [openEdit])

  const filteredData = useMemo(() => {
    if (!filterName) return query.data
    return query.data?.filter((item) =>
      item.category.toLowerCase().includes(filterName.toLowerCase()),
    )
  }, [query.data, controler])

  const columns: ColumnsType<ICategory> = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: 100,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
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
      width: 82,
      render: (record: ICategory) => {
        return (
          <div className="flex justify-around items-center gap-2">
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
                    deleteCategory(record.id)
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
            addonBefore="Categoria"
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
        categories={query.data ?? []}
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onRefetch={() => {
          query.refetch()
        }}
      />
      <EditDrawer
        categories={query.data ?? []}
        onRefetch={() => query.refetch()}
        open={isOpenEdit}
        brand={openEdit as ICategory}
        onClose={() => {
          setOpenEdit(null)
        }}
      />
    </div>
  )
}

const CreateDrawer = ({
  open,
  onClose,
  onRefetch,
  categories,
}: {
  open: boolean
  onClose: () => void
  onRefetch: () => void
  categories: ICategory[]
}) => {
  const [form] = useForm()

  const handleSubmit = async () => {
    try {
      const data: ICategory = form.getFieldsValue()
      await createCategory(data)
      toast.success('Categoria creada', {
        autoClose: 1500,
      })
      onRefetch()
      form.resetFields()
      onClose()
    } catch (err: any) {
      toast.error(err?.message)
    }
  }

  const categoryName = Form.useWatch('category', form)

  const values = useMemo(() => {
    if (!categoryName) return undefined
    return categories
      .map((el) => {
        const distance = levenshtein.get(
          categoryName.toLowerCase(),
          el.category.toLowerCase(),
        )
        return {
          name: el.category,
          distance,
        }
      })
      .filter((el) => el.distance <= 3)
      .sort((a, b) => a.distance - b.distance)[0]
  }, [categoryName, categories])

  return (
    <Drawer
      open={open}
      onClose={() => {
        form.resetFields()
        onClose()
      }}
      width={510}
      title={'Crear categoria'}
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
          label="Categoria"
          name={'category'}
          className="mb-1"
          initialValue={''}
          rules={[
            {
              required: true,
            },
            () => ({
              validator(_, value, callback) {
                const isUnique = categories.some(
                  (el) =>
                    el.category?.toString().toLowerCase() ===
                    value.toString().toLowerCase(),
                )
                if (isUnique) {
                  callback('La categoria ya existe')
                } else callback()
              },
            }),
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 18 }} className="my-0">
          <div
            className={cn(
              'bg-slate-50 p-2 border border-dashed border-slate-200 rounded-md mb-3',
              {
                hidden: !values,
              },
            )}
          >
            <p>
              Categoria similar:{' '}
              <span className="font-bold text-slate-800">{values?.name}</span>
            </p>
            <p className="text-sm text-slate-600">
              * evita crear categorías duplicadas
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
  brand,
  onRefetch,
  categories,
}: {
  open: boolean
  onClose: () => void
  brand: ICategory
  onRefetch: () => void
  categories: ICategory[]
}) => {
  const [form] = useForm()

  const handleUpdate = async () => {
    try {
      await updateCategory(form.getFieldsValue())
      onRefetch()
      toast.success('Categoria actualizada')
      onClose()
    } catch (err: any) {
      toast.error(err?.message)
    }
  }
  const categoryForm = Form.useWatch('category', form)

  const coincidences = useMemo(() => {
    const text = categoryForm ?? ''
    if (!text) return []
    if (!text || brand?.category == text) return []
    return categories
      .map((el) => {
        const valueLower = text.toLowerCase()
        const iterateLower = el.category.toLowerCase()
        const distance = levenshtein.get(valueLower, iterateLower)
        const isIncluded = iterateLower.replace(/\s/g, '').includes(valueLower)
        const includedPrecision = valueLower.length > 2 ? 1 : 3
        return {
          name: el.category,
          distance: distance > 4 && isIncluded ? includedPrecision : distance,
        }
      })
      .filter((el) => el.distance <= 4)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
  }, [categoryForm, categories, brand])

  return (
    <Drawer
      width={510}
      title={'Editar categoria'}
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
        <Form.Item label="Categoria" name={'category'}>
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
