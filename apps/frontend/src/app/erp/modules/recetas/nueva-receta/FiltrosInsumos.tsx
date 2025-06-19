import { cn } from '@/utils/cn'
import { Button, Input, Space } from 'antd'
import { ChangeEvent, useState } from 'react'
import { IngredienteProd } from '../shared-types'

export const FiltrosInsumos = ({
  childToParent,
}: {
  childToParent: (pCatSelected: number, pNeedle: string) => IngredienteProd[]
}) => {
  const [catSelected, setCatSelected] = useState(0)
  const [needle, setNeedle] = useState('')

  //childToParent es una funcion que es enviada porel padre para
  //que desde el hijo se envien datos

  //manejador de eventos de la caja de busqueda
  const handleNeedle = (event: ChangeEvent<HTMLInputElement>) => {
    const needle = event.target.value.trim()
    console.log('texto buscado' + needle)
    setNeedle(needle)
  }

  const handlePredefinedFilters = (customFilter: number) => {
    console.log('Clic en :' + customFilter)
    setCatSelected(customFilter)
  }
  return (
    <>
      {/* Caja de busqueda */}
      <Input.Search
        size="large"
        value={needle}
        allowClear
        onSearch={() => childToParent(catSelected, needle)}
        placeholder="buscar colección, ingredientes"
        onChange={handleNeedle}
      />
      <Space>
        <Button
          className={cn(
            'bg-slate-200 px-2 py-0.5 text-sm text-slate-600 cursor-pointer select-none hover:bg-blue-300 hover:text-white w-20 text-center',
            {
              'bg-blue-500 hover:bg-blue-500 text-white': 22 === catSelected,
            },
          )}
          onClick={() => handlePredefinedFilters(22)}
        >
          Colección
        </Button>
        <Button
          // color="default"
          // variant="solid"
          onClick={() => handlePredefinedFilters(9)}
        >
          Quesos
        </Button>
        <Button onClick={() => handlePredefinedFilters(3)}>Latas</Button>
        <Button onClick={() => handlePredefinedFilters(8)}>Verduras</Button>
      </Space>
    </>
  )
}
