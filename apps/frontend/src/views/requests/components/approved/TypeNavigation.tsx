import { Badge, Tabs } from 'antd'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
  approvedTypeFilterSt,
  countFiltersApprovedSt,
  RequestType,
} from '@/data/requests'

import { ButtonExport } from './ButtonExport'

export const TypeNavigation = () => {
  const [typeFilter, setTypeFilter] = useRecoilState(approvedTypeFilterSt)
  const countFilters = useRecoilValue(countFiltersApprovedSt)

  return (
    <>
      <div>
        {' '}
        <Tabs
          tabBarExtraContent={<ButtonExport />}
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
        />
      </div>
    </>
  )
}
