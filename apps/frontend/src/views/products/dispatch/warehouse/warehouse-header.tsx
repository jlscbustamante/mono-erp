import { AddFilterButton } from '@/components/filter/AddFilterButton'
import { FiltersOption, ShowFilters } from '@/components/filter/ShowFilters'
import { Button } from 'antd'
import { useAtom, useSetAtom } from 'jotai'
import { Sucursal } from 'pizzadb'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { OpFilter } from 'shared'
import { useCreateWarehouse } from './create-drawer'
import { controlerAtom, filtersAtom } from './state'

const filtersOptions: FiltersOption<Sucursal>[] = [
  {
    label: 'Codigo',
    key: 'id',
    options: [OpFilter.Equal, OpFilter.Contain],
  },
  {
    label: 'Tienda',
    key: 'title',
    options: [OpFilter.Contain, OpFilter.Equal],
  },
  {
    label: 'Direccion',
    key: 'ubi_address',
    options: [OpFilter.Contain, OpFilter.Equal],
  },
  {
    label: 'Tipo',
    key: 'type_sede',
    options: [OpFilter.Select],
    selection: [
      {
        label: 'Tienda',
        value: 'T',
      },
      {
        label: 'Almacen',
        value: 'W',
      },
    ],
  },
  {
    label: 'RUC',
    key: 'legalperson_docnum',
    options: [OpFilter.Contain, OpFilter.Equal],
  },
]

export const WarehouseHeader = () => {
  const [filters, setFilters] = useAtom(filtersAtom)
  const setController = useSetAtom(controlerAtom)
  const { open } = useCreateWarehouse()

  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-1">
        <AddFilterButton
          items={filtersOptions as any}
          setUserFilters={setFilters as any}
          userFilters={filters}
        />
        <ShowFilters
          rootClass="flex gap-1 items-center"
          options={filtersOptions as any}
          userFilters={filters}
          setUserFilters={setFilters as any}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<FiSearch />}
          onClick={() => setController((val) => val + 1)}
        />
        <Button
          type="primary"
          color="danger"
          shape="circle"
          icon={<MdOutlineCleaningServices />}
          onClick={() => setFilters({})}
          danger
        />
      </div>
      <Button type="primary" onClick={open}>
        Nuevo
      </Button>
    </div>
  )
}
