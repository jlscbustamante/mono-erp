import { AddFilterButton } from '@/components/filter/AddFilterButton'
import { FiltersOption, ShowFilters } from '@/components/filter/ShowFilters'
import { Button } from 'antd'
import { useAtom, useSetAtom } from 'jotai'
import { Carrier } from 'pizzadb'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { OpFilter } from 'shared'
import { useCreateDriverDrawer } from './create-driver-drawer'
import { controlerAtom, filtersAtom } from './state'

const filtersOptions: FiltersOption<Carrier>[] = [
  {
    label: 'Id',
    key: 'id',
    options: [OpFilter.Equal, OpFilter.Contain],
  },
  {
    label: 'Compañia',
    key: 'transportName',
    options: [OpFilter.Contain, OpFilter.Equal],
  },
  {
    label: 'Nombre',
    key: 'driverFirstName',
    options: [OpFilter.Contain, OpFilter.Equal],
  },
  {
    label: 'Documento',
    key: 'driverDocNumber',
    options: [OpFilter.Contain, OpFilter.Equal],
  },
  {
    label: 'Estado',
    key: 'status',
    options: [OpFilter.Select],
    selection: [
      {
        label: 'Activo',
        value: '1',
      },
      {
        label: 'Inactivo',
        value: '0',
      },
    ],
  },
  {
    label: 'Placa',
    key: 'transportPlateNumber',
    options: [OpFilter.Contain, OpFilter.Equal],
  },
  {
    label: 'RUC',
    key: 'carrierDocNumber',
    options: [OpFilter.Contain, OpFilter.Equal],
  },
]

export const DriverHeader = () => {
  const { open } = useCreateDriverDrawer()
  const [filters, setFilters] = useAtom(filtersAtom)
  const setController = useSetAtom(controlerAtom)

  return (
    <div className="mb-3 flex justify-between items-center">
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
