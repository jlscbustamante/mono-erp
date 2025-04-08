import { useQuery } from '@tanstack/react-query'
import {
  Table, Button, Space, Typography, Divider, message, Spin, Alert, Input, Card
} from 'antd'
import { PlusOutlined, SyncOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState, useMemo } from 'react'

import { useCatalogSyncQuery } from '../hooks/useCatalogSyncQuery'
import { getProductsFromDB, syncManyProducts } from '../services/catalogSalesApi'
import { IProduct } from '../../shared/types'
import { useAddProduct } from '../hooks/useAddProduct'
import { useAddAllWithRefetch } from '../hooks/useAddAllWithFeedback'
import { useItemLoading } from '../hooks/useItemLoading'


const { Title } = Typography
const { Search } = Input

export default function ProductList() {
  const [messageApi, contextHolder] = message.useMessage()
  const [showRegistered, setShowRegistered] = useState(true)
  const [searchSynced, setSearchSynced] = useState('')
  const [searchUnsynced, setSearchUnsynced] = useState('')  


  const addProductMutation = useAddProduct()
  const { isLoading, start, stop } = useItemLoading()

  // const { mutate: addAllProducts, isPending: isAddingAll } = useAddAllProducts()

  const { data: syncedProducts = [], isLoading: loadingSynced, refetch: refetchSynced  } = useQuery<IProduct[]>({
    queryKey: ['products-synced'],
    queryFn: getProductsFromDB
  })

  const { data: commercialData, isLoading: loadingCommercial, refetch } = useCatalogSyncQuery()
  const commercialProducts = commercialData?.products ?? []
  const syncedIds = new Set(syncedProducts.map(p => p.menuprod_id))
  const unsyncedProducts = commercialProducts.filter(p => !syncedIds.has(p.id))

  const { mutate: addAllProducts, isPending: loadingAddAll } = useAddAllWithRefetch(
    syncManyProducts,
    refetchSynced,
    'productos'
  )


  const handleAddProduct = async (product: typeof commercialProducts[number]) => {
    const payload: IProduct = {
      company_id: product.company_id,
      product: product.product,
      menuprod_id: product.id
    }

    start(product.id)
    try {
      await addProductMutation.mutateAsync(payload)
    } catch {
      message.error(`Error al agregar producto: ${product.product}`)
    }
    stop()
  }

  const handleAddAll = () => {
    // addAll(unsyncedProducts.map(p => ({
    //   company_id: p.company_id,
    //   product: p.product,
    //   menuprod_id: p.id
    // })))

    const payload: IProduct[] = unsyncedProducts.map(p => ({
      company_id: p.company_id,
      product: p.product,
      menuprod_id: p.id
    }))

    addAllProducts(payload)
  }

  const filteredSyncedProducts = useMemo(() => {
    return [...syncedProducts]
      .filter(p => p.product.toLowerCase().includes(searchSynced.toLowerCase()))
      .sort((a, b) => a.product.localeCompare(b.product))
  }, [searchSynced, syncedProducts])

  const filteredUnsyncedProducts = useMemo(() => {
    return [...unsyncedProducts]
      .filter(p => p.product.toLowerCase().includes(searchUnsynced.toLowerCase()))
      .sort((a, b) => a.product.localeCompare(b.product))
  }, [searchUnsynced, unsyncedProducts])

  return (
    <div className="space-y-6">
      {contextHolder}

      <Card
        title={
          <Space>
            <Title level={4} className="!mb-0">Productos registrados</Title>
            <Button
              type="link"
              icon={showRegistered ? <UpOutlined /> : <DownOutlined />}
              onClick={() => setShowRegistered(!showRegistered)}
            >
              {showRegistered ? 'Colapsar' : 'Expandir'}
            </Button>
          </Space>
        }
      >
        {showRegistered && (
          <>
            <Search
              placeholder="Buscar producto registrado"
              allowClear
              onChange={(e) => setSearchSynced(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <div style={{ maxHeight: 250, overflowY: 'auto' }}>
              <Table
                rowKey="id"
                loading={loadingSynced}
                dataSource={filteredSyncedProducts}
                columns={[{ title: 'Nombre del producto', dataIndex: 'product' }]}
                pagination={false}
                size="small"
              />
            </div>
          </>
        )}
      </Card>

      <Divider plain />

      <Card title={<Title level={4} className="!mb-0">Productos disponibles para agregar</Title>}>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<SyncOutlined />} onClick={() => refetch()} loading={loadingCommercial}>
            Sincronizar nuevos productos
          </Button>
          {unsyncedProducts.length > 0 && (
            <Button
              type="primary"
              icon={loadingAddAll ? <Spin size="small" /> : <PlusOutlined />}
              onClick={handleAddAll}
              disabled={loadingAddAll}
            >
              {loadingAddAll ? 'Agregando...' : 'Agregar todos'}
            </Button>
          )}
        </Space>

        <Search
          placeholder="Buscar producto para agregar"
          allowClear
          onChange={(e) => setSearchUnsynced(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        {(filteredUnsyncedProducts.length === 0 && searchUnsynced.trim() === '' )? (
          <Alert
            message="✅ ¡Todos los productos están sincronizados!"
            type="success"
            showIcon
          />
        ) : (
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            <Table
              rowKey="id"
              dataSource={filteredUnsyncedProducts}
              loading={loadingCommercial}
              columns={[
                { title: 'Producto disponible', dataIndex: 'product' },
                {
                  title: 'Acción',
                  render: (_, record) => (
                    <Button
                      icon={isLoading(record.id) ? <Spin size="small" /> : <PlusOutlined />}
                      onClick={() => handleAddProduct(record)}
                      loading={isLoading(record.id)}
                      disabled={isLoading(record.id) || loadingAddAll}
                    >
                      {isLoading(record.id) ? 'Agregando...' : 'Agregar producto'}
                    </Button>
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Card>
    </div>
  )
}
