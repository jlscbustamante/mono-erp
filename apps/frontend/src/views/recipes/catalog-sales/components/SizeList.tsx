import { useQuery } from '@tanstack/react-query'
import {
  Table, Button, Space, Typography, Divider, message, Spin, Alert, Input, Card
} from 'antd'
import { PlusOutlined, SyncOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState, useMemo } from 'react'

import { useCatalogSyncQuery } from '../hooks/useCatalogSyncQuery'
import { getSizesFromDB, syncManySizes } from '../services/catalogSalesApi'
import { IProductSize } from '../../shared/types'
import { useAddSize } from '../hooks/useAddSize'
import {  useAddAllWithRefetch } from '../hooks/useAddAllWithFeedback'
import { useItemLoading } from '../hooks/useItemLoading'

const { Title } = Typography
const { Search } = Input

export default function SizeList() {
  const [messageApi, contextHolder] = message.useMessage()
  const [showRegistered, setShowRegistered] = useState(true)
  const [searchSynced, setSearchSynced] = useState('')
  const [searchUnsynced, setSearchUnsynced] = useState('')

  const addSizeMutation = useAddSize()
  const { isLoading, start, stop } = useItemLoading()


  const { data: syncedSizes = [], isLoading: loadingSynced, refetch: refetchSynced } = useQuery<IProductSize[]>({
    queryKey: ['sizes-synced'],
    queryFn: getSizesFromDB
  })

  const { data: commercialData, isLoading: loadingCommercial, refetch } = useCatalogSyncQuery()
  const commercialSizes = commercialData?.sizes ?? []
  const syncedMenuSizeIds = new Set(syncedSizes.map(s => s.menusize_id))
  const unsyncedSizes = commercialSizes.filter(s => !syncedMenuSizeIds.has(s.id))

  const { mutate: addAllSizes, isPending: loadingAddAll } = useAddAllWithRefetch(
    syncManySizes,
    refetchSynced,
    'tamaños'
  )
  

  const handleAddSize = async (size: typeof commercialSizes[number]) => {
    const payload: IProductSize = {
      company_id: size.company_id,
      size: size.size,
      menusize_id: size.id
    }

    start(size.id)
    try {
      await addSizeMutation.mutateAsync(payload)
    } catch {
      message.error(`Error al agregar tamaño: ${size.size}`)
    }
    stop()
  }

  const handleAddAll = async () => {    
    const payload: IProductSize[] = unsyncedSizes.map(size => ({
      company_id: size.company_id,
      size: size.size,
      menusize_id: size.id
    }))

    addAllSizes(payload)
  }

  const filteredSyncedSizes = useMemo(() => {
    return [...syncedSizes]
      .filter(s => s.size.toLowerCase().includes(searchSynced.toLowerCase()))
      .sort((a, b) => a.size.localeCompare(b.size))
  }, [searchSynced, syncedSizes])
  
  const filteredUnsyncedSizes = useMemo(() => {
    return [...unsyncedSizes]
      .filter(s => s.size.toLowerCase().includes(searchUnsynced.toLowerCase()))
      .sort((a, b) => a.size.localeCompare(b.size))
  }, [searchUnsynced, unsyncedSizes])

  return (
    <div className="space-y-6">
      {contextHolder}

      <Card
        title={
          <Space>
            <Title level={4} className="!mb-0">Tamaños registrados</Title>
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
              placeholder="Buscar tamaño registrado"
              allowClear
              onChange={(e) => setSearchSynced(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <div style={{ maxHeight: 250, overflowY: 'auto' }}>
              <Table
                rowKey="id"
                loading={loadingSynced}
                dataSource={filteredSyncedSizes}
                columns={[{ title: 'Nombre del tamaño', dataIndex: 'size' }]}
                pagination={false}
                size="small"
              />
            </div>
          </>
        )}
      </Card>

      <Divider plain />

      <Card title={<Title level={4} className="!mb-0">Tamaños disponibles para agregar</Title>}>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<SyncOutlined />} onClick={() => refetch()} loading={loadingCommercial}>
            Sincronizar nuevos tamaños
          </Button>
          {unsyncedSizes.length > 0 && (
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
          placeholder="Buscar tamaño para agregar"
          allowClear
          onChange={(e) => setSearchUnsynced(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        {filteredUnsyncedSizes.length === 0 && searchUnsynced.trim() === ''? (
          <Alert
            message="✅ ¡Todos los tamaños están sincronizados!"
            type="success"
            showIcon
          />
        ) : (
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            <Table
              rowKey="id"
              dataSource={filteredUnsyncedSizes}
              loading={loadingCommercial}
              columns={[
                { title: 'Tamaño disponible', dataIndex: 'size' },
                {
                  title: 'Acción',
                  render: (_, record) => (
                    <Button
                      icon={isLoading(record.id) ? <Spin size="small" /> : <PlusOutlined />}
                      onClick={() => handleAddSize(record)}
                      loading={isLoading(record.id)}
                      disabled={isLoading(record.id) || loadingAddAll}
                    >
                      {isLoading(record.id) ? 'Agregando...' : 'Agregar tamaño'}
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
