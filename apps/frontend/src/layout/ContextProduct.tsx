import { message } from 'antd'
import { MessageInstance } from 'antd/es/message/interface'
import { createContext, useContext } from 'react'

interface IProductContext {
  messageApi: MessageInstance
}

const ProductContext = createContext<IProductContext | null>(null)

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [messageApi, contextHolder] = message.useMessage()
  return (
    <ProductContext.Provider value={{ messageApi }}>
      {contextHolder}
      {children}
    </ProductContext.Provider>
  )
}

export const useContextProduct = (): IProductContext => {
  const prod = useContext(ProductContext)
  if (!prod)
    throw new Error('useContextProduct must be used within a ProductProvider')

  return prod as IProductContext
}
