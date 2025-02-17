import { Tag } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'
import { MdRemoveRedEye } from 'react-icons/md'

import { DispatchStatus, IDispatch } from '@/data/products/types'
import { fNumber } from '@/utils/formatNumber'

import { PATHS } from '@/const/paths'
import { useNavigate } from 'react-router'
import { useDispatchBetweenStoresQuery } from '../../state/useDispatch'
import { useStore } from '../useStore'
import { useViewMoveDrawer } from './view-move-drawer'

export const TableMoves = () => {
  const { open } = useViewMoveDrawer()
  const filterDescription = useStore((st) => st.filterDescription)
  const query = useDispatchBetweenStoresQuery()
  const navigate = useNavigate()
  const columns: ColumnsType<IDispatch> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'F. despacho',
      dataIndex: 'moveAt',
      key: 'moveAt',
      width: 105,
      render: (text: string) => {
        return text.split(' ')[0]
      },
    },

    {
      title: 'Origen',
      dataIndex: ['wareFrom', 'name'],
      key: 'wareFrom',
      sorter: (a, b) =>
        a.wareFrom?.name.localeCompare(b.wareFrom?.name ?? '') ?? 0,
    },
    {
      title: 'Destino',
      dataIndex: ['wareTo', 'name'],
      key: 'wareTo',
      sorter: (a, b) => a.wareTo?.name.localeCompare(b.wareTo?.name ?? '') ?? 0,
    },
    {
      title: 'Descripcion',
      width: 300,
      dataIndex: 'gloss',
      key: 'gloss',
      sorter: (a, b) => a.gloss.localeCompare(b.gloss),
    },
    {
      title: 'Guia',
      dataIndex: 'numGuide',
      key: 'numGuide',
      sorter: () => -1,
    },
    {
      title: 'Total',
      dataIndex: 'totalValue',
      key: 'totalPrice',
      align: 'right',
      render: (text) => fNumber(text, 2),
      sorter: (a, b) => a.totalValue - b.totalValue,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      width: 110,
      key: 'status',
      render: (status: DispatchStatus) => {
        if (status == DispatchStatus.NEW)
          return <Tag color="blue">Pedido nuevo</Tag>
        else if (status == DispatchStatus.APPROVED)
          return <Tag color="green">Pedido aprobado</Tag>
        else if (status == DispatchStatus.DISPATCHED)
          return <Tag color="green">Pedido despachado</Tag>
        else if (status == DispatchStatus.CANCELED)
          return <Tag color="red">Pedido anulado</Tag>
        else if (status == DispatchStatus.INVOICED)
          return <Tag color="#cd201f">Facturado</Tag>
        return <Tag>Estado desconocido {status}</Tag>
      },
    },
    {
      title: '',
      onCell: () => {
        return {
          width: '20px',
        }
      },
      render: (record: IDispatch) => {
        return (
          <div className="flex justify-around items-center gap-2">
            <div
              className="cursor-pointer"
              onClick={() => {
                // open(record.id)
                navigate(
                  PATHS.erp.modulos.mercaderia.despachos.reviewStore +
                    '?id=' +
                    record.id,
                )
              }}
            >
              <MdRemoveRedEye className="w-5 h-auto" />
            </div>
          </div>
        )
      },
    },
  ]
  const dataFiltered = useMemo(() => {
    if (!query.data) return []
    if (filterDescription === '') return query.data
    return query.data.filter((d) => d.gloss.includes(filterDescription))
  }, [query.data, filterDescription])
  return (
    <Table
      size="small"
      columns={columns}
      rowKey={'id'}
      dataSource={dataFiltered}
      loading={query.isLoading}
      pagination={false}
    />
  )
}
