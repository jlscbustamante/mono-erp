import {
  Button,
  Checkbox,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import {
  IInvProductItem,
  ItemRelationship,
  ItemType,
} from '@/data/products/types'
import { filterSelectForm } from '@/utils'

import { useProduct } from '../../state/useProduct'
import { useProductItem } from '../../state/useProductItem'
import { CreateBrand } from './CreateBrand'
import { CreatePresentation } from './CreatePresentation'
import { CreateSupplier } from './CreateSupplier'

export const AddProductItemDrawer: React.FC<{
  onCreate?: (insertedId: number) => void
}> = ({ onCreate }) => {
  const { store: productStore, loadMeasures } = useProduct()
  const { store: storeItems } = useProductItem()
  const [isUniqueName, setIsUniqueName] = useState<boolean | undefined>(
    undefined,
  )
  const {
    store,
    createProduct,
    loadBrands,
    loadPresentations,
    getListProducts,
    loadSuppliers,
  } = useProductItem()
  const [resetName, setResetName] = useState(0)
  const [newProduct, setNewProduct] = useState<Partial<IInvProductItem>>({
    status: 1,
    relationShip: ItemRelationship.PRINCIPAL,
    itemType: ItemType.TRANSFORMABLE,
  })
  const [controlCreations, setControlCreations] = useState(0)
  const [creating, setCreating] = useState(false)
  const [optionsProduct, setOptionsProduct] = useState<
    {
      label: string
      value: number
      measureId: number
    }[]
  >([])

  useEffect(() => {
    if (newProduct.itemName) {
      if (
        storeItems.productItems.some(
          (el) =>
            el.itemName.toLowerCase() == newProduct.itemName?.toLowerCase(),
        )
      ) {
        setIsUniqueName(false)
      } else {
        setIsUniqueName(true)
      }
    } else {
      setIsUniqueName(undefined)
    }
  }, [newProduct.itemName])

  const handleCreateProduct = async () => {
    try {
      setCreating(true)
      const insertedId = await createProduct(newProduct)
      if (insertedId) {
        setNewProduct({
          status: 1,
          relationShip: ItemRelationship.PRINCIPAL,
          itemType: ItemType.TRANSFORMABLE,
        })
        onCreate?.(insertedId)
      }
      setCreating(false)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const setNameProduct = () => {
    if (
      newProduct.productId &&
      newProduct.presentationId &&
      newProduct.brandId &&
      newProduct.supplierId
    ) {
      const productName =
        optionsProduct.find((product) => product.value === newProduct.productId)
          ?.label ?? 'producto no definido'
      const brandName =
        store.brands.find((brand) => brand.id === newProduct.brandId)?.brand ??
        'marca no definida'
      const presentationName =
        store.presentations.find(
          (presentation) => presentation.id === newProduct.presentationId,
        )?.presentation ?? 'presentacion no definida'
      const supplierName =
        store.suppliers.find(
          (supplier) => supplier.id === newProduct.supplierId,
        )?.supplier ?? 'proveedor no definido'
      const brandAndSupplier =
        supplierName.toLowerCase() == brandName.toLowerCase()
          ? supplierName
          : `${supplierName} - ${brandName}`
      setNewProduct({
        ...newProduct,
        itemName: `${productName} - ${brandAndSupplier} - ${presentationName}`,
      })
    }
  }

  useEffect(() => {
    setNameProduct()
  }, [
    newProduct.brandId,
    newProduct.presentationId,
    newProduct.productId,
    newProduct.supplierId,
    resetName,
  ])

  useEffect(() => {
    loadMeasures()
  }, [productStore.controlLoadResources])

  useEffect(() => {
    ;(async () => {
      await Promise.all([loadBrands(), loadPresentations(), loadSuppliers()])
      setResetName(resetName + 1)
    })()
  }, [controlCreations])

  useEffect(() => {
    ;(async () => {
      const optionsProducts = await getListProducts()
      setOptionsProduct(
        optionsProducts.map((product) => ({
          label: product.product,
          value: product.id,
          measureId: product.measureId,
        })),
      )
    })()
  }, [])

  return (
    <Drawer
      title="Nuevo item de inventario"
      keyboard={false}
      open={store.drawers.create}
      onClose={() => {
        if (!creating) {
          store.setDrawers({ create: false })
        }
      }}
      width={500}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelWrap>
        {/* <Form.Item label="Nombre">
          <Input
            placeholder="Nombre"
            value={newProduct.itemName}
            onChange={(e) =>
              setNewProduct({ ...newProduct, itemName: e.target.value })
            }
          />
        </Form.Item> */}
        <Form.Item label="Tipo">
          <Select
            value={newProduct.relationShip}
            onChange={(id) => {
              setNewProduct({
                ...newProduct,
                relationShip: id,
              })
            }}
          >
            <Select.Option key={'O'} value={'O'}>
              Origen
            </Select.Option>
            <Select.Option key={'D'} value={'D'}>
              Derivado
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Subcategoría">
          <Select
            placeholder="Subcategoría"
            showSearch={true}
            filterOption={filterSelectForm}
            value={newProduct.productId}
            onChange={(id) => {
              console.log('id : ', id)
              console.log(
                'element : ',
                optionsProduct.find((product) => product.value === id),
              )
              setNewProduct({
                ...newProduct,
                productId: id,
                measureId:
                  optionsProduct.find((product) => product.value === id)
                    ?.measureId ?? undefined,
              })
            }}
          >
            {optionsProduct
              .sort((a, b) => a.label.localeCompare(b.label))
              .map((product) => (
                <Select.Option key={product.value} value={product.value}>
                  {product.label}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item label="Proveedor">
          <div className="flex gap-1">
            <Select
              placeholder="Proveedor"
              showSearch={true}
              filterOption={filterSelectForm}
              value={newProduct.supplierId}
              onChange={(id) => {
                setNewProduct({
                  ...newProduct,
                  supplierId: id,
                })
              }}
            >
              {store.suppliers
                .sort((a, b) => a.supplier.localeCompare(b.supplier))
                .map((supplier) => (
                  <Select.Option key={supplier.id} value={supplier.id}>
                    {supplier.supplier}
                  </Select.Option>
                ))}
            </Select>
            <CreateSupplier
              onCreate={(id) => {
                setNewProduct({
                  ...newProduct,
                  supplierId: id,
                })
                setControlCreations(controlCreations + 1)
              }}
            />
          </div>
        </Form.Item>
        <Form.Item label="Marca">
          <div className="flex gap-1">
            <Select
              placeholder="Marca"
              showSearch={true}
              filterOption={filterSelectForm}
              value={newProduct.brandId}
              onChange={(id) => {
                setNewProduct({
                  ...newProduct,
                  brandId: id,
                })
              }}
            >
              {store.brands
                .sort((a, b) => a.brand.localeCompare(b.brand))
                .map((brand) => (
                  <Select.Option key={brand.id} value={brand.id}>
                    {brand.brand}
                  </Select.Option>
                ))}
            </Select>
            <CreateBrand
              onCreate={(id) => {
                setNewProduct({
                  ...newProduct,
                  brandId: id,
                })
                setControlCreations(controlCreations + 1)
              }}
            />
          </div>
        </Form.Item>
        <Form.Item label="Presentación">
          <div className="flex gap-1">
            <Select
              placeholder="Presentacion"
              showSearch={true}
              filterOption={filterSelectForm}
              value={newProduct.presentationId}
              onChange={(id) => {
                setNewProduct({
                  ...newProduct,
                  presentationId: id,
                })
              }}
            >
              {store.presentations
                .sort((a, b) => a.presentation.localeCompare(b.presentation))
                .map((presentation) => (
                  <Select.Option key={presentation.id} value={presentation.id}>
                    {presentation.presentation}
                  </Select.Option>
                ))}
            </Select>
            <CreatePresentation
              onCreate={(id) => {
                setNewProduct({
                  ...newProduct,
                  presentationId: id,
                })
                setControlCreations(controlCreations + 1)
              }}
            />
          </div>
        </Form.Item>

        <Form.Item label="Nombre">
          <Input
            readOnly
            placeholder="Nombre autogenerado"
            value={newProduct.itemName}
            onChange={(e) =>
              setNewProduct({ ...newProduct, itemName: e.target.value })
            }
          />
          {isUniqueName === false && (
            <p className="text-sm text-red-600">
              Ya existe un item con estas propiedades
            </p>
          )}
        </Form.Item>
        <Form.Item label="Unidad base">
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
              {productStore.measures
                .sort((a, b) => a.measure.localeCompare(b.measure))
                .map((measure) => (
                  <Select.Option key={measure.id} value={measure.id}>
                    {measure.measure}
                  </Select.Option>
                ))}
            </Select>
            {/* <CreateMeasure
              onChange={(insertId: number) => {
                setNewProduct({
                  ...newProduct,
                  measureId: insertId,
                })
                productStore.addControlLoadResources()
              }}
            /> */}
          </div>
        </Form.Item>
        <Form.Item label="Precio Almacen">
          <InputNumber
            placeholder="0.0"
            precision={2}
            min={0}
            value={newProduct.unitCost}
            onChange={(val) =>
              setNewProduct({ ...newProduct, unitCost: val ?? 0.0 })
            }
            onBlur={() => {
              setNewProduct({
                ...newProduct,
                unitPrice: newProduct.unitCost ?? 0.0,
              })
            }}
          />
        </Form.Item>

        <Form.Item label="Precio Despacho">
          <InputNumber
            placeholder="0.0"
            precision={2}
            min={0}
            value={newProduct.unitPrice}
            onChange={(val) =>
              setNewProduct({ ...newProduct, unitPrice: val ?? 0.0 })
            }
          />
        </Form.Item>

        <Form.Item label="Item para">
          <Select
            value={newProduct.itemType}
            onChange={(val) => {
              setNewProduct({
                ...newProduct,
                itemType: val,
              })
            }}
          >
            <Select.Option value={ItemType.DIRECT_SALE}>
              Venta directa
            </Select.Option>
            <Select.Option value={ItemType.TRANSFORMABLE}>
              Ingrediente
            </Select.Option>
            {/* <Select.Option value={ItemType.PRODUCED}>Producción</Select.Option> */}
          </Select>
        </Form.Item>
        {/* <Form.Item label="Item de inventario">
          <Select showSearch filterOption={filterSelectForm}>
            {storeItems.productItems
              ?.sort((a, b) => {
                return a.itemName.localeCompare(b.itemName)
              })
              .map((el) => {
                return (
                  <Select.Option key={el.id} value={el.id}>
                    {el.itemName}
                  </Select.Option>
                )
              })}
          </Select>
        </Form.Item> */}
        {/* <Form.Item label="Usado para">
          <Select
            value={newProduct.usedTo?.toString()}
            onChange={(val) => {
              setNewProduct({
                ...newProduct,
                usedTo: val,
              })
            }}
          >
            <Select.Option value={'2'}>Para inventario</Select.Option>
            <Select.Option value={'1'}>Para despacho</Select.Option>
            <Select.Option value={'5'}>Para ambos</Select.Option>
          </Select>
        </Form.Item> */}
        {/* <Form.Item label="¿Despacho?">
          <Select
            value={newProduct.toDispatch?.toString()}
            onChange={(val) => {
              setNewProduct({
                ...newProduct,
                toDispatch: val,
              })
            }}
          >
            <Select.Option value={'1'}>Sí, se despacha</Select.Option>
            <Select.Option value={'0'}>No</Select.Option>
          </Select>
        </Form.Item> */}

        <Form.Item
          // wrapperCol={{ offset: 8, span: 16 }}
          label="Activo"
        >
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
            disabled={!newProduct.itemName || !isUniqueName}
            type="primary"
            onClick={handleCreateProduct}
            loading={creating}
          >
            Guardar
          </Button>
        </div>
      </Form>
    </Drawer>
  )
}
