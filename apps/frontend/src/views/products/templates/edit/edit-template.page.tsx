import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Input, Modal, Table } from 'antd'
import { useMemo, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa6'
import { MdDelete, MdEdit } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'

import {
  deleteItemTemplate,
  getListItemsTemplate,
  IItemTemplate,
  TemplateType,
} from '@/data/products/sdk'
import { CreateDrawer } from '@/views/products/templates/edit/create-drawer'
import { EditItemDrawer } from '@/views/products/templates/edit/edit-drawer'

import { PATHS } from '@/const/paths'
import { getTemplateTypeName } from '../components/templateTypeName'

export default function EditTemplate() {
  const { id } = useParams()
  const query = useData(Number(id))
  const [inputText, setInputText] = useState('')
  const [selected, setSelected] = useState<IItemTemplate | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const navigate = useNavigate()

  const data = useMemo(() => {
    let allData = query.data?.items ?? []

    if (inputText) {
      allData = allData.filter((item) => {
        return (
          item.despacho.name.toLowerCase().includes(inputText.toLowerCase()) ||
          item.inventario.name.toLowerCase().includes(inputText.toLowerCase())
        )
      })
    }
    return allData
  }, [query.data, id, inputText])

  const deleteItem = useMutation({
    mutationFn: async (id: number) => {
      return deleteItemTemplate(id)
    },
    onSuccess: () => {
      query.refetch()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  if (query.isLoading) return <div className="p-3">Cargando...</div>

  // if(query.data?.items.length==0)
  if (query.isError) {
    return (
      <div className="p-3">
        {query?.error.message ??
          'Ocurrio un problema al cargar datos la plantilla:'}{' '}
        {id}
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 hover:underline cursor-pointer"
          onClick={() => {
            navigate(PATHS.erp.modulos.mercaderia.mantenimiento.plantillas)
          }}
        >
          <FaArrowLeft />
          <p>Volver</p>
        </div>
        <h3 className="font-semibold text-slate-800 text-lg">
          PLANTILLA : &quot;{query.data?.name}&quot; -{' '}
          {query.data?.type
            ? getTemplateTypeName(query.data.type as TemplateType)
            : ''}
        </h3>
      </div>
      <div className="my-3 flex justify-between">
        <Input
          placeholder="Buscar item"
          className="w-96"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button type="primary" onClick={() => setCreateOpen(true)}>
          Agregar
        </Button>
      </div>
      {/* <div>{JSON.stringify(query.data)}</div> */}
      <Table
        rowKey={'id'}
        size="small"
        pagination={{
          pageSize: 30,
        }}
        columns={[
          {
            title: 'Id',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
          },
          {
            title: 'Categoria',
            dataIndex: ['despacho', 'categoryName'],
            sorter: (a, b) =>
              a.despacho?.categoryName?.localeCompare(
                b.despacho.categoryName ?? '',
              ) ?? 0,
          },
          {
            title: 'Item pedido',
            dataIndex: ['despacho', 'name'],
            sorter: (a, b) =>
              a.despacho?.name?.localeCompare(b.despacho.name ?? '') ?? 0,
            defaultSortOrder: 'ascend',
            onCell: () => {
              return {
                style: { backgroundColor: 'transparent !important' },
              }
            },
          },
          {
            title: 'Item de inventario',
            dataIndex: ['inventario', 'name'],
          },
          // {
          //   title: 'Presentacion',
          //   dataIndex: 'presentationName',
          // },
          {
            title: 'UM base',
            dataIndex: 'measureName',
          },
          {
            title: '',
            render: (row: IItemTemplate) => {
              return (
                <div className="flex gap-2 items-center">
                  <MdEdit
                    className="h-auto w-5 cursor-pointer"
                    onClick={() => {
                      setSelected(row)
                    }}
                  />
                  <MdDelete
                    className="h-auto w-5 cursor-pointer text-slate-700"
                    onClick={() => {
                      return Modal.confirm({
                        title: 'Eliminar',
                        content: `¿Está seguro de eliminar este item`,
                        onOk: async () => {
                          await deleteItem.mutateAsync(row.id)
                        },
                      })
                    }}
                  />
                </div>
              )
            },
          },
        ]}
        onRow={(row) => {
          if (row.despacho.id != row.inventario.id) {
            return {
              style: {
                backgroundColor: 'rgba(180, 228, 255, 0.15)',
              },
            }
          }
          return {}
        }}
        dataSource={data}
      />
      <EditItemDrawer
        onUpdate={() => query.refetch()}
        item={selected ?? undefined}
        allItems={data}
        onClose={() => {
          setSelected(null)
        }}
      />
      <CreateDrawer
        baseId={Number(id)}
        allItems={data}
        onClose={() => {
          setCreateOpen(false)
        }}
        open={createOpen}
        onUpdate={() => query.refetch()}
      />
    </div>
  )
}

const useData = (id: number) => {
  const query = useQuery({
    queryKey: ['edit-template', id],
    queryFn: async () => await getListItemsTemplate(id),
    retry: false,
  })

  return query
}
