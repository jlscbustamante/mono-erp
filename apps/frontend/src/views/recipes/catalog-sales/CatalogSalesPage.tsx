import { Tabs } from 'antd'
import ProductList from './components/ProductList'
import SizeList from './components/SizeList'
import FlavorList from './components/FlavorList'

const items = [
  { key: 'products', label: 'Productos', children: <ProductList /> },
  { key: 'sizes', label: 'Tamaños', children: <SizeList /> },
  { key: 'flavors', label: 'Sabores', children: <FlavorList /> }
]

export default function CatalogSalesPage() {
  return <Tabs defaultActiveKey="products" items={items} />
}
