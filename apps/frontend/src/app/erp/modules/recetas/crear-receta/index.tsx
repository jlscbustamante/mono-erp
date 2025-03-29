import { ColumnsType } from "antd/es/table"
import { Attendance } from "pizzadb"
import { createContext, useContext } from "react"

const RecetaContext = createContext<any>(null)

export const CrearRecetaPage = () => {

    
        
}


export const userRecetaContext = () => {
  const context = useContext(RecetaContext)
  if(!context){
    throw new Error('useRecetaContext debe estar dentro del proveedor')
  }
    return context as {
        data: Attendance[]
        isLoading: boolean
        addController: () => void
        columns: ColumnsType<Attendance>
    }
}