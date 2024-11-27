import { Button } from 'antd'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { useRecoilState } from 'recoil'

import { FilterAddButton, UserFilters } from '@/components'
import {
  mapKeyFilter,
  validCashAccount,
} from '@/data/cashAccount/const/mapKeyFilter'
import { filterCashAccountSt } from '@/data/cashAccount/state/cashAccount'

export const RequestsFilters: React.FC<{
  applyFilters: () => void
  cleanFilters: () => void
}> = ({ applyFilters, cleanFilters }) => {
  const [userFilters, setUserFilters] = useRecoilState(filterCashAccountSt)
  return (
    <div className="flex items-center gap-1.5 justify-end my-6">
      <div className="flex flex-1 gap-1">
        <FilterAddButton
          userFilters={userFilters}
          setUserFilters={setUserFilters}
          items={validCashAccount()}
          getFilterTypesForKey={mapKeyFilter}
        />
        <UserFilters
          userFilters={userFilters}
          setFilters={setUserFilters}
          items={validCashAccount()}
          getFilterTypesForKey={mapKeyFilter}
          selections={{
            status: [
              { label: 'Activo', value: 'A' },
              { label: 'Inactivo', value: 'E' },
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
