import { getRelationsProducts, updatePriceItem } from '@/data/hex/inventory'
import { IInvProductItem } from '@/data/products/types'
import { cn } from '@/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Drawer, InputNumber } from 'antd'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'
import { usePrincipalItems } from './use-principal'

const editPriceAtom = atom<IInvProductItem | null>({
  key: 'edit-price-all',
  default: null,
})

export const useEditPrice = () => {
  const [editPrice, setEditPrice] = useRecoilState(editPriceAtom)
  return {
    isOpen: !!editPrice,
    open: (item: IInvProductItem) => setEditPrice(item),
    close: () => setEditPrice(null),
    item: editPrice,
  }
}

export const EditPriceDrawer = () => {
  const { isOpen, close, item } = useEditPrice()
  const query = usePrincipalItems()

  return (
    <Drawer open={isOpen} onClose={() => close()} width={600}>
      {item && (
        <EditPrice
          item={item}
          onUpdate={() => {
            query.refetch()
            close()
          }}
        />
      )}
    </Drawer>
  )
}

const EditPrice = ({
  item,
  onUpdate,
}: {
  item: IInvProductItem
  onUpdate: () => void
}) => {
  const [data, setData] = useState({
    cost: item.unitCost,
    price: item.unitPrice,
  })
  const relationQuery = useQuery({
    queryKey: ['relation', item.id],
    queryFn: () => getRelationsProducts(item.id),
    gcTime: 0,
  })

  const updatePriceMt = useMutation({
    mutationFn: updatePriceItem,
    onSuccess: () => {
      onUpdate()
    },
    onError: (error) => {
      console.error(error)
      toast.error(error.message)
    },
  })
  const handleUpdate = () => {
    updatePriceMt.mutate({
      itemId: item.id,
      cost: data.cost,
      price: data.price,
    })
  }

  return (
    <div>
      <p className="font-semibold">{item.itemName}</p>
      <div className="my-3 space-y-4">
        <div className="flex gap-2 items-center">
          <label>Costo</label>
          <InputNumber
            value={data.cost}
            onChange={(val) =>
              setData({
                ...data,
                cost: val ?? 0,
              })
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <label>Precio</label>
          <InputNumber
            value={data.price}
            onChange={(val) => {
              setData({
                ...data,
                price: val ?? 0,
              })
            }}
          />
        </div>
      </div>
      <div
        className={cn({
          hidden: !relationQuery.data?.length,
        })}
      >
        <p className="my-3">Items derivados :</p>
        <ul className="list-none">
          {relationQuery.data?.map((relation) => {
            return <li key={relation.id}>{relation.itemName}</li>
          })}
        </ul>
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          onClick={() => handleUpdate()}
          type="primary"
          loading={updatePriceMt.isPending}
        >
          Guardar
        </Button>
      </div>
    </div>
  )
}
