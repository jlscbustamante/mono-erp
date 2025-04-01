import { Modal, Tag } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect } from 'react'
import { FaTrash } from 'react-icons/fa6'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'

import { deleteProductItem } from '@/data/products/sdk'
import { IInvProductItem } from '@/data/products/types'
import { fNumber } from '@/utils/formatNumber'

import { RiCoinsLine } from 'react-icons/ri'
import { useEditPrice } from '../../price-list/edit-price'
import { useProductItem } from '../../state/useProductItem'

export const TableProductItem = ({ ref_table }: { ref_table: any }) => {
  const { open } = useEditPrice()

  const { store, loadProducts } = useProductItem()
  const columns: ColumnsType<IInvProductItem> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Categoria',
      dataIndex: ['product', 'category', 'category'],
      sorter: (a, b) =>
        a.product?.category?.category.localeCompare(
          b.product?.category?.category ?? '',
        ) ?? 0,
    },
    {
      title: 'Nombre del item',
      dataIndex: 'itemName',
      key: 'itemName',
      sorter: (a, b) => a.itemName.localeCompare(b.itemName),
    },
    {
      title: 'Costo',
      dataIndex: 'unitCost',
      render: (text) => fNumber(text),
      sorter: (a, b) => a.unitCost - b.unitCost,
    },
    {
      title: 'Precio',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (text) => fNumber(text),
      sorter: (a, b) => a.unitPrice - b.unitPrice,
    },
    {
      title: 'UM',
      dataIndex: ['measure', 'code'],
      key: 'unidad_medida',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      sorter: () => -1,
      render: (status) => {
        if (status == 1) {
          return <Tag color="green">Activo</Tag>
        } else if (status == 0) {
          return <Tag color="red">Inactivo</Tag>
        }
      },
    },
    {
      title: '',
      onCell: () => {
        return {
          width: '30px',
        }
      },
      render: (record: IInvProductItem) => {
        return (
          <div className="flex justify-around items-center gap-2 print:hidden">
            <div className="cursor-pointer group" onClick={() => open(record)}>
              <RiCoinsLine className="w-5 h-auto" />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                store.setEditProductItemId(record.id)
              }}
            >
              <MdEdit className="h-auto w-5" />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                Modal.confirm({
                  title: 'Eliminar',
                  content: '¿Está seguro de eliminar esta item?',
                  onOk: () => {
                    deleteProductItem(record.id)
                      .then((message) => {
                        toast.success(message.message)
                        store.setWasUpdatedOrCreated()
                      })
                      .catch((err) => {
                        toast.error(err.message)
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

  useEffect(() => {
    loadProducts()
  }, [store.pagination, store.wasUpdateOrCreated])

  return (
    <div ref={ref_table} className="print:p-3">
      <Table
        className="table-items-to-print"
        size="small"
        loading={store.loadings.products}
        rowKey={'id'}
        rowClassName={() => 'editable-row'}
        columns={columns}
        dataSource={store.productItems}
        pagination={false}
        // pagination={{
        //   pageSize: 20,
        // }}
        // onChange={(pagination) => {
        //   store.onChangePagination({
        //     page: pagination.current ?? 1,
        //     lot: pagination.pageSize ?? 15,
        //   })
        // }}
        // pagination={{
        //   pageSize: store.pagination.lot,
        //   showSizeChanger: true,
        //   current: store.pagination.page,
        //   total: store.totalProducts,
        // }}
      />
    </div>
  )
}
