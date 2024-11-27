import { Button } from 'antd'
import { useEffect, useState } from 'react' // Importa useState y useEffect
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { useRecoilState } from 'recoil'

import { FilterAddButton, UserFilters } from '@/components'
import {
  mapKeyFilterCourrier,
  validCourrier,
} from '@/data/maintenance/Courrier/const/mapKeyFilterDriver'
import { getCourrierStores } from '@/data/maintenance/Courrier/sdk'
import { filterCourrierSt } from '@/data/maintenance/Courrier/state/courrier'
import { CourrierStore } from '@/data/maintenance/Courrier/type/CourrierStore'
// Importa la función para obtener las tiendas disponibles

export const RequestsFilters: React.FC<{
  applyFilters: () => void
  cleanFilters: () => void
}> = ({ applyFilters, cleanFilters }) => {
  const [userFilters, setUserFilters] = useRecoilState(filterCourrierSt)
  const [stores, setStores] = useState<CourrierStore[]>([])

  useEffect(() => {
    // Carga las tiendas disponibles cuando el componente se monta
    async function fetchCourrierStores() {
      const data = await getCourrierStores()
      const storesData = await data?.json() // Convierte la respuesta a JSON
      setStores(storesData) // Almacena las tiendas disponibles en el estado local
    }

    fetchCourrierStores() // Llama a la función para cargar las tiendas disponibles
  }, []) // Este efecto se ejecuta solo una vez cuando el componente se monta

  return (
    <div className="flex items-center gap-1.5 justify-end my-6">
      <div className="flex flex-1 gap-1">
        <FilterAddButton
          userFilters={userFilters}
          setUserFilters={setUserFilters}
          items={validCourrier()}
          getFilterTypesForKey={mapKeyFilterCourrier}
        />
        <UserFilters
          userFilters={userFilters}
          setFilters={setUserFilters}
          items={validCourrier()}
          getFilterTypesForKey={mapKeyFilterCourrier}
          selections={{
            status: [
              { label: 'Activo', value: 1 },
              { label: 'Inactivo', value: 0 },
            ],
            shift_hired: [
              { label: 'FULL TIME', value: 'FT' },
              { label: 'PART TIME', value: 'PT' },
              { label: 'EVENTUAL', value: 'EV' },
            ],
            stores: stores.map((store) => ({
              label: store.title,
              value: store.title,
              key: store.id,
            })),
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
