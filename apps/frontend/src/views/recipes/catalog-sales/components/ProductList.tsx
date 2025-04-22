import { useQuery } from '@tanstack/react-query'
import {
  Table,
  Button,
  Space,
  Typography,
  message,
  Spin,
  Alert,
  Input,
  Card,
  Drawer
} from 'antd'
import {
  PlusOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { useState, useMemo } from 'react'

import { useCatalogSyncQuery } from '../hooks/useCatalogSyncQuery'
import { getProductsFromDB, syncProduct } from '../services/catalogSalesApi'
import { IProduct } from '../../shared/types'
import { useItemLoading } from '../hooks/useItemLoading'
import { ICommercialProduct } from '../types/catalog'

import { useAddAllWithRefetch  } from '../hooks/useAddAllWithFeedback'
import { SyncProductWithSizesAndFlavorsDto } from '../../shared/dtos/Catalog.dto'

const { Title } = Typography
const { Search } = Input

export default function ProductList() {
  const [, contextHolder] = message.useMessage()
  const [showRegistered, ] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchSynced, setSearchSynced] = useState('')
  const [searchUnsynced, setSearchUnsynced] = useState('')
  

  const { isLoading, start, stop } = useItemLoading()

  const {
    data: syncedProducts = [],
    isLoading: loadingSynced,
    refetch: refetchSynced
  } = useQuery<IProduct[]>({
    queryKey: ['products-synced'],
    queryFn: getProductsFromDB
  })

  const {
    data: commercialData,
    isLoading: loadingCommercial,
    refetch
  } = useCatalogSyncQuery()

  const commercialFlavors = commercialData?.flavors ?? []
  const commercialSizes = commercialData?.sizes ?? []

  const commercialProducts = commercialData?.products ?? []
  const syncedIds = new Set(syncedProducts.map((p) => p.menuprod_id))
  const unsyncedProducts = commercialProducts.filter((p) => !syncedIds.has(p.id))

  const handleToggleDrawer = async () => {
    await refetch()
    setIsDrawerOpen((prev) => !prev)
  }

  const { mutate: addAllProducts, isPending: loadingAddAll } = useAddAllWithRefetch(async () => {
    await Promise.all([refetch(), refetchSynced()])
  })

  const handleAddAllProducts = async() =>{

    const productsWithSizesAndFlavors: SyncProductWithSizesAndFlavorsDto[] = unsyncedProducts.map<SyncProductWithSizesAndFlavorsDto>((product) => ({
        product: {
          product: product.product,
          menuprod_id: product.id,
          company_id: product.company_id
        },
        sizes: product.size_id?.map((size) => {
          const sizeOfProduct = commercialSizes.find((s)=> s.id === size.id)!;
          return {
            company_id: sizeOfProduct.company_id,
            menusize_id: sizeOfProduct.id,
            size: sizeOfProduct.size,
          }
        }) ?? [],
        flavors: product.flavor_id?.map((flavor) => {
          const flavorOfProduct = commercialFlavors.find((f)=> f.id === flavor.id)!;

          return{
            company_id: flavorOfProduct.company_id,
            menuflav_id: flavorOfProduct.id,
            flavor: flavorOfProduct.flavor,
          }
        }) ?? []
      }))

    console.log(productsWithSizesAndFlavors)
    addAllProducts(productsWithSizesAndFlavors)

  }

  const handleAddProduct = async (product: ICommercialProduct) => {
    start(product.id)

    const productWithSizesAndFlavors : SyncProductWithSizesAndFlavorsDto = {
      product: {
        product: product.product,
        menuprod_id: product.id,
        company_id: product.company_id
      },
      sizes: product.size_id?.map((size) => {
        const sizeOfProduct = commercialSizes.find((s)=> s.id === size.id)!;
        return {
          company_id: sizeOfProduct.company_id,
          menusize_id: sizeOfProduct.id,
          size: sizeOfProduct.size,
        }
      }) ?? [],
      flavors: product.flavor_id?.map((flavor) => {
        const flavorOfProduct = commercialFlavors.find((f)=> f.id === flavor.id)!;

        return{
          company_id: flavorOfProduct.company_id,
          menuflav_id: flavorOfProduct.id,
          flavor: flavorOfProduct.flavor,
        }
      }
      ) ?? []
    }
    try {
      // 1. Registrar producto
      await syncProduct(productWithSizesAndFlavors)
      message.success(`✅ "${product.product}", tamaños y sabores sincronizados`)
      await refetchSynced()
      await refetch()
    } catch {
      message.error(`❌ Error al agregar "${product.product}"`)
    }

    stop()
  }

  const filteredSyncedProducts = useMemo(() => {
    return [...syncedProducts]
      .filter((p) => p.product.toLowerCase().includes(searchSynced.toLowerCase()))
      .sort((a, b) => a.product.localeCompare(b.product))
  }, [searchSynced, syncedProducts])

  const filteredUnsyncedProducts = useMemo(() => {
    return [...unsyncedProducts]
      .filter((p) => p.product.toLowerCase().includes(searchUnsynced.toLowerCase()))
      .sort((a, b) => a.product.localeCompare(b.product))
  }, [searchUnsynced, unsyncedProducts])

  return (
    <div className="space-y-6">
      {contextHolder}

      <Card
        title={
          <Space>
            <Title level={4} className="!mb-0">
              Productos registrados
            </Title>
            {/* <Button
              type="link"
              icon={showRegistered ? <UpOutlined /> : <DownOutlined />}
              onClick={() => setShowRegistered(!showRegistered)}
            >
              {showRegistered ? 'Colapsar' : 'Expandir'}
            </Button> */}
            <Button
              icon={<SyncOutlined />}
              onClick={handleToggleDrawer}
              loading={loadingCommercial}
              type="link"
            >
              {isDrawerOpen
                ? 'Ocultar productos disponibles'
                : 'Sincronizar nuevos productos'}
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
            <div style={{ maxHeight: 600 ,overflowY: 'auto' }}>
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

      <Drawer
        title="Productos disponibles para agregar"
        placement="right"
        width={500}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <Search
          placeholder="Buscar producto para agregar"
          allowClear
          onChange={(e) => setSearchUnsynced(e.target.value)}
          style={{ marginBottom: 12 }}
        />

      {filteredUnsyncedProducts.length > 0 && (
        <Button
        type="primary"
        icon={loadingAddAll ? <Spin size="small" /> : <PlusOutlined />}
        onClick={() => handleAddAllProducts()}
        disabled={loadingAddAll}
        style={{ marginBottom: 12 }}
        block
      >
        {loadingAddAll ? 'Agregando todos...' : 'Agregar todos'}
      </Button>
      )}

        {filteredUnsyncedProducts.length === 0 && searchUnsynced.trim() == "" ? (
          <Alert message="✅ ¡Todos los productos están sincronizados!" type="success" showIcon />
        ) : (
          <div style={{ maxHeight: 1000, overflowY: 'auto' }}>
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
                      disabled={isLoading(record.id)}
                    >
                      {isLoading(record.id) ? 'Agregando...' : 'Agregar'}
                    </Button>
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Drawer>
    </div>
  )
}
