import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Tag,
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import { ColumnsType } from 'antd/lib/table'
import { useMemo, useReducer, useState } from 'react'
import { FaTrash } from 'react-icons/fa6'
import { FiSearch } from 'react-icons/fi'
import { MdEdit, MdOutlineCleaningServices } from 'react-icons/md'
import { toast } from 'react-toastify'

import {
  createEquivalence,
  deleteEquivalence,
  updateEquivalence,
} from '@/data/products/sdk/maintenance'

import { Equivalence } from './types'
import { useEquivalence } from './useEquivalence'
import { useMeasure } from './useMeasure'
import { usePresentation } from './usePresentations'

const statusTag = (status: 1 | 0 | '1' | '0') => {
  if (status === 1 || status === '1') {
    return <Tag color="green">Activo</Tag>
  }
  return <Tag color="red">Inactivo</Tag>
}

export default function EquivalanceMaintenance() {
  const query = useEquivalence()
  const [filterPresentation, setFilterPresentation] = useState<
    string | undefined
  >(undefined)
  const [filterUnit, setFilterUnit] = useState<string | undefined>(undefined)

  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState<Equivalence | null>(null)
  const [controler, loadSearch] = useReducer((state) => state + 1, 0)
  const isOpenEdit = useMemo(() => {
    return openEdit !== null
  }, [openEdit])

  const filteredData = useMemo(() => {
    if (!filterPresentation && !filterUnit) return query.data

    let _filteredData: Equivalence[] = query.data ?? []
    if (filterPresentation) {
      _filteredData = _filteredData.filter((item) => {
        return item.presentation.presentation
          .toLowerCase()
          .includes(filterPresentation.toLowerCase())
      })
    }

    if (filterUnit) {
      _filteredData = _filteredData.filter((item) => {
        return item.measure.measure
          .toLowerCase()
          .includes(filterUnit.toLowerCase())
      })
    }

    return _filteredData
  }, [query.data, controler])

  // const deleteBrand = async (id: number) => {
  //   try {
  //     await deleteBrandApi(id)
  //     toast.success('Marca eliminada', { autoClose: 1500 })
  //     query.refetch()
  //   } catch (err: any) {
  //     toast.error(err?.message)
  //   }
  // }

  const columns: ColumnsType<Equivalence> = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: 100,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Valor',
      dataIndex: 'value_from',
    },
    {
      title: 'Presentacion',
      dataIndex: ['presentation', 'presentation'],
      sorter: (a, b) =>
        a.presentation.presentation.localeCompare(b.presentation.presentation),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Factor',
      dataIndex: 'value_factor',
    },
    {
      title: 'Medida',
      dataIndex: ['measure', 'measure'],
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      render: (status) => {
        return statusTag(status)
      },
    },
    {
      title: '',
      width: 85,
      render: (record: Equivalence) => {
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
                  content: '¿Está seguro de eliminar esta equivalencia?',
                  onOk: () => {
                    deleteEquivalence(record.id)
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
        <div className="flex gap-2">
          <Input
            addonBefore="Presentación"
            placeholder="Buscar nombre"
            className="w-70"
            value={filterPresentation}
            onChange={(e) => {
              if (e.target.value == '') setFilterPresentation(undefined)
              else setFilterPresentation(e.target.value)
            }}
            onPressEnter={() => {
              loadSearch()
            }}
          />
          <Input
            addonBefore="Unidad"
            placeholder="Buscar nombre"
            className="w-70"
            value={filterUnit}
            onPressEnter={() => {
              loadSearch()
            }}
            onChange={(e) => {
              if (e.target.value == '') setFilterUnit(undefined)
              else setFilterUnit(e.target.value)
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
              setFilterPresentation(undefined)
              setFilterUnit(undefined)
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
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onRefetch={() => {
          query.refetch()
        }}
      />
      <EditDrawer
        onRefetch={() => query.refetch()}
        open={isOpenEdit}
        brand={openEdit as Equivalence}
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
}: {
  open: boolean
  onClose: () => void
  onRefetch: () => void
}) => {
  const [form] = useForm()
  const queryPresentation = usePresentation()
  const queryMeasure = useMeasure()

  // const textMerged=useMemo(()=>{
  //   const presentation=queryPresentation.data?.find((item)=>item.id===form.getFieldValue('presentation_from'))
  //   const valuePresentation=form.getFieldValue('value_from')

  //   const measure=queryMeasure.data?.find((item)=>item.id===form.getFieldValue('measure_to'))

  //   const factor=form.getFieldValue('value_factor')

  //   return `${valuePresentation} ${presentation?.presentation ?? '(?)'} = ${factor} ${measure?.measure ?? '(?)'} `
  // },[form.getFieldsValue(),form])

  const presentation_from = Form.useWatch('presentation_from', { form })
  const measure_to = Form.useWatch('measure_to', { form })
  const value_from = Form.useWatch('value_from', { form })
  const value_factor = Form.useWatch('value_factor', { form })

  const textMerged = useMemo(() => {
    const presentation = queryPresentation.data?.find(
      (item) => item.id === presentation_from,
    )
    const measure = queryMeasure.data?.find((item) => item.id === measure_to)

    return `${value_from} (${
      presentation?.presentation ?? '?'
    }) = ${value_factor} (${measure?.measure ?? '?'})`
  }, [presentation_from, measure_to, value_from, value_factor])

  const handleSubmit = async () => {
    try {
      const data: Equivalence = form.getFieldsValue()
      await createEquivalence(data)
      toast.success('Marca creada', {
        autoClose: 1200,
      })
      onRefetch()
      form.resetFields()
      onClose()
    } catch (err: any) {
      toast.error(err?.message)
    }
  }

  return (
    <Drawer
      open={open}
      onClose={() => {
        form.resetFields()
        onClose()
      }}
      width={510}
      title={'Crear Equivalencia'}
    >
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        onFinish={() => {
          handleSubmit()
        }}
      >
        <Form.Item
          label="Presentación"
          name={'presentation_from'}
          required
          rules={[{ required: true }]}
        >
          <Select>
            {queryPresentation.data
              ?.sort((a, b) => a.presentation.localeCompare(b.presentation))
              .map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.presentation}
                  </Select.Option>
                )
              })}
          </Select>
        </Form.Item>
        <Form.Item
          label="Valor de presentación"
          name="value_from"
          initialValue={1}
          rules={[{ required: true }]}
        >
          <InputNumber min={0} readOnly />
        </Form.Item>
        <Form.Item
          label="Unidad base"
          name={'measure_to'}
          required
          rules={[{ required: true }]}
        >
          <Select>
            {queryMeasure.data
              ?.sort((a, b) => a.measure.localeCompare(b.measure))
              .map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.measure}
                  </Select.Option>
                )
              })}
          </Select>
        </Form.Item>

        <Form.Item
          label="Factor"
          name="value_factor"
          initialValue={1}
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Estado" name="status" initialValue={'1'}>
          <Select>
            <Select.Option value="1">Activo</Select.Option>
            <Select.Option value="0">Inactivo</Select.Option>
          </Select>
        </Form.Item>
        <div className="mb-3">
          <Card size="small">
            <p>{textMerged}</p>
          </Card>
        </div>
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
}: {
  open: boolean
  onClose: () => void
  brand: Equivalence
  onRefetch: () => void
}) => {
  const [form] = useForm()
  const queryPresentation = usePresentation()
  const queryMeasure = useMeasure()

  const handleUpdate = async () => {
    try {
      await updateEquivalence(form.getFieldsValue())
      onRefetch()
      toast.success('Marca actualizada', { autoClose: 1200 })
      onClose()
    } catch (err: any) {
      toast.error(err?.message)
    }
  }

  const presentation_from = Form.useWatch('presentation_from', { form })
  const measure_to = Form.useWatch('measure_to', { form })
  const value_from = Form.useWatch('value_from', { form })
  const value_factor = Form.useWatch('value_factor', { form })

  const textMerged = useMemo(() => {
    const presentation = queryPresentation.data?.find(
      (item) => item.id === presentation_from,
    )
    const measure = queryMeasure.data?.find((item) => item.id === measure_to)

    return `${value_from} (${
      presentation?.presentation ?? '?'
    }) = ${value_factor} (${measure?.measure ?? '?'})`
  }, [presentation_from, measure_to, value_from, value_factor])

  return (
    <Drawer
      width={510}
      title={'Actualizar Equivalencia'}
      open={open}
      onClose={() => {
        form.resetFields()
        onClose()
      }}
    >
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        onFinish={() => {
          handleUpdate()
        }}
        initialValues={{ ...brand, status: brand?.status?.toString() }}
      >
        <Form.Item label="Id" name={'id'}>
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label="Presentación"
          name={'presentation_from'}
          rules={[{ required: true }]}
        >
          <Select>
            {queryPresentation.data?.map((item) => {
              return (
                <Select.Option key={item.id} value={item.id}>
                  {item.presentation}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="Valor de presentación"
          name="value_from"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          label="Medida"
          name={'measure_to'}
          rules={[{ required: true }]}
        >
          <Select>
            {queryMeasure.data?.map((item) => {
              return (
                <Select.Option key={item.id} value={item.id}>
                  {item.measure}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="Factor"
          name="value_factor"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Estado" name="status">
          <Select>
            <Select.Option value="1">Activo</Select.Option>
            <Select.Option value="0">Inactivo</Select.Option>
          </Select>
        </Form.Item>
        <div className="mb-3">
          <Card size="small">
            <p>{textMerged}</p>
          </Card>
        </div>
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </div>
      </Form>
    </Drawer>
  )
}
