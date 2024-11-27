import { Button, Checkbox, Drawer, Form, Input, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { IInvProduct } from '@/data/products/types'
import { cn, filterSelectForm } from '@/utils'

import levenshtein from 'fast-levenshtein'
import { useProduct } from '../state/useProduct'
import { CreateCategory } from './CreateCategory'
import { CreateMeasure } from './CreateMeasure'

export const AddInvProductDrawer = () => {
  const { store, createProduct } = useProduct()
  const [newProduct, setNewProduct] = useState<Partial<IInvProduct>>({
    status: 1,
  })
  const [isUniqueName, setIsUniqueName] = useState<boolean | undefined>(
    undefined,
  )
  const [creating, setCreating] = useState(false)

  const handleCreateProduct = async () => {
    setCreating(true)
    if (!newProduct.measureId) {
      toast.warning('Debe seleccionar una medida', {
        autoClose: 1200,
      })
      setCreating(false)
      return
    }
    await createProduct(newProduct)
    setNewProduct({ status: 1 })
    setCreating(false)
  }

  const coincidences = useMemo(() => {
    const text = newProduct.product ?? ''
    if (!text) return []

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
      .filter((el) => el.distance <= 3)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
  }, [newProduct.product, store.products])

  useEffect(() => {
    if (newProduct.product) {
      if (
        store.products.some(
          (el) =>
            el.product?.toLowerCase() == newProduct.product?.toLowerCase(),
        )
      ) {
        setIsUniqueName(false)
      } else {
        setIsUniqueName(true)
      }
    } else {
      setIsUniqueName(undefined)
    }
  }, [newProduct.product])

  return (
    <Drawer
      title="Nuevo producto"
      keyboard={false}
      open={store.drawers.create}
      onClose={() => {
        if (!creating) {
          store.setDrawers({ create: false })
        }
      }}
      width={500}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="Nombre">
          <Input
            placeholder="Nombre"
            value={newProduct.product}
            onChange={(e) =>
              setNewProduct({ ...newProduct, product: e.target.value })
            }
          />
          {isUniqueName === false && (
            <p className="text-sm text-red-600">
              Ya existe un producto con este nombre
            </p>
          )}
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
            <p>Presentaciones similares: </p>
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
              value={newProduct.categoryId}
              onChange={(id) => {
                setNewProduct({
                  ...newProduct,
                  categoryId: id,
                })
              }}
            >
              {store.categories
                .sort((a, b) => a.category.localeCompare(b.category))
                .map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.category}
                  </Select.Option>
                ))}
            </Select>
            <CreateCategory
              onCreate={(id) => {
                setNewProduct({
                  ...newProduct,
                  categoryId: id,
                })
                store.addControlLoadResources()
              }}
            />
          </div>
        </Form.Item>
        <Form.Item label="UM" rules={[{ required: true }]}>
          <div className="flex gap-1">
            <Select
              placeholder="Medida"
              showSearch={true}
              value={newProduct.measureId}
              filterOption={filterSelectForm}
              onChange={(id) => {
                setNewProduct({
                  ...newProduct,
                  measureId: id,
                })
              }}
            >
              {store.measures
                .sort((a, b) => a.measure.localeCompare(b.measure))
                .map((measure) => (
                  <Select.Option key={measure.id} value={measure.id}>
                    {measure.measure}
                  </Select.Option>
                ))}
            </Select>
            <CreateMeasure
              onChange={(insertId: number) => {
                setNewProduct({
                  ...newProduct,
                  measureId: insertId,
                })
                store.addControlLoadResources()
              }}
            />
          </div>
        </Form.Item>
        <Form.Item label="Estado">
          <Checkbox
            checked={Boolean(newProduct.status)}
            onChange={(val) => {
              setNewProduct({
                ...newProduct,
                status: Number(val.target.checked),
              })
            }}
          />
        </Form.Item>
        <div className="flex justify-end">
          <Button
            type="primary"
            onClick={handleCreateProduct}
            disabled={
              !newProduct.product || !newProduct.categoryId || !isUniqueName
            }
            loading={creating}
          >
            Guardar
          </Button>
        </div>
      </Form>
    </Drawer>
  )
}
