// eslint-disable-next-line simple-import-sort/imports
import { Button } from 'antd'
import { Excel } from 'antd-table-saveas-excel'
import { ColumnsType } from 'antd/es/table'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'

import { ExcelExportBtn } from '@/components/excel-btn'
import { AddFilterButton } from '@/components/filter/AddFilterButton'
import { ShowFilters } from '@/components/filter/ShowFilters'
import { OpFilter } from '@/data/types/Filters'

import { useParametersQuery } from '@/hooks/useParamters'
import { ICourier } from '../types'
import { useCouriers } from '../useCouriers'
import { useListStores } from '../useListStores'
import { useCourierStore } from '../useStorePage'
import { useCreateDrawer } from './CreateDrawer'

const optionsFilter = [
  {
    label: 'Id',
    key: 'id',
    options: [OpFilter.Equal],
  },
  {
    label: 'Nombre',
    key: 'name',
    options: [OpFilter.Contain],
  },
  {
    label: 'Teléfono',
    key: 'phone',
    options: [OpFilter.Contain],
  },
  {
    label: 'Tienda',
    key: 'store_code',
    options: [OpFilter.Select, OpFilter.SelectIn],
  },
  {
    label: 'Estado',
    key: 'status',
    options: [OpFilter.Select],
  },
]

export const CourierControl = ({
  columns,
}: {
  columns: ColumnsType<ICourier>
}) => {
  const { open } = useCreateDrawer()
  const filters = useCourierStore((state) => state.filters)
  const setFilters = useCourierStore((state) => state.setFilters)
  const cleanFilters = useCourierStore((state) => state.cleanFilters)
  const refetch = useCourierStore((state) => state.refetch)
  const { data: stores } = useListStores()
  const { data: parameterData } = useParametersQuery()

  const { data } = useCouriers(parameterData?.ciaIdMoturider ?? null)

  const handleExport = () => {
    const excel = new Excel()
    excel
      .addSheet('Motorizados')
      .addColumns(columns.slice(0, -1) as any)
      .addDataSource(data ?? [])
      .saveAs('motorizados.xlsx')
  }

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <AddFilterButton
          items={optionsFilter}
          setUserFilters={setFilters}
          userFilters={filters}
        />
        <ShowFilters
          rootClass="flex gap-1 flex-wrap"
          options={optionsFilter}
          setUserFilters={setFilters}
          userFilters={filters}
          selections={{
            store_code: stores?.map((store) => ({
              label: store.store_name,
              value: store.store_id,
            })),
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
          onClick={() => {
            console.log('cambio de delivery')
            refetch()
          }}
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
      <div className="flex gap-2">
        <Button onClick={open} type="primary">
          Nuevo
        </Button>
        {/* <Button onClick={handleExport}>Exportar a excel</Button> */}
        <ExcelExportBtn onExport={handleExport} />
      </div>
    </div>
  )
}
