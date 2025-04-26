import {
  Modal,
  Table,
  Button,
  Space,
  Spin,
  Alert,
  Input,
  Select,
  Row,
  Col,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useState, useMemo, useCallback } from 'react'
import {
  ICommercialProduct,
  ICommercialFlavor,
  ICommercialSize,
} from '../types/catalog'
import { SyncProductWithSizesAndFlavorsDto } from '../../shared/dtos/Catalog.dto'
import { buildSyncPayload } from '../utils/buildSyncPayload'
import { buildMenuProdId } from '../utils/helpers'

const { Search } = Input
const { Option } = Select

interface CatalogSyncModalProps {
  open: boolean
  onClose: () => void
  commercialProducts: ICommercialProduct[]
  commercialFlavors: ICommercialFlavor[]
  commercialSizes: ICommercialSize[]
  syncedMenuprodIds: Set<string>
  onSync: (payloads: SyncProductWithSizesAndFlavorsDto[]) => void
  loadingSync: boolean
}

interface SyncCombination {
  key: string
  product: ICommercialProduct
  flavor: ICommercialFlavor
  size: ICommercialSize
}

export default function CatalogSyncModal({
  open,
  onClose,
  commercialProducts,
  commercialFlavors,
  commercialSizes,
  syncedMenuprodIds,
  onSync,
  loadingSync,
}: CatalogSyncModalProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [companyFilter, setCompanyFilter] = useState<string | undefined>()
  const [searchFilter, setSearchFilter] = useState('')
  const simulatedFlavors = useCallback(
    (product: ICommercialProduct): ICommercialFlavor[] => {
      if (!product.flavor_id || product.flavor_id.length === 0) {
        return commercialFlavors.slice(0, 2)
      }
      return product.flavor_id
        .map((f) => commercialFlavors.find((cf) => cf.id === f.id))
        .filter(Boolean) as ICommercialFlavor[]
    },
    [commercialFlavors],
  )

  const combinations = useMemo((): SyncCombination[] => {
    const combos: SyncCombination[] = []

    for (const product of commercialProducts) {
      if (product.category?.toLowerCase() === 'promociones') {
        continue
      }

      const sizes = product.size_id
        .map((s) => commercialSizes.find((cs) => cs.id === s.id))
        .filter(Boolean) as ICommercialSize[]

      const flavors = simulatedFlavors(product)

      for (const size of sizes) {
        for (const flavor of flavors) {
          // 🛠 Armar el menuprod_id igual como en sincronización
          const generatedMenuprodId = buildMenuProdId(product.id, flavor.id, size.id).toString()
          // Si ya existe en los sincronizados, no lo mostramos
          if (syncedMenuprodIds.has(generatedMenuprodId)) {
            continue
          }

          combos.push({
            key: `${product.id}${flavor.id}${size.id}`,
            product,
            flavor,
            size,
          })
        }
      }
    }

    return combos
      .filter((c) =>
        c.product.product.toLowerCase().includes(searchFilter.toLowerCase()),
      )
      .filter((c) => !companyFilter || c.product.company_id === companyFilter)
  }, [
    commercialProducts,
    commercialSizes,
    syncedMenuprodIds,
    simulatedFlavors,
    searchFilter,
    companyFilter,
  ])
  const handleSync = useCallback(() => {
    const selectedCombinations = combinations.filter((c) =>
      selectedRowKeys.includes(c.key),
    )

    const payload = buildSyncPayload(
      selectedCombinations.map((c) => ({
        product: {
          id: c.product.id, // Base ID
          product: c.product.product,
          company_id: c.product.company_id,
          menuprod_id: c.product.id,
          flavor_id: c.flavor.id,
          size_id: c.size.id,
        },
        sizes: [
          {
            company_id: c.size.company_id,
            size: c.size.size,
            menusize_id: c.size.id,
          },
        ],
        flavors: [
          {
            company_id: c.flavor.company_id,
            flavor: c.flavor.flavor,
            menuflav_id: c.flavor.id,
          },
        ],
      })),
    )

    onSync(payload)
  }, [combinations, selectedRowKeys, onSync])

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Productos disponibles para sincronizar"
      width={1000}
    >
      <Row gutter={12} className="mb-4">
        <Col span={6}>
          <Select
            placeholder="Filtrar por compañía"
            allowClear
            value={companyFilter}
            onChange={setCompanyFilter}
            className="w-full"
          >
            {[...new Set(commercialProducts.map((p) => p.company_id))].map(
              (c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ),
            )}
          </Select>
        </Col>
        <Col span={6}>
          <Search
            placeholder="Buscar producto"
            allowClear
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </Col>
      </Row>

      {combinations.length === 0 ? (
        <Alert
          message="✅ ¡Todos los productos están sincronizados!"
          type="success"
          showIcon
        />
      ) : (
        <>
          <Space className="mb-3 justify-end w-full flex">
            <Button
              type="primary"
              icon={loadingSync ? <Spin size="small" /> : <PlusOutlined />}
              onClick={handleSync}
              disabled={selectedRowKeys.length === 0 || loadingSync}
            >
              {loadingSync ? 'Sincronizando...' : 'Sincronizar'}
            </Button>
          </Space>
          <Table
            rowKey="key"
            dataSource={combinations}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            columns={[
              { title: 'Producto', dataIndex: ['product', 'product'] },
              { title: 'Sabor', dataIndex: ['flavor', 'flavor'] },
              { title: 'Tamaño', dataIndex: ['size', 'size'] },
            ]}
            pagination={false}
            size="small"
          />
        </>
      )}
    </Modal>
  )
}
