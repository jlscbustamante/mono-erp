import { Button } from 'antd'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { useRecoilState } from 'recoil'

import { FilterAddButton, UserFilters } from '@/components'
import {
  mapKeyFilterSucursal,
  validSucursal,
} from '@/data/maintenance/Sucursal/const/mapKeyFilterSucursal'
import { filterSucursalSt } from '@/data/maintenance/Sucursal/state/filters'
export const RequestsFilters: React.FC<{
  applyFilters: () => void
  cleanFilters: () => void
}> = ({ applyFilters, cleanFilters }) => {
  const [userFilters, setUserFilters] = useRecoilState(filterSucursalSt)
  return (
    <div className="flex items-center gap-1.5 justify-end my-6">
      <div className="flex flex-1 gap-1">
        <FilterAddButton
          userFilters={userFilters}
          setUserFilters={setUserFilters}
          items={validSucursal()}
          getFilterTypesForKey={mapKeyFilterSucursal}
        />
        <UserFilters
          userFilters={userFilters}
          setFilters={setUserFilters}
          items={validSucursal()}
          getFilterTypesForKey={mapKeyFilterSucursal}
          selections={{
            status: [
              { label: 'Activo', value: 1 },
              { label: 'Inactivo', value: 0 },
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
