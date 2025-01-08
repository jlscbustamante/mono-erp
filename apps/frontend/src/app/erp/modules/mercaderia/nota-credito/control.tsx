import { useMutation } from '@tanstack/react-query'
import { Button, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { Search } from 'lucide-react'
import { toast } from 'react-toastify'
import { useGenerateCredito } from './generate-credite-note'
import { useNotaCreditoStore } from './state'

const getListNotaCreadito = async (date: string) => {
  const data = await fetch(
    'https://facturacion.pizzaraul.com/api/search' +
      `?date=${date}&company_id=ERPRAUL$type=NOTACREDITO`,
  )
  if (!data.ok) throw new Error('No se pudo consultar la nota de credito')
  const res = (await data.json()) as { search: any[] }
  return res.search
}

export const Control = () => {
  const date = useNotaCreditoStore((st) => st.date)
  const { open } = useGenerateCredito()
  const changeDate = useNotaCreditoStore((st) => st.changeDate)

  const handleSearch = useMutation({
    mutationFn: getListNotaCreadito,
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return (
    <div className="flex gap-1 items-center justify-between">
      <div className="flex gap-1 items-center">
        <DatePicker
          value={dayjs(date)}
          onChange={(val) => {
            if (val) changeDate(val.format('YYYY-MM-DD') ?? '')
          }}
          allowClear={false}
        />
        <Button
          loading={handleSearch.isPending}
          size="small"
          type="primary"
          shape="circle"
          icon={<Search className="w-4 h-auto" />}
          //
          onClick={() => handleSearch.mutate(date)}
          className="flex items-center justify-center"
        />
      </div>
      <Button type="primary" onClick={() => open()}>
        Nuevo
      </Button>
    </div>
  )
}
