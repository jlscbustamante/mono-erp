import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Input } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { createItemTemplate, IItemTemplate } from '@/data/products/sdk'
import { SelectItems } from '@/views/products/templates/edit/selectItem'

export const CreateDrawer = ({
  open,
  onClose,
  allItems,
  onUpdate,
  baseId,
}: {
  open: boolean
  allItems: IItemTemplate[]
  onClose: () => void
  onUpdate?: () => void
  baseId: number
}) => {
  const [visible, setVisible] = useState(false)
  const [newItem, setNewItem] = useState<{
    despachoId: number | undefined
    despachoName: string | undefined
    inventarioId: number | undefined
    inventarioName: string | undefined
    presentationId: number | undefined
    presentationName: string | undefined
    measureId: number | undefined
    measureName: string | undefined
  }>({
    despachoId: undefined,
    despachoName: undefined,
    inventarioId: undefined,
    inventarioName: undefined,
    presentationId: undefined,
    presentationName: undefined,
    measureId: undefined,
    measureName: undefined,
  })

  const reset = () => {
    setNewItem({
      despachoId: undefined,
      despachoName: undefined,
      inventarioId: undefined,
      inventarioName: undefined,
      presentationId: undefined,
      presentationName: undefined,
      measureId: undefined,
      measureName: undefined,
    })
  }

  const updateItemMt = useMutation({
    mutationFn: () => {
      return createItemTemplate({
        ...newItem,
        baseId: baseId,
      })
    },
    onSuccess: () => {
      onUpdate?.()
      toast.success('Item agregado')
      onClose()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const onClick = () => {
    updateItemMt.mutate()
  }

  const yaExiste = useMemo(() => {
    if (!newItem) return false
    return allItems.find(
      (i) =>
        i.despacho.id === newItem.despachoId &&
        i.inventario.id === newItem.inventarioId,
    )
  }, [allItems, newItem])

  const disabledButton = useMemo(() => {
    if (!newItem) return true
    if (!newItem.despachoId) return true
    if (!newItem.inventarioId) return true
    return yaExiste
  }, [allItems, newItem])

  useEffect(() => {
    if (!open) setVisible(false)
    else {
      setVisible(true)
    }
  }, [open])

  return (
    <Drawer
      title="Agregar item"
      height={'500px'}
      open={visible}
      onClose={() => setVisible(false)}
      placement="bottom"
      afterOpenChange={(val) => {
        if (!val) {
          reset()
          onClose()
        }
      }}
    >
      <div className="flex gap-2 items-end">
        <div className="flex-1 flex flex-col">
          <p className="font-semibold mb-2">Item visual</p>
          <SelectItems
            className="flex-1"
            value={newItem?.despachoId}
            onChange={(val) => {
              setNewItem({
                ...newItem,
                despachoId: val.id,
                despachoName: val.itemName,
                presentationId: val.presentation?.id,
                presentationName: val.presentation?.presentation,
                measureId: val.product?.measure?.id,
                measureName: val.product?.measure?.measure,
              })
            }}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <p className="font-semibold mb-2">Item de inventario</p>
          <SelectItems
            className="flex-1"
            value={newItem?.inventarioId}
            onChange={(val) => {
              setNewItem({
                ...newItem,
                inventarioId: val.id,
                inventarioName: val.itemName,
              })
            }}
          />
        </div>
        <div className="flex flex-col">
          <p className="font-semibold mb-2">Presentación</p>
          <Input
            readOnly
            value={newItem?.presentationName}
            className="flex-shrink-0 flex-grow-0 justify-end"
            size="small"
          />
        </div>
        <div className="flex flex-col">
          <p className="font-semibold mb-2">Unidad de medida</p>
          <Input
            readOnly
            value={newItem?.measureName}
            className="flex-shrink-0"
            size="small"
          />
        </div>
        <div></div>
      </div>
      <div className="flex justify-end mt-2 items-center">
        <p className="mr-2 text-red-600">
          {yaExiste ? 'Ya existe un item igual' : ''}
        </p>
        <Button
          className=""
          type="primary"
          disabled={!!disabledButton}
          loading={updateItemMt.isPending}
          onClick={onClick}
        >
          Guardar
        </Button>
      </div>
    </Drawer>
  )
}
