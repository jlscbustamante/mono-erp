import { Button } from 'antd'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
//import { useRecoilState } from 'recoil'

import { FilterAddButton, UserFilters } from '@/components'
import { filterInvRecipeSt } from '../state/recipe'

import { useRecoilState } from 'recoil'
import {
  mapKeyFilterInvRecipe,
  validInvRecipe,
} from '../constants/mapKeyFiltertype'

export const RequestsFilters: React.FC<{
  applyFilters: () => void
  cleanFilters: () => void
}> = ({ applyFilters, cleanFilters }) => {
  const [userFilters, setUserFilters] = useRecoilState(filterInvRecipeSt)
  //const [filterInvRecipeSt, setFilterInvRecipeSt] = useState<Filters<InvRecipeFilter>>({})

  return (
    <div className="flex items-center gap-1.5 justify-end my-6">
      <div className="flex flex-1 gap-1">
        <FilterAddButton
          userFilters={userFilters}
          setUserFilters={setUserFilters}
          items={validInvRecipe()}
          getFilterTypesForKey={mapKeyFilterInvRecipe}
        />
        <UserFilters
          userFilters={userFilters}
          setFilters={setUserFilters}
          items={validInvRecipe()}
          getFilterTypesForKey={mapKeyFilterInvRecipe}
          selections={{
            status: [
              { label: 'Activo', value: 'A' },
              { label: 'Inactivo', value: 'E' },
            ],
            company_id: [
              {
                label: 'Pizza Raúl',
                value: 'P',
              },
              {
                label: 'Steak house',
                value: 'S',
              },
            ],
            type_mov: [
              {
                label: 'Venta',
                value: 'V',
              },
              { label: 'Gasto', value: 'G' },
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
