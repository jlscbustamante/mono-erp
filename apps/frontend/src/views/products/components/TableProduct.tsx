import { Modal, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FaTrash } from 'react-icons/fa6'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'

import { deleteProduct } from '@/data/products/sdk'
import { IInvProduct } from '@/data/products/types'

import { useProductStore } from '../state/useProduct'

export const TableProduct = () => {
  const store = useProductStore()
  const columns: ColumnsType<IInvProduct> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Nombre del producto',
      dataIndex: 'product',
      key: 'product',
      sorter: (a, b) => a.product.localeCompare(b.product),
    },
    {
      title: 'Categoría',
      dataIndex: ['category', 'category'],
      key: 'categoryId',
    },
    {
      title: 'UM',
      dataIndex: ['measure', 'code'],
      key: 'measureId',
      sorter: (a, b) => {
        if (!a.measure?.code || !b.measure?.code) return 0
        return a.measure.code.localeCompare(b.measure.code)
      },
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 110,
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
      render: (record: IInvProduct) => {
        return (
          <div className="flex justify-around items-center gap-2">
            <div
              className="cursor-pointer group"
              onClick={() => store.setEditProductId(record.id)}
            >
              <MdEdit className="h-auto w-5" />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                Modal.confirm({
                  title: 'Eliminar',
                  content: '¿Está seguro de eliminar este producto?',
                  onOk: () => {
                    deleteProduct(record.id)
                      .then((message) => {
                        toast.success(message.message)
                        store.setWasUpdatedOrCreated()
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
    <Table
      size="small"
      loading={store.loadings.products}
      rowKey={'id'}
      rowClassName={() => 'editable-row'}
      columns={columns}
      dataSource={store.products}
      pagination={false}
      // pagination={{
      //   pageSize: 20,
      // }}
      // onChange={(pagination) => {
      //   store.onChangePagination({
      //     page: pagination.current ?? 1,
      //     lot: pagination.pageSize ?? 15,
      //   })
      //   store.setWasUpdatedOrCreated()
      // }}
      // pagination={{
      //   pageSize: store.pagination.lot,
      //   showSizeChanger: true,
      //   current: store.pagination.page,
      //   total: store.totalProducts,
      // }}
    />
  )
}
