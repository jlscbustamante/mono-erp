// catalog-sales/components/ProductList.tsx
import {
  Table,
  Button,
  Space,
  Typography,
  message,
  Input,
  Card,
  Select,
  Row,
  Col,
} from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getProductsFromDB,
  getCommercialCatalog,
  getFlavorsFromDB,
} from '../services/catalogSalesApi'
import { getCompanies } from '../services/filterDataService'
import {
  ProductSyncedDto,
  SyncProductWithSizesAndFlavorsDto,
} from '../../shared/dtos/Catalog.dto'
import { useSyncProductsModal } from '../hooks/useSyncProductsModal'
import CatalogSyncModal from './CatalogSyncModal'

const { Title } = Typography
const { Search } = Input

export default function ProductList() {
  const [messageApi, contextHolder] = message.useMessage()

  const [search, setSearch] = useState('')
  const [company, setCompany] = useState<string | undefined>()
  //const [category, setCategory] = useState<number | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [flavor, setFlavor] = useState<number | undefined>()

  // 🔄 Productos sincronizados
  const {
    data: products = [],
    isLoading: loadingSynced,
    refetch: refetchSynced,
  } = useQuery<ProductSyncedDto[]>({
    queryKey: ['products-synced'],
    queryFn: getProductsFromDB,
  })

  // 🧠 Hook de sincronización por lote
  const { syncProducts, isSyncing } = useSyncProductsModal(messageApi, () => {
    setIsModalOpen(false)
    refetchSynced()
    refetchCommercial()
  })

  const handleSync = (productsToSync: SyncProductWithSizesAndFlavorsDto[]) => {
    syncProducts(productsToSync)
  }

  // 📦 Catálogo comercial (simulado)
  const {
    data: commercialData = { products: [], flavors: [], sizes: [] },
    isLoading: loadingCommercial,
    refetch: refetchCommercial,
  } = useQuery({
    queryKey: ['catalog-commercial'],
    queryFn: getCommercialCatalog,
  })

  // Filtros adicionales
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
  })

  const { data: flavors = [] } = useQuery({
    queryKey: ['flavors'],
    queryFn: getFlavorsFromDB, // ✅ asegúrate que esté disponible
  })
  const syncedIds = useMemo(
    () => new Set(products.map((p) => `${p.menuprod_id}`)),
    [products],
  )
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.product.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => !company || p.company_id === company)
      .filter((p) => !flavor || p.flavor_id === flavor)
      .sort((a, b) => a.product.localeCompare(b.product))
  }, [products, search, company, flavor])

  return (
    <div className="space-y-6">
      {contextHolder}

      <Card
        title={
          <Space className="w-full justify-between flex">
            <Title level={4} className="!mb-0">
              Productos registrados
            </Title>
            <Button
              icon={<SyncOutlined />}
              type="primary"
              onClick={() => setIsModalOpen(true)}
              loading={loadingCommercial}
            >
              Sincronizar nuevos productos
            </Button>
          </Space>
        }
      >
        <Row gutter={12} className="mb-4">
          <Col span={6}>
            <Select
              placeholder="Filtrar por compañía"
              allowClear
              value={company}
              onChange={setCompany}
              className="w-full"
              options={companies.map((c) => ({
                value: c.id,
                label: c.title,
              }))}
            />
          </Col>
          <Col span={6}>
            <Search
              placeholder="Buscar por nombre"
              allowClear
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Filtrar por sabor"
              allowClear
              value={flavor}
              onChange={setFlavor}
              className="w-full"
              options={flavors.map((f) => ({
                value: f.id,
                label: f.flavor,
              }))}
            />
          </Col>
        </Row>

        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
          <Table
            rowKey="id"
            loading={loadingSynced}
            dataSource={filteredProducts}
            pagination={false}
            size="small"
            columns={[
              { title: 'Compañía', dataIndex: 'company_title' },
              { title: 'Producto', dataIndex: 'product' },
              { title: 'Sabor', dataIndex: 'flavor' },
              { title: 'Tamaño', dataIndex: 'size' },
              {
                title: 'Estado',
                dataIndex: 'status',
                render: (val: number) => (val === 1 ? 'Activo' : 'Inactivo'),
              },
            ]}
          />
        </div>
      </Card>

      <CatalogSyncModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        commercialProducts={commercialData.products}
        commercialFlavors={commercialData.flavors}
        commercialSizes={commercialData.sizes}
        syncedMenuprodIds={syncedIds}
        onSync={handleSync}
        loadingSync={isSyncing}
      />
    </div>
  )
}
