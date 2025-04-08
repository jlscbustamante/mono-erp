import { useQuery } from '@tanstack/react-query'
import {
  Table, Button, Space, Typography, Divider, message, Spin, Alert, Input, Card
} from 'antd'
import { PlusOutlined, SyncOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState, useMemo } from 'react'

import { useCatalogSyncQuery } from '../hooks/useCatalogSyncQuery'
import { getFlavorsFromDB, syncManyFlavors } from '../services/catalogSalesApi'
import { IProductFlavor } from '../../shared/types'
import { useAddFlavor } from '../hooks/useAddFlavor'
import { useAddAllWithRefetch } from '../hooks/useAddAllWithFeedback'
import { useItemLoading } from '../hooks/useItemLoading'

const { Title } = Typography
const { Search } = Input

export default function FlavorList() {
  const [messageApi, contextHolder] = message.useMessage()
  const [showRegistered, setShowRegistered] = useState(true)
  const [searchSynced, setSearchSynced] = useState('')
  const [searchUnsynced, setSearchUnsynced] = useState('')

  const addFlavorMutation = useAddFlavor()
  const { isLoading, start, stop } = useItemLoading()

  const { data: syncedFlavors = [], isLoading: loadingSynced, refetch: refetchSynced } = useQuery<IProductFlavor[]>({
    queryKey: ['flavors-synced'],
    queryFn: getFlavorsFromDB
  })

  const { data: commercialData, isLoading: loadingCommercial, refetch } = useCatalogSyncQuery()
  const commercialFlavors = commercialData?.flavors ?? []
  const syncedFlavorIds = new Set(syncedFlavors.map(f => f.menuflav_id))
  const unsyncedFlavors = commercialFlavors.filter(f => !syncedFlavorIds.has(f.id))

  const { mutate: addAllFlavors, isPending: loadingAddAll } = useAddAllWithRefetch(
    syncManyFlavors,
    refetchSynced,
    'sabores'
  )

  const handleAddFlavor = async (flavor: typeof commercialFlavors[number]) => {
    const payload: IProductFlavor = {
      company_id: flavor.company_id,
      flavor: flavor.flavor,
      menuflav_id: flavor.id
    }

    start(flavor.id)
    try {
      await addFlavorMutation.mutateAsync(payload)
    } catch {
      message.error(`Error al agregar sabor: ${flavor.flavor}`)
    }
    stop()
  }

  const handleAddAll = () => {
    const payload: IProductFlavor[] = unsyncedFlavors.map(flavor => ({
      company_id: flavor.company_id,
      flavor: flavor.flavor,
      menuflav_id: flavor.id
    }))

    addAllFlavors(payload)
  }

  const filteredSyncedFlavors = useMemo(() => {
    return [...syncedFlavors]
      .filter(f => f.flavor.toLowerCase().includes(searchSynced.toLowerCase()))
      .sort((a, b) => a.flavor.localeCompare(b.flavor))
  }, [searchSynced, syncedFlavors])

  const filteredUnsyncedFlavors = useMemo(() => {
    return [...unsyncedFlavors]
      .filter(f => f.flavor.toLowerCase().includes(searchUnsynced.toLowerCase()))
      .sort((a, b) => a.flavor.localeCompare(b.flavor))
  }, [searchUnsynced, unsyncedFlavors])

  return (
    <div className="space-y-6">
      {contextHolder}

      <Card
        title={
          <Space>
            <Title level={4} className="!mb-0">Sabores registrados</Title>
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
              placeholder="Buscar sabor registrado"
              allowClear
              onChange={(e) => setSearchSynced(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <div style={{ maxHeight: 250, overflowY: 'auto' }}>
              <Table
                rowKey="id"
                loading={loadingSynced}
                dataSource={filteredSyncedFlavors}
                columns={[{ title: 'Nombre del sabor', dataIndex: 'flavor' }]}
                pagination={false}
                size="small"
              />
            </div>
          </>
        )}
      </Card>

      <Divider plain />

      <Card title={<Title level={4} className="!mb-0">Sabores disponibles para agregar</Title>}>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<SyncOutlined />} onClick={() => refetch()} loading={loadingCommercial}>
            Sincronizar nuevos sabores
          </Button>
          {unsyncedFlavors.length > 0 && (
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
          placeholder="Buscar sabor para agregar"
          allowClear
          onChange={(e) => setSearchUnsynced(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        {(filteredUnsyncedFlavors.length === 0 && searchUnsynced.trim() === '') ? (
          <Alert
            message="✅ ¡Todos los sabores están sincronizados!"
            type="success"
            showIcon
          />
        ) : (
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            <Table
              rowKey="id"
              dataSource={filteredUnsyncedFlavors}
              loading={loadingCommercial}
              columns={[
                { title: 'Sabor disponible', dataIndex: 'flavor' },
                {
                  title: 'Acción',
                  render: (_, record) => (
                    <Button
                      icon={isLoading(record.id) ? <Spin size="small" /> : <PlusOutlined />}
                      onClick={() => handleAddFlavor(record)}
                      loading={isLoading(record.id)}
                      disabled={isLoading(record.id) || loadingAddAll}
                    >
                      {isLoading(record.id) ? 'Agregando...' : 'Agregar sabor'}
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
