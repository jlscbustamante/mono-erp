import { Button } from 'antd'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
//import { useRecoilState } from 'recoil'
import { Dispatch, SetStateAction } from 'react'

import { FilterAddButton, UserFilters } from '@/components'

import {
  mapKeyFilterInvRecipe,
  validInvRecipe,
} from '../constants/mapKeyFiltertype'
import { Filters } from '../Filters'
import { InvRecipe } from '../shared-types'

export const RequestsFilters: React.FC<{
  applyFilters: () => void
  cleanFilters: () => void
  aUserFilters: Filters<InvRecipe>
  aSetUserFilters: Dispatch<SetStateAction<Filters<InvRecipe>>>
}> = ({ applyFilters, cleanFilters, aUserFilters, aSetUserFilters }) => {
  //const [userFilters, setUserFilters] = useRecoilState(filterInvRecipeSt)
  //const [filterInvRecipeSt, setFilterInvRecipeSt] = useState<Filters<InvRecipeFilter>>({})

  return (
    <div className="flex items-center gap-1.5 justify-end my-6">
      <div className="flex flex-1 gap-1">
        <FilterAddButton
          userFilters={aUserFilters}
          setUserFilters={aSetUserFilters}
          items={validInvRecipe()}
          getFilterTypesForKey={mapKeyFilterInvRecipe}
        />
        <UserFilters
          userFilters={aUserFilters}
          setFilters={aSetUserFilters}
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
