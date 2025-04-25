import { useQuery } from '@tanstack/react-query'
import {
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { FaTrash } from 'react-icons/fa6'

import { getWarehouses } from '@/data/hex/inventory'
import { WAREHOUSE_TYPE } from '@/data/hex/types'
import { IInvProductItem, IInvSupplier } from '@/data/products/types'
import { IInvPurchase, IInvPurchaseItem } from '@/data/products/types/purchase'
import { filterOption, filterSelectForm, safeAny } from '@/utils'
import { fNumber } from '@/utils/formatNumber'

import { useProductItem } from '../../state/useProductItem'
import { usePurchase } from '../../state/usePurchase'
import { AddProductItemDrawer } from '../productItem/CreateProductItemDrawer'
import { CreateSupplier } from '../productItem/CreateSupplier'
import { SelectCompanyPurchase } from './select_company_pu'

interface INewPurchase extends Partial<Omit<IInvPurchase, 'items'>> {
  items: (Partial<IInvPurchaseItem> & {
    key: number
    brandName?: string
    presentationName?: string
    measureName?: string
  })[]
}
export const CreatePurchaseDrawer: React.FC<{
  suppliers: IInvSupplier[]
}> = ({ suppliers }) => {
  const [newPurchase, setNewPurchase] = useState<INewPurchase>({
    items: [],
    purchaseAt: dayjs().format('YYYY-MM-DD'),
  })
  const [productItems, setProductsList] = useState<Partial<IInvProductItem>[]>(
    [],
  )
  const [igvEnabled, setIgvEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadItems, setLoadItems] = useState(0)
  const [isAvailable, setIsAvailable] = useState(false)
  const { store, createPurchase } = usePurchase()
  const [creating, setCreating] = useState(false)
  const { store: productStore, getOneProductItem } = useProductItem()
  const { getListProductItems } = usePurchase()

  const handleCreate = async () => {
    const finalPurchase = Object.assign({}, newPurchase)
    finalPurchase.items.map((item) => {
      return {
        ...item,
        key: undefined,
        brandName: undefined,
        presentationName: undefined,
        measureName: undefined,
      }
    })
    setCreating(true)
    const result = await createPurchase(finalPurchase as IInvPurchase)
    if (result) {
      setNewPurchase({
        items: [],
      })
      store.setDrawers({ create: false })
    }
    setCreating(false)
  }

  const addNewProductItem = async (insertedId: number) => {
    setLoading(true)
    const productItem = await getOneProductItem(insertedId)
    if (productItem) {
      setLoadItems(loadItems + 1)
      setNewPurchase({
        ...newPurchase,
        items: [
          ...newPurchase.items,
          {
            key: Date.now(),
            itemName: productItem.itemName,
            brandId: productItem.brandId,
            presentationId: productItem.presentationId,
            itemId: productItem.id,
            brandName: productItem.brand?.brand,
            presentationName: productItem.presentation?.presentation,
            unitValue: productItem.unitPrice,
            quantity: 1,
            totalValue: productItem.unitPrice,
          },
        ],
      })
    }
    setLoading(false)
  }

  const queryWarehouses = useQuery({
    queryKey: ['warehouses-purchase'],
    queryFn: async () => {
      const ws = await getWarehouses()
      return ws.filter((el) => el.type == WAREHOUSE_TYPE.WAREHOUSE)
    },
  })

  const tax18percent = useMemo(() => {
    // caluclate 18% igv
    const netValue = newPurchase.items.reduce((acc, item) => {
      return acc + (item.quantity ?? 0) * (item.unitValue ?? 0)
    }, 0)
    return netValue * 0.18
  }, [newPurchase])

  useEffect(() => {
    if (newPurchase.items.length <= 0) {
      setIsAvailable(false)
    } else if (
      newPurchase.items.some(
        (item) =>
          item.itemId == undefined ||
          item.quantity == undefined ||
          item.quantity <= 0,
      ) ||
      !newPurchase.gloss
    ) {
      setIsAvailable(false)
    } else {
      console.log('here')
      setIsAvailable(true)
    }
  }, [newPurchase])

  useEffect(() => {
    const netValue = newPurchase.items.reduce((acc, item) => {
      return acc + (item.quantity ?? 0) * (item.unitValue ?? 0)
    }, 0)
    const middleValue = netValue - (newPurchase.discount ?? 0)
    const defaultTaxValue = igvEnabled ? middleValue * 0.18 : 0
    // const defaultTaxValue = 0
    const totalValue = middleValue + defaultTaxValue
    setNewPurchase({
      ...newPurchase,
      netValue,
      totalValue,
      taxValue: defaultTaxValue,
      // taxValue: defaultTaxValue,
      // taxValue: (newPurchase.taxValue ?? 0) - (newPurchase.discount ?? 0),
    })
  }, [newPurchase.items, newPurchase.discount, igvEnabled])

  useEffect(() => {
    ;(async () => {
      const products = await getListProductItems()
      setProductsList(products)
    })()
  }, [loadItems])

  useEffect(() => {
    setNewPurchase({
      ...newPurchase,
      totalValue:
        (newPurchase.netValue ?? 0) -
        (newPurchase.discount ?? 0) +
        (newPurchase.taxValue ?? 0),
    })
  }, [newPurchase.taxValue])

  return (
    <Drawer
      title="Nueva compra"
      open={store.drawers.create}
      onClose={() => {
        if (creating) return
        store.setDrawers({ create: false })
      }}
      width={900}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="Compañia" required name={'companySap'}>
          <SelectCompanyPurchase
            value={newPurchase.companySap ?? undefined}
            onChange={(val) => {
              setNewPurchase({
                ...newPurchase,
                companySap: val,
              })
            }}
          />
          {/* <SelectTradeMarker
            value={store.filters.companySap?.[1]}
            onChange={(val) => {
              if (val == '')
                store.setFilters({
                  ...store.filters,
                  companySap: undefined,
                })
              else
                store.setFilters({
                  ...store.filters,
                  companySap: [OpFilter.Equal, val],
                })
            }}
          /> */}
        </Form.Item>
        <Form.Item label="Proveedor" required>
          <div className="flex gap-1">
            <Select
              placeholder="Proveedor"
              showSearch={true}
              filterOption={filterSelectForm}
              value={newPurchase.supplierId}
              onChange={(id) => {
                setNewPurchase({
                  ...newPurchase,
                  supplierId: id,
                  supplierName: suppliers.find((supplier) => supplier.id == id)
                    ?.supplier,
                })
              }}
            >
              {suppliers
                .filter((el) => el.status == 1)
                .map((supplier) => (
                  <Select.Option key={supplier.id} value={supplier.id}>
                    {supplier.legalName ?? supplier.supplier}
                  </Select.Option>
                ))}
            </Select>
            <CreateSupplier
              onCreate={(id, supplier) => {
                setNewPurchase({
                  ...newPurchase,
                  supplierId: id,
                  supplierName: supplier,
                })
                store.addControlLoadResources()
              }}
            />
          </div>
        </Form.Item>
        <Form.Item label="Número de factura">
          <Input
            value={newPurchase.numInvoice ?? ''}
            maxLength={15}
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, numInvoice: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item label="Número de guia">
          <Input
            value={newPurchase.numGuide ?? ''}
            maxLength={15}
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, numGuide: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item label="Fecha" required>
          <DatePicker
            allowClear={false}
            value={dayjs(newPurchase.purchaseAt)}
            onChange={(date) =>
              setNewPurchase({
                ...newPurchase,
                purchaseAt: date?.format('YYYY-MM-DD'),
              })
            }
          />
        </Form.Item>

        <Form.Item label="Glosa" required>
          <Input
            placeholder="CARNE,EMBUTIDOS,ETC"
            value={newPurchase.gloss}
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, gloss: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item label="Almacen">
          <Select
            value={newPurchase.warehouseId}
            onChange={(val) => {
              setNewPurchase({
                ...newPurchase,
                warehouseId: val,
              })
            }}
          >
            {queryWarehouses.data?.map((warehouse) => (
              <Select.Option key={warehouse.code} value={warehouse.code}>
                {warehouse.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <div>
          <div className="flex gap-2">
            <p
              className="link text-blue-500 hover:underline cursor-pointer"
              onClick={() => {
                if (loading) return
                setNewPurchase({
                  ...newPurchase,
                  items: [...newPurchase.items!, { key: Date.now() }],
                })
              }}
            >
              + Agregar item de inventario
            </p>
            <p
              className="link text-gray-500 hover:text-blue-500 hover:underline cursor-pointer"
              onClick={() => {
                productStore.setDrawers({ create: true })
              }}
            >
              +Crear y agregar item de inventario
            </p>
          </div>
          <Table
            loading={loading}
            pagination={false}
            rowKey={'key'}
            columns={[
              {
                title: 'Item',
                onCell: () => {
                  return {
                    width: '200px',
                  }
                },
                width: '100%',
                render: (_, record) => {
                  return (
                    <Select
                      style={{ width: 450 }}
                      className="w-full"
                      showSearch={true}
                      filterOption={filterOption as safeAny}
                      size="small"
                      onChange={(_, option) => {
                        const productItem = option as IInvProductItem
                        setNewPurchase({
                          ...newPurchase,
                          items: newPurchase.items.map((item) => {
                            if (item.key === record.key) {
                              return {
                                ...item,
                                // productId: productItem.productId,
                                itemId: productItem.id,
                                itemName: productItem.itemName,
                                brandId: productItem.brandId,
                                brandName: productItem.brand?.brand,
                                presentationId: productItem.presentationId,
                                presentationName:
                                  productItem.presentation?.presentation,
                                // unitValue: productItem.unitPrice,
                                unitValue: 0,
                                quantity: 1,
                                totalValue: 0,
                                // totalValue: productItem.unitPrice,
                                measureName: productItem.product?.measure?.code,
                              }
                            }
                            return item
                          }),
                        })
                      }}
                      value={record.itemId}
                      placeholder="Selecciona"
                      options={productItems
                        .filter((el) => el.status == 1)
                        .map((product) => ({
                          ...product,
                          label: product.itemName,
                          value: product.id,
                        }))}
                    />
                  )
                },
              },
              // {
              //   title: 'Medida',
              //   dataIndex: 'measureName',
              // },
              {
                title: 'P.U.',
                dataIndex: 'unitValue',
                render: (_, record) => {
                  return (
                    <InputNumber
                      size="small"
                      precision={2}
                      value={record.unitValue}
                      onChange={(value) => {
                        setNewPurchase({
                          ...newPurchase,
                          items: newPurchase.items.map((item) => {
                            if (item.key === record.key) {
                              return {
                                ...item,
                                unitValue: value ?? 0,
                                totalValue: (value ?? 0) * (item.quantity ?? 0),
                              }
                            }
                            return item
                          }),
                        })
                      }}
                    />
                  )
                },
              },
              {
                title: 'Q',
                render: (_, record) => {
                  // return <Input size="small" />
                  return (
                    <InputNumber
                      size="small"
                      precision={3}
                      value={record.quantity}
                      onChange={(value) => {
                        setNewPurchase({
                          ...newPurchase,
                          items: newPurchase.items.map((item) => {
                            if (item.key === record.key) {
                              return {
                                ...item,
                                quantity: value ?? 1,
                                totalValue:
                                  (value ?? 1) * (item.unitValue ?? 0),
                              }
                            }
                            return item
                          }),
                        })
                      }}
                    />
                  )
                },
              },
              {
                title: 'P.T.',
                render: (_, record) => {
                  return (
                    <InputNumber
                      size="small"
                      precision={2}
                      value={record.totalValue}
                      onChange={(value) => {
                        setNewPurchase({
                          ...newPurchase,
                          items: newPurchase.items.map((item) => {
                            if (item.key === record.key) {
                              return {
                                ...item,
                                totalValue: value ?? 0,
                                unitValue:
                                  (value ?? 0) /
                                  (item.quantity == 0
                                    ? 1
                                    : (item.quantity ?? 1)),
                              }
                            }
                            return item
                          }),
                        })
                      }}
                    />
                    // <p>
                    //   s/.
                    //   {fNumber(record.totalValue)}
                    // </p>
                  )
                },
              },
              {
                title: '',
                onCell: () => {
                  return {
                    width: '40px',
                  }
                },
                render: (_, record) => {
                  return (
                    <p
                      className="transition-colors text-slate-400 hover:text-slate-800 cursor-pointer hover:underline"
                      onClick={() => {
                        const id = record.key
                        const newItems = newPurchase.items.filter(
                          (item) => item.key !== id,
                        )
                        setNewPurchase({ ...newPurchase, items: newItems })
                      }}
                    >
                      {/* Remover */}
                      <FaTrash />
                    </p>
                  )
                },
              },
            ]}
            dataSource={newPurchase.items}
          />
        </div>
        <div className="my-4 ml-auto w-72 grid grid-cols-2 justify-items-end gap-1">
          <p>Subtotal :</p>
          <p>{fNumber(newPurchase.netValue)}</p>
          <p>Dcto. :</p>
          <InputNumber
            size="small"
            width={'100px'}
            precision={2}
            min={0}
            value={newPurchase.discount ?? 0}
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, discount: e ?? 0 })
            }
          />
          <div className="flex gap-1">
            <label htmlFor="igv">IGV(18%) :</label>
            <Checkbox
              id="igv"
              checked={igvEnabled}
              onChange={(e) => {
                const checked = e.target.checked
                setIgvEnabled(e.target.checked)
                if (checked) {
                  setNewPurchase({ ...newPurchase, taxValue: tax18percent })
                } else {
                  setNewPurchase({ ...newPurchase, taxValue: 0 })
                }
              }}
            />
          </div>
          <InputNumber
            disabled={!igvEnabled}
            size="small"
            width={'80px'}
            precision={2}
            value={newPurchase.taxValue ?? 0}
            // addonAfter={
            //   <div>
            //     <Tooltip title="Calcular el 18%">
            //       <IoReloadOutline
            //         className="cursor-pointer"
            //         onClick={() => {
            //           // console.log('calcular el 18%')
            //         }}
            //       />
            //     </Tooltip>
            //   </div>
            // }
            onChange={(e) => {
              setNewPurchase({ ...newPurchase, taxValue: e ?? 0 })
            }}
          />
          <p>Valor total : </p>
          <p>{fNumber(newPurchase.totalValue)}</p>
        </div>
        <div className="py-3 text-right">
          <Button
            type="primary"
            onClick={handleCreate}
            disabled={!isAvailable || !newPurchase.supplierId}
            loading={creating}
          >
            Guardar
          </Button>
        </div>
      </Form>
      <AddProductItemDrawer onCreate={addNewProductItem} />
    </Drawer>
  )
}
