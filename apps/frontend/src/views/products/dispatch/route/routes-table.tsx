import { updateWarehouseRoute } from '@/data/hex/inventory'
import { WarehouseRoute } from '@/data/hex/types'
import { useWarehousesRoute } from '@/hooks/data/iventory/use-warehouses-route'
import { cn } from '@/utils'
import { useMutation } from '@tanstack/react-query'
import { Modal, Table, TableProps } from 'antd'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { DISPATCH_ROUTES } from './routes'

export const RoutesTable = () => {
  const query = useWarehousesRoute()

  const [routeSelected, setRouteSelected] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const warehousesSelected = useMemo(() => {
    if (!routeSelected) return query.data ?? []
    return query.data?.filter((el) => el.route === routeSelected) ?? []
  }, [routeSelected, query])

  const routes: { route: string; count: number }[] = useMemo(() => {
    if (!query.data) return []
    const record = DISPATCH_ROUTES.map((el) => {
      const count = query.data.filter((item) => item.route === el).length
      return { route: el, count }
    })
    return record
  }, [query.data])

  const rowSelection: TableProps<WarehouseRoute>['rowSelection'] = {
    selectedRowKeys,
    onChange: (
      selectedRowKeys: React.Key[],
      // selectedRows: WarehouseRoute[],
    ) => {
      setSelectedRowKeys(selectedRowKeys)
    },
    getCheckboxProps: (record: WarehouseRoute) => ({
      // disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }

  const updateRoutesMt = useMutation({
    mutationFn: updateWarehouseRoute,
    onError: (err) => {
      toast.error(err.message, {
        autoClose: false,
      })
    },
    onSuccess: () => {
      query.refetch()
      setSelectedRowKeys([])
    },
  })

  const handleSelectRoute = (route: string) => {
    if (route == routeSelected) {
      setRouteSelected('')
      setSelectedRowKeys([])
    } else {
      if (selectedRowKeys.length > 0) {
        Modal.confirm({
          title: 'Confirmar',
          content: `Las tiendas seleccionadas seran movidas a la ruta "${route}"`,
          onOk: () => {
            updateRoutesMt.mutate({
              route: route,
              warehouseIds: selectedRowKeys as string[],
            })
            setRouteSelected(route)
          },
        })
      } else {
        setRouteSelected(route)
      }
    }
  }

  return (
    <div className="flex flex-col gap-2 ">
      {/* <Table
        id="tabla-route"
        rowKey={(el) => el.route}
        className="w-16"
        size="small"
        bordered={true}
        pagination={false}
        onRow={(record) => {
          if (record.route === routeSelected) {
            return {
              className: cn('bg-red-400 hover:!bg-red-400'),
              // onClick: () => setRouteSelected(''),
              onClick: () => handleSelectRoute(''),
            }
          }
          return {
            className: cn('cursor-pointer'),
            // onClick: () => setRouteSelected(record.route),
            onClick: () => handleSelectRoute(record.route),
          }
        }}
        columns={[
          {
            key: 'code',
            title: 'Rutas',
            dataIndex: 'route',
            render: (text, record) => (
              <p className="text-center select-none">
                {text} <span className="text-sm">({record.count})</span>
              </p>
            ),
            align: 'center',
          },
        ]}
        dataSource={routes}
      /> */}
      <div className="flex gap-2 flex-wrap sticky top-0 z-20 p-2 bg-white">
        {routes.map((el) => (
          <div
            key={el.route}
            className={cn(
              'bg-slate-200 px-2 py-0.5 text-sm text-slate-600 cursor-pointer select-none hover:bg-blue-300 hover:text-white w-14 text-center',
              {
                'bg-blue-500 hover:bg-blue-500 text-white':
                  el.route === routeSelected,
              },
            )}
            onClick={() => handleSelectRoute(el.route)}
          >
            {el.route} ({el.count})
          </div>
        ))}
      </div>
      <Table
        loading={updateRoutesMt.isPending || query.isLoading}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        className="w-96 relative z-10"
        rowKey={(el) => el.code}
        size="small"
        bordered={true}
        pagination={false}
        columns={[
          {
            title: 'Codigo',
            dataIndex: 'code',
            className: '!p-1',
          },
          {
            title: 'Tienda',
            dataIndex: 'name',
            className: '!p-1',
          },
          {
            title: 'Ruta',
            dataIndex: 'route',
            align: 'center',
            className: '!p-1',
          },
        ]}
        dataSource={warehousesSelected}
      />
    </div>
  )
}
