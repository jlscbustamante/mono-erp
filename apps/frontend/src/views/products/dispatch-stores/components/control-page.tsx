import { Button, Input } from 'antd'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { TfiReload } from 'react-icons/tfi'

import { AddFilterButton } from '@/components/filter/AddFilterButton'
import { ShowFilters } from '@/components/filter/ShowFilters'
import { DispatchStatus } from '@/data/products/types'
import { OpFilter } from '@/data/types/Filters'
import {
  useDispatch,
  useDispatchBetweenStoresStore,
} from '../../state/useDispatch'
import { useCreateMoveDrawer } from './create-move-drawer'

const items = [
  {
    label: 'id',
    key: 'id',
    options: [OpFilter.Equal],
  },
  {
    label: 'Tienda',
    key: 'wareToId',
    options: [OpFilter.Select],
  },
  {
    label: 'Fecha',
    key: 'moveAt',
    options: [OpFilter.EqualDate, OpFilter.RangeDate],
    nodelete: true,
  },
  {
    label: 'Monto',
    key: 'totalValue',
    options: [OpFilter.Equal, OpFilter.Range],
  },
  {
    label: 'Estado',
    key: 'status',
    options: [OpFilter.Select, OpFilter.SelectIn],
    selection: [
      {
        label: 'Nuevo',
        value: DispatchStatus.NEW,
      },
      {
        label: 'Aprobado',
        value: DispatchStatus.APPROVED,
      },
      {
        label: 'Despachado',
        value: DispatchStatus.DISPATCHED,
      },
      {
        label: 'Facturado',
        value: DispatchStatus.INVOICED,
      },
      {
        label: 'Cancelado',
        value: DispatchStatus.CANCELED,
      },
    ],
  },
]

export const ControlPage = () => {
  const { open } = useCreateMoveDrawer()
  const store = useDispatchBetweenStoresStore()
  const { store: storeDispatch } = useDispatch()
  return (
    <div className="flex justify-between">
      <div className="flex justify-start items-center gap-1">
        <Input
          // value={filterDescription}
          value={store.filters.gloss?.[1] ?? ''}
          onChange={(e) => {
            if (e.target.value == '')
              store.setFilters({ ...store.filters, gloss: undefined })
            else
              store.setFilters({
                ...store.filters,
                gloss: [OpFilter.Contain, e.target.value],
              })
          }}
          // onChange={(e) => setFilterDescription(e.target.value)}
          addonBefore="Descripción"
          placeholder="Buscar"
          className="w-64"
        />

        <AddFilterButton
          items={items}
          setUserFilters={store.setFilters}
          userFilters={store.filters}
        />
        <ShowFilters
          rootClass="flex gap-1"
          options={items}
          userFilters={store.filters}
          ignore={['gloss']}
          setUserFilters={(filters) => {
            store.setFilters(filters)
            // store.addControlUpdateOrCreated()
          }}
          selections={{
            wareToId: storeDispatch.warehouses.map((w) => ({
              label: w.name,
              value: w.id,
            })),
          }}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<FiSearch />}
          onClick={() => store.addControlUpdateOrCreated()}
          className="flex items-center justify-center"
        />
        <Button
          type="primary"
          color="danger"
          shape="circle"
          icon={<MdOutlineCleaningServices />}
          onClick={() => {
            store.setFilters({})
            store.addControlUpdateOrCreated()
          }}
          danger
        />
      </div>
      <div className="flex gap-2">
        <Button type="primary" onClick={() => open()}>
          Nuevo
        </Button>
        <Button shape="circle" icon={<TfiReload />} />
      </div>
    </div>
  )
}
