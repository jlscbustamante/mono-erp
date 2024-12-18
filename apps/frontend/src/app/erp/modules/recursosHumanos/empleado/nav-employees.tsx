import { AddFilterButton } from '@/components/filter/AddFilterButton'
import { FiltersOption, ShowFilters } from '@/components/filter/ShowFilters'
import { Button } from 'antd'
import { useAtom, useSetAtom } from 'jotai'
import { RhEmployee } from 'pizzadb'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { OpFilter } from 'shared'
import { useCreateEmployee } from './create-employee-drawer'
import { controlerAtom, filtersAtom } from './state'

const filtersOptions: FiltersOption<RhEmployee>[] = [
  {
    label: 'Id',
    key: 'id',
    options: [OpFilter.Equal, OpFilter.Contain],
  },
  {
    label: 'Nombre',
    key: 'first_name',
    options: [OpFilter.Contain, OpFilter.Equal],
  },
  {
    label: 'Doc.',
    key: 'doc_number',
    options: [OpFilter.Contain, OpFilter.Equal],
  },
  {
    label: 'Telefono',
    key: 'phone',
    options: [OpFilter.Contain, OpFilter.Equal],
  },
  {
    label: 'Cargo',
    key: 'jobtitle_name',
    options: [OpFilter.Contain, OpFilter.Equal],
  },
]

export const NavEmployees = () => {
  const { open } = useCreateEmployee()
  const [filters, setFilters] = useAtom(filtersAtom)
  const setController = useSetAtom(controlerAtom)

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <AddFilterButton
          items={filtersOptions as any}
          setUserFilters={setFilters as any}
          userFilters={filters}
        />
        <ShowFilters
          rootClass="flex flex-1 gap-1 items-center"
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
