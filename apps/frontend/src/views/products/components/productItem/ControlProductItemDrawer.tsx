import { Button, Input } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'

import { AddFilterButton } from '@/components/filter/AddFilterButton'
import { ShowFilters } from '@/components/filter/ShowFilters'
import { OpFilter } from '@/data/types/Filters'

import { ExcelExportBtn } from '@/components/excel-btn'
import { IInvProductItem } from '@/data/products/types'
import { Excel } from 'antd-table-saveas-excel'
import { ColumnsType } from 'antd/es/table'
import { Printer } from 'lucide-react'
import ReactToPrint from 'react-to-print'
import { useProductItem } from '../../state/useProductItem'

export const ControlProductItem = ({ ref_table }: { ref_table: any }) => {
  const { store, loadProducts, getListProducts } = useProductItem()

  const categories = useMemo(() => {
    const data = store.productItems
      .map((el) => ({
        label: el.product?.category?.category,
        value: el.product?.category?.id,
      }))
      .filter((el) => el.label && el.value) as {
      label: string
      value: number
    }[]
    const dataNoRepeat = data.reduce(
      (acc, current) => {
        const x = acc.find((item) => item.value === current.value)
        if (!x) {
          return acc.concat([current])
        } else {
          return acc
        }
      },
      [] as { label: string; value: number }[],
    )
    return dataNoRepeat.sort((a, b) => a.label.localeCompare(b.label))
  }, [store.productItems])
  const [optionsProduct, setOptionsProduct] = useState<
    { label: string; value: number }[]
  >([])
  const items = [
    {
      label: 'id',
      key: 'id',
      options: [OpFilter.Equal],
    },
    // {
    //   label: 'Nombre',
    //   key: 'product',
    //   options: [OpFilter.Contain, OpFilter.Equal],
    // },
    {
      label: 'Categoria',
      key: 'product.categoryId',
      options: [OpFilter.Select],
    },
    {
      label: 'Producto',
      key: 'productId',
      options: [OpFilter.Select, OpFilter.SelectIn],
    },
    {
      label: 'Proveedor',
      key: 'supplierId',
      options: [OpFilter.Select, OpFilter.SelectIn],
    },
    {
      label: 'Marca',
      key: 'brandId',
      options: [OpFilter.Select, OpFilter.SelectIn],
    },
    {
      label: 'Presentación',
      key: 'presentationId',
      options: [OpFilter.Select, OpFilter.SelectIn],
    },
    {
      label: 'Precio',
      key: 'unitPrice',
      options: [
        OpFilter.Equal,
        OpFilter.Range,
        OpFilter.Greater,
        OpFilter.Less,
      ],
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
  const [editFilters, setEditFilters] = useState(0)
  // const [firstTime, setFirstTime] = useState(true)

  const columns: ColumnsType<IInvProductItem> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Categoria',
      dataIndex: ['product', 'category', 'category'],
    },
    {
      title: 'Nombre del item',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Costo',
      dataIndex: 'unitCost',
      // render: (text) => fNumber(text),
      // render: (text) => text,
    },
    {
      title: 'Precio',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      // render: (text) => fNumber(text),
      // sorter: (a, b) => a.unitPrice - b.unitPrice,
    },
    {
      title: 'UM',
      dataIndex: ['measure', 'code'],
      key: 'unidad_medida',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      // sorter: () => -1,
      render: (status: number | string) => {
        if (status == 1) {
          return 'Activo'
        } else if (status == 0) {
          return 'Inactivo'
        }
      },
    },
  ]

  const handleExport = () => {
    const excel = new Excel()
    excel
      .addSheet('Items')
      .addColumns(columns as any)
      .addDataSource(store.productItems)
      .saveAs('items.xlsx')
  }

  // useEffect(() => {
  //   loadProducts()
  // }, [store.filters.itemName])

  useEffect(() => {
    ;(async () => {
      const products = await getListProducts()
      setOptionsProduct(
        products.map((product) => ({
          label: product.product,
          value: product.id,
        })),
      )
    })()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [editFilters])

  return (
    <div className="flex">
      <div className="flex gap-1 mb-3 items-center flex-1">
        <Input
          addonBefore="Nombre"
          placeholder="Buscar nombre"
          className="w-56"
          value={store.filters.itemName?.[1] ?? ''}
          onChange={(e) => {
            if (e.target.value == '')
              store.setFilters({ ...store.filters, itemName: undefined })
            else
              store.setFilters({
                ...store.filters,
                itemName: [OpFilter.Contain, e.target.value],
              })
            // setFirstTime(false)
          }}
          onPressEnter={() => {
            setEditFilters(editFilters + 1)
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
          ignore={['itemName']}
          setUserFilters={(filters) => {
            store.setFilters(filters)
            // setEditFilters(editFilters + 1)
          }}
          selections={{
            productId: optionsProduct,
            brandId: store.brands.map((brand) => ({
              label: brand.brand,
              value: brand.id,
            })),
            presentationId: store.presentations.map((presentation) => ({
              label: presentation.presentation,
              value: presentation.id,
            })),
            supplierId: store.suppliers.map((supplier) => ({
              label: supplier.supplier,
              value: supplier.id,
            })),
            'product.categoryId': categories,
          }}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<FiSearch />}
          onClick={() => setEditFilters(editFilters + 1)}
          className="flex items-center justify-center"
        />
        <Button
          type="primary"
          color="danger"
          shape="circle"
          icon={<MdOutlineCleaningServices />}
          onClick={() => {
            store.setFilters({})
            // store.addControlLoadPurchase()
            setEditFilters(editFilters + 1)
          }}
          danger
        />
      </div>
      <div className="flex items-center gap-1">
        <ReactToPrint
          trigger={() => {
            return (
              <Button type="primary">
                <Printer className="w-5 h-auto" />
              </Button>
            )
          }}
          content={() => ref_table.current}
        />
        <ExcelExportBtn
          onExport={() => {
            handleExport()
          }}
        />
        <Button
          type="primary"
          onClick={() => store.setDrawers({ create: true })}
        >
          Nuevo
        </Button>
      </div>
    </div>
  )
}
