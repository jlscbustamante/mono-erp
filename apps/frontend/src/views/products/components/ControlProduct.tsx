import { Button, Input } from 'antd'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'

import { AddFilterButton } from '@/components/filter/AddFilterButton'
import { ShowFilters } from '@/components/filter/ShowFilters'
import { OpFilter } from '@/data/types/Filters'

import { useProduct } from '../state/useProduct'

export const ControlProduct = () => {
  const { store } = useProduct()
  const items = [
    {
      label: 'id',
      key: 'id',
      options: [OpFilter.Equal],
    },
    {
      label: 'Categoria',
      key: 'categoryId',
      options: [OpFilter.Select, OpFilter.SelectIn],
    },
    {
      label: 'UM',
      key: 'measureId',
      options: [OpFilter.Select, OpFilter.SelectIn],
    },
    // {
    //   label: 'Precio/Unidad',
    //   key: 'unitPrice',
    //   options: [OpFilter.Equal, OpFilter.Range],
    // },
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

  return (
    <div className="flex">
      <div className="flex gap-1 mb-3 items-center flex-1">
        <Input
          addonBefore="Nombre de producto"
          placeholder="Buscar nombre"
          className="w-80"
          value={store.filters.product?.[1] ?? ''}
          onChange={(e) => {
            if (e.target.value == '')
              store.setFilters({ ...store.filters, product: undefined })
            else
              store.setFilters({
                ...store.filters,
                product: [OpFilter.Contain, e.target.value],
              })
            // store.setWasUpdatedOrCreated()
          }}
          onPressEnter={() => {
            store.setWasUpdatedOrCreated()
          }}
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
          ignore={['product']}
          setUserFilters={(filters) => {
            store.setFilters(filters)
            // store.setWasUpdatedOrCreated()
          }}
          selections={{
            categoryId: store.categories.map((el) => ({
              label: el.category,
              value: el.id,
            })),
            measureId: store.measures.map((el) => ({
              label: el.code,
              value: el.id,
            })),
          }}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<FiSearch />}
          onClick={() => store.setWasUpdatedOrCreated()}
          className="flex items-center justify-center"
        />
        <Button
          type="primary"
          color="danger"
          shape="circle"
          icon={<MdOutlineCleaningServices />}
          onClick={() => {
            store.setFilters({})
            store.setWasUpdatedOrCreated()
            // store.addControlLoadPurchase()
          }}
          danger
        />
      </div>
      <Button type="primary" onClick={() => store.setDrawers({ create: true })}>
        Nuevo
      </Button>
    </div>
  )
}
