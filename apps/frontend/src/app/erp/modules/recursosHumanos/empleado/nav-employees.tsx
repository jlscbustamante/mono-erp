import { AddFilterButton } from '@/components/filter/AddFilterButton'
import { FiltersOption, ShowFilters } from '@/components/filter/ShowFilters'
import { PATHS } from '@/const/paths'
import { cn } from '@/utils'
import { useSucursales } from '@/views/products/components/stock/hooks/useSucursales'
import { Button, Select } from 'antd'
import { RhEmployee } from 'pizzadb'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { OpFilter } from 'shared'
import { useEmpleadoContext } from '.'
import { useCreateEmployee } from './create-employee-drawer'

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
    key: 'jobtitle_id',
    options: [OpFilter.Select],
  },
]

export const NavEmployees = ({
  motorizadPage,
}: {
  motorizadPage?: boolean
}) => {
  const sucursales = useSucursales()
  const { open } = useCreateEmployee()
  // const [filters, setFilters] = useAtom(filtersAtom)
  const { filters, setFilters, setController, store, setStore } =
    useEmpleadoContext()
  // const setController = useSetAtom(controlerAtom)

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Select
          placeholder="Tiendas"
          className="w-52"
          showSearch
          value={store}
          onChange={setStore}
        >
          <Select.Option value={'TODAS'}>TODAS</Select.Option>
          <Select.Option value={'NULL'}>SIN TIENDA</Select.Option>
          {sucursales.data
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map((el) => (
              <Select.Option key={el.code}>{el.name}</Select.Option>
            ))}
        </Select>
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
      <div
        className={cn({
          hidden: !motorizadPage,
        })}
      >
        <Link to={PATHS.erp.modulos.mantenimiento.motorizados}>
          Crear o actualizar motorizados.
        </Link>
      </div>
      <Button
        type="primary"
        onClick={open}
        className={motorizadPage ? 'hidden' : ''}
      >
        Nuevo
      </Button>
    </div>
  )
}
