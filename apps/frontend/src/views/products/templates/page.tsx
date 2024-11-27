import { useMutation } from '@tanstack/react-query'
import { Button } from 'antd'
import { useMemo, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-toastify'

import { checkTemplates } from '@/data/hex/inventory'
import { TemplatesTable } from '@/views/products/templates/components/templates-table'

export default function TemplatePage() {
  const [storeErrors, setStoreErrors] = useState<string[]>([])
  const [warehouseErrors, setWarehouseErrors] = useState<string[]>([])

  const hasData = useMemo(() => {
    return storeErrors.length > 0 || warehouseErrors.length > 0
  }, [storeErrors, warehouseErrors])

  const checkTemplateMt = useMutation({
    mutationFn: checkTemplates,
    onSuccess: (data) => {
      if (data.global.length > 0) {
        toast.error(data.global[0])
      } else if (data.store.length == 0 && data.warehouse.length == 0) {
        toast.success('No hay inconsistencias')
      } else {
        setStoreErrors(data.store)
        setWarehouseErrors(data.warehouse)
      }
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return (
    <div className="p-3">
      <div className="flex justify-end mb-3">
        <Button
          loading={checkTemplateMt.isPending}
          onClick={() => checkTemplateMt.mutate()}
        >
          Buscar inconsistencias
        </Button>
      </div>
      <TemplatesTable />
      {hasData && (
        <div className="mt-3 bg-slate-100 border border-solid border-slate-300 p-2 text-slate-700">
          <div className="flex justify-end">
            <IoMdClose
              className="h-auto w-5 cursor-pointer"
              onClick={() => {
                setStoreErrors([])
                setWarehouseErrors([])
              }}
            />
          </div>
          {storeErrors.length > 0 && (
            <>
              <h3 className="mb-2 text-base">
                Items de almacen que no existen en tienda :
              </h3>
              <ul className="mb-4 list-inside space-y-2">
                {warehouseErrors.map((el) => (
                  <li key={el} className="text-sm">
                    {el}
                  </li>
                ))}
              </ul>
            </>
          )}
          {warehouseErrors.length > 0 && (
            <>
              <h3 className="mb-2 text-base">
                Items de tienda que no existen en almacen :
              </h3>
              <ul className="mb-4 list-inside space-y-2">
                {storeErrors.map((el) => (
                  <li key={el} className="text-sm">
                    {el}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
