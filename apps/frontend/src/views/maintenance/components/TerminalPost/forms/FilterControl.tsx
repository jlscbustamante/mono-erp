import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { useRecoilState } from 'recoil'

import { FilterAddButton, UserFilters } from '@/components'
import { getSucursal } from '@/data/maintenance/Sucursal/sdk'
import { ISucursal } from '@/data/maintenance/Sucursal/type/Sucursal'
import {
  mapKeyFilterTerminalPost,
  validTerminalPost,
} from '@/data/maintenance/TerminalPost/const/mapKeyFilterTerminalPost'
import { filterITerminalPostSt } from '@/data/maintenance/TerminalPost/state/terminalPost'

export const RequestsFilters: React.FC<{
  applyFilters: () => void
  cleanFilters: () => void
}> = ({ applyFilters, cleanFilters }) => {
  const [userFilters, setUserFilters] = useRecoilState(filterITerminalPostSt)
  const [sucursal, setSucursal] = useState<ISucursal[]>([])

  useEffect(() => {
    async function fetchSucursal() {
      try {
        const data = await getSucursal()
        setSucursal(data)
        console.log('sucursal:', sucursal)
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      }
    }

    fetchSucursal()
  }, [])

  return (
    <div className="flex items-center gap-1.5 justify-end my-6">
      <div className="flex flex-1 gap-1">
        <FilterAddButton
          userFilters={userFilters}
          setUserFilters={setUserFilters}
          items={validTerminalPost()}
          getFilterTypesForKey={mapKeyFilterTerminalPost}
        />
        {sucursal && (
          <UserFilters
            userFilters={userFilters}
            setFilters={setUserFilters}
            items={validTerminalPost()}
            getFilterTypesForKey={mapKeyFilterTerminalPost}
            selections={{
              sucursal_id: sucursal.map((el: ISucursal) => ({
                label: el.title,
                value: el.id,
              })),
              status: [
                { label: 'Activo', value: 1 },
                { label: 'Inactivo', value: 0 },
              ],
              supplier: [
                { label: 'IZIPAY', value: 'IZIPAY' },
                { label: 'CULQI', value: 'CULQI' },
              ],
            }}
          />
        )}
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
