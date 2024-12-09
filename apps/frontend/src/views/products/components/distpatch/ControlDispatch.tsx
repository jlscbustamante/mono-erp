import { Button, Dropdown, Input, Select } from 'antd'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { TfiReload } from 'react-icons/tfi'

import { AddFilterButton } from '@/components/filter/AddFilterButton'
import { ShowFilters } from '@/components/filter/ShowFilters'
import { DispatchStatus } from '@/data/products/types'
import { OpFilter } from '@/data/types/Filters'

import { DispatchItemSelector } from '@/app/erp/modules/mercaderia/dispatch-item-selector'
import config from '@/config'
import { zipedFiles } from '@/data/hex/inventory'
import { useWarehousesRoute } from '@/hooks/data/iventory/use-warehouses-route'
import { filterSelectForm } from '@/utils'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'react-toastify'
import { useDocs } from '../../hooks/use-docs'
import { useDispatch, useDispatchQuery } from '../../state/useDispatch'

export const ControlDispatch = () => {
  const query = useDispatchQuery()
  const { store } = useDispatch()
  const items = [
    {
      label: 'id',
      key: 'id',
      options: [OpFilter.Equal],
    },
    {
      label: 'Almacen',
      key: 'wareFromId',
      options: [OpFilter.Select],
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

  const queryRoute = useWarehousesRoute()
  const uniqueRoutes: string[] = useMemo(() => {
    if (!queryRoute.data) return []
    const routes = new Set()
    queryRoute.data.forEach((el) => {
      routes.add(el.route)
    })
    return (Array.from(routes).filter((el) => el) as string[]).sort((a, b) =>
      a.localeCompare(b),
    )
  }, [queryRoute.data])

  const queryDocs = useDocs()

  const dataFilteredRoute = useMemo(() => {
    if (!store.showValueForm) return query.data
    if (!queryRoute.data) return query.data
    const warehouseCodes = queryRoute.data
      .filter((el) => el.route == store.showValueForm)
      .map((el) => el.code)
    return query.data?.filter((el) => {
      return warehouseCodes.includes(el.wareToId)
    })
  }, [query.data, queryRoute.data, store.showValueForm])

  const printDocuments = async (typeDoc: number) => {
    const guides: { docNumber: string; warehouseId: string }[] = []
    const invoices: { docNumber: string; warehouseId: string }[] = []
    dataFilteredRoute?.forEach((el) => {
      if (el.numGuide) {
        guides.push({
          docNumber: el.numGuide!,
          warehouseId: el.wareTo?.name ?? el.wareToId,
        })
      }
      if (el.numInvoice) {
        invoices.push({
          docNumber: el.numInvoice!,
          warehouseId: el.wareTo?.name ?? el.wareToId,
        })
      }
    })

    const allDocs = queryDocs.data?.filter((el) => el.doc_url) ?? []
    const docs: {
      doc_url: string
      doc_operacion: string
      warehouseId: string
    }[] = []
    for (const dc of allDocs) {
      const allDocs =
        typeDoc == 0
          ? [...guides, ...invoices]
          : typeDoc == 1
            ? [...guides]
            : [...invoices]
      const doc = allDocs.find((el) => el.docNumber == dc.doc_operacion)
      if (doc) {
        if (dc.doc_efact_id != null) {
          docs.push({
            doc_operacion: dc.doc_operacion,
            warehouseId: doc.warehouseId,
            doc_url: `${config.hostPos}/api/facturacion/externo/efact/pdf?order=${dc.doc_operacion}`,
          })
        } else {
          docs.push({
            doc_operacion: dc.doc_operacion,
            doc_url: dc.doc_url,
            warehouseId: doc.warehouseId,
          })
        }
      }
    }

    zipedFilesMt.mutate(docs)
  }

  const zipedFilesMt = useMutation({
    mutationFn: zipedFiles,
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      console.log('hi')
    },
  })

  return (
    <div className="flex items-center">
      <div className="flex gap-1 mb-3 items-center flex-1">
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
          }}
          onPressEnter={() => {
            store.addControlUpdateOrCreated()
          }}
        />
        <Select
          className="w-20"
          placeholder="Ruta"
          allowClear
          showSearch
          filterOption={filterSelectForm}
          value={store.showValueForm}
          onChange={(val) => {
            store.setShowValueForm(val)
          }}
        >
          {uniqueRoutes.map((el) => (
            <Select.Option key={el} value={el}>
              {el}
            </Select.Option>
          ))}
        </Select>
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
            wareFromId: store.warehouses.map((w) => ({
              label: w.name,
              value: w.id,
            })),
            wareToId: store.warehouses.map((w) => ({
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
      <div className="flex items-center gap-2">
        <DispatchItemSelector />
        <div>
          {/* <Button>Descargar archivos</Button> */}
          <Dropdown
            className=""
            placement="bottomRight"
            menu={{
              items: [
                {
                  key: '1',
                  label: 'Todos',
                  onClick: () => {
                    printDocuments(0)
                  },
                },
                {
                  key: '2',
                  label: 'Guias',
                  onClick: () => {
                    printDocuments(1)
                  },
                },
                {
                  key: '3',
                  label: 'Facturas',
                  onClick: () => {
                    printDocuments(2)
                  },
                },
              ],
            }}
          >
            <Button loading={zipedFilesMt.isPending}>Descargar archivos</Button>
          </Dropdown>
        </div>
        <div>
          <Button
            onClick={() => {
              store.setDrawers({ create: true })
            }}
          >
            Crear despacho excepcional
          </Button>
        </div>

        <div className="hidden">
          <Button
            shape="circle"
            loading={query.isFetching}
            onClick={() => query.refetch()}
            icon={<TfiReload className="" />}
          />
        </div>
      </div>
    </div>
  )
}
