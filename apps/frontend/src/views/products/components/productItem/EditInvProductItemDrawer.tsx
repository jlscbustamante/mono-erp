import { Button, Checkbox, Drawer, Form, Input, Select, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { IInvProductItem, ItemType } from '@/data/products/types'
import { fCurrency, filterSelectForm } from '@/utils'

import { useProduct } from '../../state/useProduct'
import { useProductItem } from '../../state/useProductItem'
// import { CreateBrand } from './CreateBrand'
// import { CreatePresentation } from './CreatePresentation'
import { CreateSupplier } from './CreateSupplier'

export const EditProductItemDrawer = () => {
  const {
    store,
    loadBrands,
    loadPresentations,
    getListProducts,
    loadSuppliers,
    getOneProductItem,
    editProductItem,
  } = useProductItem()
  const { store: productStore } = useProduct()
  const [product, setEditProductItem] = useState<IInvProductItem | undefined>(
    undefined,
  )
  const [isUniqueName, setIsUniqueName] = useState<boolean | undefined>(
    undefined,
  )

  useEffect(() => {
    if (!product) return
    if (product.itemName) {
      if (
        store.productItems.some(
          (el) =>
            el.itemName.toLowerCase() == product.itemName?.toLowerCase() &&
            el.id !== product.id,
        )
      ) {
        setIsUniqueName(false)
      } else {
        setIsUniqueName(true)
      }
    } else {
      setIsUniqueName(undefined)
    }
  }, [product?.itemName])

  const [controlCreations, setControlCreations] = useState(0)
  const [editing, setEditing] = useState(false)
  const [optionsProduct, setOptionsProduct] = useState<
    {
      label: string
      value: number
    }[]
  >([])

  useEffect(() => {
    if (product) {
      const productName =
        optionsProduct.find((optprod) => optprod.value == product.productId)
          ?.label ?? 'producto no definido'
      const brandName =
        store.brands.find((brand) => brand.id === product.brandId)?.brand ??
        'marca no definida'
      const presentationName =
        store.presentations.find(
          (presentation) => presentation.id === product.presentationId,
        )?.presentation ?? 'presentacion no definida'
      const providerName =
        store.suppliers.find((supplier) => supplier.id === product.supplierId)
          ?.supplier ?? 'proveedor no definido'

      const brandAndSupplier =
        providerName.toLowerCase() == brandName.toLowerCase()
          ? providerName
          : `${providerName} - ${brandName}`
      setEditProductItem({
        ...product,
        itemName: `${productName} - ${brandAndSupplier} - ${presentationName}`,
      })
    }
  }, [
    product?.brandId,
    product?.presentationId,
    product?.productId,
    product?.supplierId,
  ])

  const handleEditProduct = async () => {
    try {
      setEditing(true)
      await editProductItem(product as IInvProductItem)
      setEditing(false)
      store.setEditProductItemId(undefined)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  useEffect(() => {
    ;(async () => {
      await Promise.all([loadBrands(), loadPresentations(), loadSuppliers()])
    })()
  }, [controlCreations])

  useEffect(() => {
    ;(async () => {
      if (store.editProductItemId) {
        const productResponse = await getOneProductItem(store.editProductItemId)
        setEditProductItem(productResponse)
      } else {
        setEditProductItem(undefined)
      }
    })()
  }, [store.editProductItemId])

  useEffect(() => {
    ;(async () => {
      const optionsProducts = await getListProducts()
      setOptionsProduct(
        optionsProducts.map((product) => ({
          label: product.product,
          value: product.id,
        })),
      )
    })()
  }, [])

  return (
    <Drawer
      title="Editar item de producto"
      keyboard={false}
      open={store.drawers.edit}
      onClose={() => {
        if (!editing) {
          // store.setDrawers({ edit: false })
          store.setEditProductItemId(undefined)
        }
      }}
      width={500}
    >
      {product ? (
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="Id">
            <Input readOnly value={product.id} />
          </Form.Item>
          <Form.Item label="Tipo">
            <Select
              value={product.relationShip}
              onChange={(id) => {
                setEditProductItem({
                  ...product,
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
          <Form.Item label="Producto">
            <Select
              placeholder="Producto"
              showSearch={true}
              filterOption={filterSelectForm}
              value={product.productId}
              onChange={(id) => {
                setEditProductItem({
                  ...product,
                  productId: id,
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
                value={product.supplierId}
                onChange={(id) => {
                  setEditProductItem({
                    ...product,
                    supplierId: id,
                  })
                }}
              >
                {store.suppliers.map((supplier) => (
                  <Select.Option key={supplier.id} value={supplier.id}>
                    {supplier.supplier}
                  </Select.Option>
                ))}
              </Select>
              <CreateSupplier
                onCreate={(id) => {
                  setEditProductItem({
                    ...product,
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
                value={product.brandId}
                onChange={(id) => {
                  setEditProductItem({
                    ...product,
                    brandId: id,
                  })
                }}
              >
                {store.brands.map((brand) => (
                  <Select.Option key={brand.id} value={brand.id}>
                    {brand.brand}
                  </Select.Option>
                ))}
              </Select>
              {/* <CreateBrand
                onCreate={(id) => {
                  setEditProductItem({
                    ...product,
                    brandId: id,
                  })
                  setControlCreations(controlCreations + 1)
                }}
              /> */}
            </div>
          </Form.Item>
          <Form.Item label="Presentación">
            <div className="flex gap-1">
              <Select
                placeholder="Presentacion"
                showSearch={true}
                filterOption={filterSelectForm}
                value={product.presentationId}
                onChange={(id) => {
                  setEditProductItem({
                    ...product,
                    presentationId: id,
                  })
                }}
              >
                {store.presentations.map((presentation) => (
                  <Select.Option key={presentation.id} value={presentation.id}>
                    {presentation.presentation}
                  </Select.Option>
                ))}
              </Select>
              {/* <CreatePresentation
                onCreate={(id) => {
                  setEditProductItem({
                    ...product,
                    presentationId: id,
                  })
                  setControlCreations(controlCreations + 1)
                }}
              /> */}
            </div>
          </Form.Item>

          <Form.Item label="Nombre">
            <Input
              readOnly
              placeholder="Nombre"
              value={product.itemName}
              onChange={(e) =>
                setEditProductItem({
                  ...product,
                  itemName: e.target.value,
                })
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
                value={product.measureId}
                filterOption={filterSelectForm}
                onChange={(id) => {
                  setEditProductItem({
                    ...product,
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
            <Input
              readOnly
              placeholder="0.0"
              // precision={2}
              min={0}
              value={fCurrency(product.unitCost)}
              // onChange={(val) =>
              //   setEditProductItem({ ...product, unitCost: val ?? 0.0 })
              // }
            />
          </Form.Item>

          <Form.Item label="Precio Despacho">
            <Input
              placeholder="0.0"
              // precision={2}
              min={0}
              value={fCurrency(product.unitPrice)}
              // onChange={(val) =>
              //   setEditProductItem({ ...product, unitPrice: val ?? 0.0 })
              // }
            />
          </Form.Item>
          <Form.Item label="Item para">
            <Select
              value={product.itemType}
              onChange={(val) => {
                setEditProductItem({
                  ...product,
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
              {/* <Select.Option value={ItemType.PRODUCED}>
                Producción
              </Select.Option> */}
            </Select>
          </Form.Item>
          {/* <Form.Item label="Despacho para">
            <Select
              value={product.toDispatch?.toString()}
              onChange={(val) => {
                setEditProductItem({
                  ...product,
                  toDispatch: val,
                })
              }}
            >
              <Select.Option value={'0'}>Almacen</Select.Option>
              <Select.Option value={'1'}>Tienda</Select.Option>
            </Select>
          </Form.Item> */}
          <Form.Item
            // wrapperCol={{ offset: 8, span: 16 }}
            label="Activo"
          >
            <Checkbox
              checked={Boolean(product.status)}
              onChange={(val) => {
                setEditProductItem({
                  ...product,
                  status: Number(val.target.checked),
                })
              }}
            />
          </Form.Item>
          <div className="flex justify-end">
            <Button
              disabled={!isUniqueName}
              type="primary"
              onClick={handleEditProduct}
              loading={editing}
            >
              Guardar
            </Button>
          </div>
        </Form>
      ) : (
        <div className="w-full h-full flex items-center justify-center gap-4">
          <Spin />
          <p>Cargando...</p>
        </div>
      )}
    </Drawer>
  )
}
