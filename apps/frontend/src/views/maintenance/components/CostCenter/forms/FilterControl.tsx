import { Button } from 'antd'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { useRecoilState } from 'recoil'

import { FilterAddButton, UserFilters } from '@/components'
import { filterCostCenterSt } from '@/data/costCenter/state/filters'
import {
  mapKeyFilterCostCenter,
  validCostCenter,
} from '@/data/maintenance/CostCenter/const/mapKeyFilterCostCenter'

export const RequestsFilters: React.FC<{
  applyFilters: () => void
  cleanFilters: () => void
}> = ({ applyFilters, cleanFilters }) => {
  const [userFilters, setUserFilters] = useRecoilState(filterCostCenterSt)
  return (
    <div className="flex items-center gap-1.5 justify-end my-6">
      <div className="flex flex-1 gap-1">
        <FilterAddButton
          userFilters={userFilters}
          setUserFilters={setUserFilters}
          items={validCostCenter()}
          getFilterTypesForKey={mapKeyFilterCostCenter}
        />
        <UserFilters
          userFilters={userFilters}
          setFilters={setUserFilters}
          items={validCostCenter()}
          getFilterTypesForKey={mapKeyFilterCostCenter}
          selections={{
            status: [
              { label: 'Activo', value: 1 },
              { label: 'Inactivo', value: 0 },
            ],
            is_cash: [
              { label: 'Si', value: 1 },
              { label: 'No', value: 0 },
            ],
          }}
        />
      </div>
      <Button
        type="primary"
        shape="circle"
        icon={<FiSearch />}
        onClick={applyFilters}
        className="flex items-center justify-center"
      />
      <Button
        type="primary"
        color="danger"
        shape="circle"
        icon={<MdOutlineCleaningServices />}
        onClick={cleanFilters}
        danger
      />
    </div>
  )
}
