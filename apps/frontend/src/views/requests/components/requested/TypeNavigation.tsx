import { Badge, Button, Drawer, Dropdown, Space, Tabs } from 'antd'
import { useState } from 'react'
import { IoChevronDownOutline } from 'react-icons/io5'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
  countFiltersRequestedSt,
  pendingTypeFilterSt,
} from '@/data/requests/state/filters'
import { RequestType } from '@/data/requests/types'

import { ButtonExport, LiquidationForm, SimpleForm, TransferForm } from '.'

export const TypeNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useRecoilState(pendingTypeFilterSt)
  const countFilters = useRecoilValue(countFiltersRequestedSt)
  const [formOpen, setFormOpen] = useState<
    '' | 'simple' | 'transfer' | 'liquidation'
  >('')

  return (
    <>
      <div>
        <Tabs
          onChange={(key: string) => {
            setTypeFilter(key as RequestType)
          }}
          activeKey={typeFilter}
          items={[
            {
              label: (
                <Badge count={countFilters[RequestType.Simple]} size="small">
                  <p className="pr-2">Simple</p>
                </Badge>
              ),
              key: RequestType.Simple,
            },
            {
              label: (
                <Badge count={countFilters[RequestType.Supplier]} size="small">
                  <p className="pr-2">Proveedor</p>
                </Badge>
              ),
              key: RequestType.Supplier,
            },
            {
              label: (
                <Badge count={countFilters[RequestType.Transfer]} size="small">
                  <p className="pr-2">Transferencia</p>
                </Badge>
              ),
              key: RequestType.Transfer,
            },
            {
              label: (
                <Badge
                  count={countFilters[RequestType.Liquidation]}
                  size="small"
                >
                  <p className="pr-2">Liquidación</p>
                </Badge>
              ),
              key: RequestType.Liquidation,
            },
          ]}
          tabBarExtraContent={
            <div className="flex gap-2">
              <ButtonExport />
              <Dropdown
                menu={{
                  items: [
                    {
                      key: '1',
                      label: 'Simple',
                      onClick: () => {
                        setFormOpen('simple')
                        setIsOpen(true)
                      },
                    },
                    {
                      key: '2',
                      label: 'Transferencia',
                      onClick: () => {
                        setFormOpen('transfer')
                        setIsOpen(true)
                      },
                    },
                    {
                      key: '3',
                      label: 'Liquidacion',
                      onClick: () => {
                        setFormOpen('liquidation')
                        setIsOpen(true)
                      },
                    },
                  ],
                }}
              >
                <Button type="primary">
                  <Space>
                    Solicitar requerimiento
                    <IoChevronDownOutline />
                  </Space>
                </Button>
              </Dropdown>
            </div>
          }
        />
      </div>
      {formOpen === 'simple' && (
        <Drawer
          title="Solicitar requerimiento: Simple"
          open={isOpen}
          onClose={() => {
            setIsOpen(false)
            setFormOpen('')
          }}
          width={430}
        >
          <SimpleForm />
        </Drawer>
      )}
      {formOpen === 'transfer' && (
        <Drawer
          title="Solicitar requerimiento: Transferencia"
          open={isOpen}
          onClose={() => {
            setIsOpen(false)
            setFormOpen('')
          }}
          width={430}
        >
          <TransferForm />
        </Drawer>
      )}
      {formOpen === 'liquidation' && (
        <Drawer
          title="Solicitar requerimiento: Liquidacion"
          open={isOpen}
          onClose={() => {
            setIsOpen(false)
            setFormOpen('')
          }}
          width={430}
        >
          <LiquidationForm />
        </Drawer>
      )}
    </>
  )
}
