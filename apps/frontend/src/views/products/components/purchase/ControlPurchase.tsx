import { Button, Input } from 'antd'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'

import { AddFilterButton } from '@/components/filter/AddFilterButton'
import { ShowFilters } from '@/components/filter/ShowFilters'
import { OpFilter } from '@/data/types/Filters'

import { usePurchaseStore } from '../../state/usePurchase'
import { SelectCompanyPurchase } from './select_company_pu'

export const ControlPurchase = () => {
  const store = usePurchaseStore()
  const items = [
    {
      label: 'id',
      key: 'id',
      options: [OpFilter.Equal],
    },
    {
      label: 'Razón social',
      key: 'supplierName',
      options: [OpFilter.Contain, OpFilter.Equal],
    },
    {
      label: 'Fecha',
      key: 'purchaseAt',
      options: [OpFilter.EqualDate, OpFilter.RangeDate],
      nodelete: true,
    },
    {
      label: 'Factura',
      key: 'numInvoice',
      options: [OpFilter.Contain, OpFilter.Contain],
    },
    // {
    //   label: 'Guia',
    //   key: 'numGuide',
    //   options: [OpFilter.Contain, OpFilter.Contain],
    // },
    // {
    //   label: 'Creado por',
    //   key: 'createdBy',
    //   options: [OpFilter.Contain, OpFilter.Equal],
    // },
    {
      label: 'Estado',
      key: 'status',
      options: [OpFilter.Select],
    },
    {
      label: 'Valor total',
      key: 'totalValue',
      options: [OpFilter.Equal, OpFilter.Range],
    },
  ]
  return (
    <div className="flex">
      <div className="flex gap-1 mb-3 items-center flex-1">
        <SelectCompanyPurchase
          value={store.filters.companySap?.[1]}
          onChange={(val) => {
            if (val == '')
              store.setFilters({
                ...store.filters,
                companySap: undefined,
              })
            else
              store.setFilters({
                ...store.filters,
                companySap: [OpFilter.Equal, val],
              })
          }}
        />
        {/* <SelectTradeMarker
          value={store.filters.companySap?.[1]}
          onChange={(val) => {
            if (val == '')
              store.setFilters({
                ...store.filters,
                companySap: undefined,
              })
            else
              store.setFilters({
                ...store.filters,
                companySap: [OpFilter.Equal, val],
              })
          }}
        /> */}
        <Input
          addonBefore="Descripción"
          placeholder="Buscar"
          className="w-56"
          value={store.filters.gloss?.[1] ?? ''}
          onChange={(e) => {
            if (e.target.value == '')
              store.setFilters({ ...store.filters, gloss: undefined })
            else
              store.setFilters({
                ...store.filters,
                gloss: [OpFilter.Contain, e.target.value],
              })
            // store.addControlLoadPurchase()
          }}
          onPressEnter={() => {
            store.addControlLoadPurchase()
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
          ignore={['gloss', 'companySap']}
          setUserFilters={(filters) => {
            store.setFilters(filters)
            // store.addControlLoadPurchase()
          }}
          selections={{
            status: [
              {
                label: 'Nuevo',
                value: 1,
              },
              {
                label: 'Aprobado',
                value: 3,
              },
            ],
          }}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<FiSearch />}
          onClick={() => store.addControlLoadPurchase()}
          className="flex items-center justify-center"
        />
        <Button
          type="primary"
          color="danger"
          shape="circle"
          icon={<MdOutlineCleaningServices />}
          onClick={() => {
            store.setFilters({})
            store.addControlLoadPurchase()
          }}
          danger
        />
      </div>
      <Button
        type="primary"
        onClick={() => {
          store.setDrawers({ create: true })
        }}
      >
        Nuevo
      </Button>
    </div>
  )
}
