import { Button, Input } from 'antd'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { useRecoilState } from 'recoil'

import { AddFilterButton } from '@/components/filter/AddFilterButton'
import { ShowFilters } from '@/components/filter/ShowFilters'
import { OpFilter } from '@/data/types/Filters'

import { filtersSupplierAtom } from './useSupplier'

const items = [
  {
    label: 'Id',
    key: 'id',
    options: [OpFilter.Equal],
  },
  {
    label: 'RUC',
    key: 'legal_number',
    options: [OpFilter.Contain],
  },
  {
    label: 'Estado',
    key: 'status',
    options: [OpFilter.Select],
    selection: [
      { label: 'Activo', value: 1 },
      { label: 'Inactivo', value: 0 },
    ],
  },
]

export const ControlProvider = ({
  openModal,
  filters,
  reload,
}: {
  openModal: () => void
  filters: {
    filterName: string
    setFilterName: (filterName: string) => void
  }
  reload: (clean?: boolean) => void
}) => {
  const [filters2, setFilters2] = useRecoilState(filtersSupplierAtom)

  return (
    <div className="flex justify-between">
      <div className="flex gap-1">
        <Input
          className="w-80"
          placeholder="Buscar por nombre o razon social"
          addonBefore="Nombre"
          value={filters.filterName}
          onChange={(e) => filters.setFilterName(e.target.value)}
          onPressEnter={() => {
            reload()
          }}
        />
        <AddFilterButton
          items={items}
          userFilters={filters2}
          setUserFilters={setFilters2}
        />
        <ShowFilters
          rootClass="flex gap-1"
          options={items}
          userFilters={filters2}
          setUserFilters={setFilters2}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<FiSearch />}
          onClick={() => reload()}
          className="flex items-center justify-center"
        />
        <Button
          type="primary"
          color="danger"
          shape="circle"
          icon={<MdOutlineCleaningServices />}
          onClick={() => {
            reload(true)
            // store.setFilters({})
            // store.setWasUpdatedOrCreated()
            // store.addControlLoadPurchase()
          }}
          danger
        />
      </div>
      <Button className="flex items-center" type="primary" onClick={openModal}>
        Nuevo
      </Button>
    </div>
  )
}
