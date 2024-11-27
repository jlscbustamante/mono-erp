import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Form, Input } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { useEffect, useMemo, useReducer, useState } from 'react'
import { toast } from 'react-toastify'

import { IItemTemplate, updateItemTemplate } from '@/data/products/sdk'
import { SelectItems } from '@/views/products/templates/edit/selectItem'

export const EditItemDrawer = ({
  item,
  allItems,
  onClose,
  onUpdate,
}: {
  item?: IItemTemplate
  allItems: IItemTemplate[]
  onClose: () => void
  onUpdate?: () => void
}) => {
  const [visible, setVisible] = useState(false)
  const [newItem, setNewItem] = useState<
    | {
        id: number
        despachoId: number
        despachoName: string
        inventarioId: number
        inventarioName: string
        presentationId: number | undefined
        presentationName: string | undefined
        measureId: number | undefined
        measureName: string | undefined
      }
    | undefined
  >(undefined)

  const updateItemMt = useMutation({
    mutationFn: () => {
      return updateItemTemplate(newItem)
    },
    onSuccess: () => {
      onUpdate?.()
      toast.success('Item actualizado')
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const onClick = () => {
    updateItemMt.mutate()
  }

  const [yaExiste, setYaExiste] = useState(false)
  const [controlVerify, verifyYaExiste] = useReducer((st) => st + 1, 0)

  // const yaExiste = useMemo(() => {
  //   if (!newItem) return false
  //   return allItems.find(
  //     (i) =>
  //       i.despacho.id === newItem.despachoId &&
  //       i.inventario.id === newItem.inventarioId,
  //   )
  // }, [allItems, newItem])

  const disabledButton = useMemo(() => {
    if (!newItem) return true
    return yaExiste
  }, [allItems, newItem])

  useEffect(() => {
    if (!item) setVisible(false)
    else {
      setVisible(true)
      setNewItem({
        id: item.id,
        despachoId: item.despacho.id,
        despachoName: item.despacho.name,
        inventarioId: item.inventario.id,
        inventarioName: item.inventario.name,
        presentationId: item?.despacho?.presentationId ?? undefined,
        presentationName: item?.despacho?.presentationName ?? undefined,
        measureId: item?.despacho?.measureId ?? undefined,
        measureName: item?.despacho?.measureName ?? undefined,
      })
    }
  }, [item])

  useEffect(() => {
    if (!newItem) {
      setYaExiste(false)
    } else {
      if (
        item?.despacho.id === newItem?.despachoId &&
        item?.inventario.id === newItem?.inventarioId
      ) {
        setYaExiste(false)
      } else {
        setYaExiste(
          !!allItems.find(
            (i) =>
              i.despacho.id === newItem.despachoId &&
              i.inventario.id === newItem.inventarioId,
          ),
        )
      }
    }
  }, [controlVerify])

  if (!newItem) return null
  return (
    <Drawer
      title="Editar item"
      open={visible}
      onClose={() => setVisible(false)}
      width={620}
      placement="right"
      afterOpenChange={(val) => {
        if (!val) {
          onClose()
          setYaExiste(false)
        }
      }}
    >
      <Form layout="vertical">
        <FormItem label="Id">
          <Input readOnly value={newItem?.id} className="w-20" size="small" />
        </FormItem>
        <FormItem label="Item pedido">
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
              verifyYaExiste()
            }}
          />
        </FormItem>
        <FormItem label="Item de inventario">
          <SelectItems
            className="flex-1"
            value={newItem?.inventarioId}
            onChange={(val) => {
              setNewItem({
                ...newItem,
                inventarioId: val.id,
                inventarioName: val.itemName,
              })
              verifyYaExiste()
            }}
          />
        </FormItem>
        <FormItem label="UM base">
          <Input
            readOnly
            value={newItem?.measureName}
            className="flex-shrink-0 w-40"
            size="small"
          />
        </FormItem>
      </Form>
      <div className="flex justify-end mt-2 items-center">
        <p className="mr-2 text-red-600">
          {yaExiste ? 'Este item ya existe en el template' : ''}
        </p>
        <Button
          className=""
          type="primary"
          disabled={yaExiste || !!disabledButton}
          loading={updateItemMt.isPending}
          onClick={onClick}
        >
          Guardar
        </Button>
      </div>
    </Drawer>
  )
}
