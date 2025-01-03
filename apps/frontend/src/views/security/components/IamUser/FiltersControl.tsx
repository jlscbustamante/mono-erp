import { Button, Input } from 'antd'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { useRecoilState } from 'recoil'

import { FilterAddButton, UserFilters } from '@/components'
import {
  mapKeyFilterIamUser,
  validIIamUser,
} from '@/data/security/IamUser/const/mapKeyFilterIamUser'
import { filterIamUserSt } from '@/data/security/IamUser/state/IamUser'
import { OpFilter } from '@/data/types/Filters'

export const RequestsFilters: React.FC<{
  applyFilters: () => void
  cleanFilters: () => void
}> = ({ applyFilters, cleanFilters }) => {
  const [userFilters, setUserFilters] = useRecoilState(filterIamUserSt)
  return (
    <div className="flex items-center gap-1.5 justify-end my-6 flex-1">
      <div className="flex flex-1 gap-1 items-center">
        <Input
          className="w-48"
          placeholder="Nombre"
          value={userFilters.name?.[1]}
          onChange={(e) => {
            setUserFilters({
              ...userFilters,
              name: [OpFilter.Contain, e.target.value],
            })
          }}
        />
        <FilterAddButton
          userFilters={userFilters}
          setUserFilters={setUserFilters}
          items={validIIamUser()}
          getFilterTypesForKey={mapKeyFilterIamUser}
        />
        <UserFilters
          ignore={['name']}
          userFilters={userFilters}
          setFilters={setUserFilters}
          items={validIIamUser()}
          getFilterTypesForKey={mapKeyFilterIamUser}
          selections={{
            status: [
              { label: 'Activo', value: 1 },
              { label: 'Inactivo', value: 0 },
            ],
          }}
        />
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
    </div>
  )
}
