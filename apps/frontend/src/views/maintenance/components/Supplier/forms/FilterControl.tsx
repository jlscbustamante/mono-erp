import { Button } from 'antd'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { useRecoilState } from 'recoil'

import { FilterAddButton, UserFilters } from '@/components'
import {
  mapKeyFilterSupplier,
  validSupplier,
} from '@/data/maintenance/Supplier/const/mapKeyFilterSupplier'
import { filterSupplierSt } from '@/data/maintenance/Supplier/state/supplier'
export const RequestsFilters: React.FC<{
  applyFilters: () => void
  cleanFilters: () => void
  small?: boolean
}> = ({ applyFilters, cleanFilters, small }) => {
  const [userFilters, setUserFilters] = useRecoilState(filterSupplierSt)
  return (
    <div
      className={`flex items-center gap-1.5 justify-end ${
        small === true ? '' : 'my-6'
      }`}
    >
      <div className="flex flex-1 gap-1">
        <FilterAddButton
          userFilters={userFilters}
          setUserFilters={setUserFilters}
          items={validSupplier()}
          getFilterTypesForKey={mapKeyFilterSupplier}
        />
        <UserFilters
          userFilters={userFilters}
          setFilters={setUserFilters}
          items={validSupplier()}
          getFilterTypesForKey={mapKeyFilterSupplier}
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
