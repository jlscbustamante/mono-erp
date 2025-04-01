import { Button, Checkbox, Drawer, Form, Input, Select, Spin } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import { IInvProduct } from '@/data/products/types'
import { cn, filterSelectForm } from '@/utils'

import levenshtein from 'fast-levenshtein'
import { useProduct } from '../../state/useProduct'
import { CreateCategory } from '../CreateCategory'
import { CreateMeasure } from '../CreateMeasure'

export const EditInvProductDrawer = () => {
  const { store, getOneProduct, editProduct } = useProduct()
  const [product, setEditProduct] = useState<Partial<IInvProduct> | undefined>(
    undefined,
  )
  const [editing, setEditing] = useState(false)

  const handleEditProduct = async () => {
    setEditing(true)
    await editProduct(product as IInvProduct)
    setEditing(false)
    store.setEditProductId(undefined)
  }

  const coincidences = useMemo(() => {
    const text = product?.product ?? ''
    const original = store.products.find((el) => el.id === store.editProductId)
    if (!text) return []
    if (original && original.product == text) return []

    return store.products
      .map((el) => {
        const valueLower = text.toLowerCase()
        const iterateLower = el.product.toLowerCase()
        const distance = levenshtein.get(valueLower, iterateLower)
        const isIncluded = iterateLower.replace(/\s/g, '').includes(valueLower)
        const includedPrecision = valueLower.length > 2 ? 1 : 3
        return {
          name: el.product,
          distance: distance > 4 && isIncluded ? includedPrecision : distance,
        }
      })
      .filter((el) => el.distance <= 4)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
  }, [product, store.products, store.editProductId])

  useEffect(() => {
    ;(async () => {
      if (store.editProductId) {
        const productResponse = await getOneProduct(store.editProductId)
        setEditProduct(productResponse)
      } else {
        setEditProduct(undefined)
      }
    })()
  }, [store.editProductId])

  return (
    <Drawer
      title="Editar subcategoria"
      keyboard={false}
      open={store.drawers.edit}
      onClose={() => {
        if (!editing) {
          store.setEditProductId(undefined)
        }
      }}
      width={500}
    >
      {product ? (
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="id">
            <Input value={product.id} readOnly />
          </Form.Item>
          {/* <Form.Item label="Nombre">
            <Input placeholder="Nombre" value={product.id} readOnly />
          </Form.Item> */}
          <Form.Item label="Nombre">
            <Input
              placeholder="Nombre"
              value={product.product}
              onChange={(e) =>
                setEditProduct({ ...product, product: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{ offset: 6, span: 18 }}
            className={cn('my-0', {
              hidden: coincidences.length <= 0,
            })}
          >
            <div
              className={cn(
                'bg-slate-50 p-2 border border-dashed border-slate-200 rounded-md mb-3',
              )}
            >
              <p>Presentaciones existentes: </p>
              {coincidences.map((el) => {
                return (
                  <p key={el.name} className="font-bold text-slate-800">
                    {el.name}
                  </p>
                )
              })}
              <p className="text-sm text-slate-600">
                * evita crear unidades de medida duplicadas
              </p>
            </div>
          </Form.Item>
          <Form.Item label="Categoria">
            <div className="flex gap-1">
              <Select
                placeholder="Categoría"
                showSearch={true}
                filterOption={filterSelectForm}
                value={product.categoryId}
                onChange={(id) => {
                  setEditProduct({
                    ...product,
                    categoryId: id,
                  })
                }}
              >
                {store.categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.category}
                  </Select.Option>
                ))}
              </Select>
              <CreateCategory
                onCreate={(id) => {
                  setEditProduct({
                    ...product,
                    categoryId: id,
                  })
                  store.addControlLoadResources()
                }}
              />
            </div>
          </Form.Item>
          <Form.Item label="UM">
            <div className="flex gap-1">
              <Select
                placeholder="Medida"
                showSearch={true}
                value={product.measureId}
                filterOption={filterSelectForm}
                onChange={(id) => {
                  setEditProduct({
                    ...product,
                    measureId: id,
                  })
                }}
              >
                {store.measures.map((measure) => (
                  <Select.Option key={measure.id} value={measure.id}>
                    {measure.measure}
                  </Select.Option>
                ))}
              </Select>
              <CreateMeasure
                onChange={(insertId: number) => {
                  setEditProduct({
                    ...product,
                    measureId: insertId,
                  })
                  store.addControlLoadResources()
                }}
              />
            </div>
          </Form.Item>
          {/* <Form.Item label="Precio/Unidad">
            <InputNumber
              placeholder="0.0"
              precision={2}
              value={product.unitPrice}
              onChange={(val) =>
                setEditProduct({ ...product, unitPrice: val ?? 0.0 })
              }
            />
          </Form.Item> */}
          <Form.Item label="Activo">
            <Checkbox
              checked={Boolean(product.status)}
              onChange={(val) => {
                setEditProduct({
                  ...product,
                  status: Number(val.target.checked),
                })
              }}
            />
          </Form.Item>
          <div className="flex justify-end">
            <Button
              type="primary"
              onClick={handleEditProduct}
              loading={editing}
            >
              Guardar
            </Button>
          </div>
        </Form>
      ) : (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Spin />
          <p>Cargando producto...</p>
        </div>
      )}
    </Drawer>
  )
}
