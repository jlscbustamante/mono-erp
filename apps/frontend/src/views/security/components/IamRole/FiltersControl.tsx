import { Button } from 'antd'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { useRecoilState } from 'recoil'

import { FilterAddButton, UserFilters } from '@/components'
import {
  mapKeyFilterIamRole,
  validIIamRole,
} from '@/data/security/IamRole/const/mapKeyFilterIamRole'
import { filterIamRoleSt } from '@/data/security/IamRole/state/IamRole'

export const RequestsFilters: React.FC<{
  applyFilters: () => void
  cleanFilters: () => void
}> = ({ applyFilters, cleanFilters }) => {
  const [userFilters, setUserFilters] = useRecoilState(filterIamRoleSt)
  return (
    <div className="flex items-center gap-1.5 justify-end my-6">
      <div className="flex flex-1 gap-1">
        <FilterAddButton
          userFilters={userFilters}
          setUserFilters={setUserFilters}
          items={validIIamRole()}
          getFilterTypesForKey={mapKeyFilterIamRole}
        />
        <UserFilters
          userFilters={userFilters}
          setFilters={setUserFilters}
          items={validIIamRole()}
          getFilterTypesForKey={mapKeyFilterIamRole}
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
