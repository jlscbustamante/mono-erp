import { PATHS } from '@/const/paths'
import { viewClient } from '@/lib/rpc'
import { SearchOutlined } from '@ant-design/icons'
import {
  AdmPaymentOrderSelect,
  AdmReqNondocsSelect,
  AdmRequirementSelect,
  IAdmSearchAll,
  PAYMENT_STATUS,
} from '@types'
import {
  Button,
  Card,
  Empty,
  Input,
  List,
  Spin,
  Tabs,
  Tag,
  Typography,
} from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { TabPane } = Tabs
const { Text, Title } = Typography

export function ConsultaRequerimientoPage() {
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultados, setResultados] = useState<IAdmSearchAll | null>(null)
  const [buscado, setBuscado] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async () => {
    if (!searchText.trim()) return

    setLoading(true)
    setBuscado(true)

    try {
      // Llamada a la API utilizando viewClient
      const response = await viewClient.api.view.payment.search_all.$get({
        query: { text: searchText },
      })

      const data = await response.json()
      setResultados(data.data as IAdmSearchAll)
    } catch (error) {
      console.error('Error al buscar:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequirementClick = (id: number) => {
    navigate(PATHS.erp.modulos.pagos.revisar.replace(':id', id.toString()))
  }

  const totalResultados = resultados
    ? resultados.requirements.length +
      resultados.payment_orders.length +
      resultados.req_nondocs.length
    : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case PAYMENT_STATUS.APPROVED:
        return 'green'
      case PAYMENT_STATUS.REGISTERED:
        return 'blue'
      case PAYMENT_STATUS.SCHEDULED:
        return 'orange'
      case PAYMENT_STATUS.SENT_TO_BANK:
        return 'cyan'
      case PAYMENT_STATUS.PAID:
        return 'purple'
      case PAYMENT_STATUS.REJECTED:
        return 'red'
      case PAYMENT_STATUS.CANCELED:
        return 'gray'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case PAYMENT_STATUS.APPROVED:
        return 'Aprobado'
      case PAYMENT_STATUS.REGISTERED:
        return 'Registrado'
      case PAYMENT_STATUS.SCHEDULED:
        return 'Programado'
      case PAYMENT_STATUS.SENT_TO_BANK:
        return 'Enviado al banco'
      case PAYMENT_STATUS.PAID:
        return 'Pagado'
      case PAYMENT_STATUS.REJECTED:
        return 'Rechazado'
      case PAYMENT_STATUS.CANCELED:
        return 'Anulado'
      default:
        return 'Desconocido'
    }
  }

  return (
    <div className="p-3 bg-blue-50 min-h-screen">
      <Card className="mb-4">
        <Title level={4}>Búsqueda Global</Title>
        <div style={{ display: 'flex', marginBottom: '16px' }}>
          <Input
            placeholder="Ingrese texto a buscar (código, descripción, etc.)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ marginRight: '10px' }}
            allowClear
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading}
          >
            Buscar
          </Button>
        </div>
      </Card>

      {loading && (
        <div className="text-center my-5">
          <Spin size="large" />
          <div className="mt-3">Buscando resultados...</div>
        </div>
      )}

      {buscado && !loading && (
        <>
          {resultados && totalResultados > 0 ? (
            <Card>
              <Text className="mb-3 block">
                Se encontraron <Tag color="blue">{totalResultados}</Tag>{' '}
                resultados para:
                <Tag color="green" className="ml-2">
                  {searchText}
                </Tag>
              </Text>

              <Tabs defaultActiveKey="requirements">
                <TabPane
                  tab={`Requerimientos (${resultados.requirements.length})`}
                  key="requirements"
                >
                  <List
                    dataSource={resultados.requirements}
                    renderItem={(item: AdmRequirementSelect) => (
                      <List.Item>
                        <Card style={{ width: '100%' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>
                              <Text
                                strong
                                className="text-blue-500 hover:underline cursor-pointer"
                                onClick={() => handleRequirementClick(item.id)}
                              >
                                {item.request_code}
                              </Text>
                              <br />
                              <Text>{item.description}</Text>
                              {item.legal_name && (
                                <>
                                  <br />
                                  <Text type="secondary">
                                    Proveedor: {item.legal_name}
                                  </Text>
                                </>
                              )}
                              {item.num_document && (
                                <>
                                  <br />
                                  <Text type="secondary">
                                    Documento: {item.num_document}
                                  </Text>
                                </>
                              )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <Tag color={getStatusColor(item.status)}>
                                {getStatusText(item.status)}
                              </Tag>
                              <br />
                              <Text type="secondary">
                                {new Date(item.created_at).toLocaleDateString()}
                              </Text>
                            </div>
                          </div>
                        </Card>
                      </List.Item>
                    )}
                    locale={{
                      emptyText: (
                        <Empty description="No se encontraron requerimientos" />
                      ),
                    }}
                  />
                </TabPane>

                <TabPane
                  tab={`Órdenes de Pago (${resultados.payment_orders.length})`}
                  key="payment_orders"
                >
                  <List
                    dataSource={resultados.payment_orders}
                    renderItem={(item: AdmPaymentOrderSelect) => (
                      <List.Item>
                        <Card style={{ width: '100%' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>
                              <Text strong>Orden #{item.id}</Text>
                              <br />
                              <Text>Cuenta: {item.bankaccount_name}</Text>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <Tag color={getStatusColor(item.status)}>
                                {getStatusText(item.status)}
                              </Tag>
                              <br />
                              <Text type="secondary">
                                {new Date(item.created_at).toLocaleDateString()}
                              </Text>
                            </div>
                          </div>
                        </Card>
                      </List.Item>
                    )}
                    locale={{
                      emptyText: (
                        <Empty description="No se encontraron órdenes de pago" />
                      ),
                    }}
                  />
                </TabPane>

                <TabPane
                  tab={`Transferencia/anticipos (${resultados.req_nondocs.length})`}
                  key="req_nondocs"
                >
                  <List
                    dataSource={resultados.req_nondocs}
                    renderItem={(item: AdmReqNondocsSelect) => (
                      <List.Item>
                        <Card style={{ width: '100%' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>
                              <Text strong>{item.request_code}</Text>
                              <br />
                              <Text>{item.description}</Text>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <Tag color={getStatusColor(item.status)}>
                                {getStatusText(item.status)}
                              </Tag>
                              <br />
                              <Text type="secondary">
                                {new Date(item.created_at).toLocaleDateString()}
                              </Text>
                            </div>
                          </div>
                        </Card>
                      </List.Item>
                    )}
                    locale={{
                      emptyText: (
                        <Empty description="No se encontraron requisitos no-documentarios" />
                      ),
                    }}
                  />
                </TabPane>
              </Tabs>
            </Card>
          ) : (
            <Empty
              description={
                <span>
                  No se encontraron resultados para:{' '}
                  <Tag color="red">{searchText}</Tag>
                </span>
              }
            />
          )}
        </>
      )}
    </div>
  )
}
