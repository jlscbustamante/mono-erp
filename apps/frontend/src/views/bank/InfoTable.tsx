import { Button, Card, DatePicker, List, Popover } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { AiFillCheckCircle, AiFillInfoCircle } from 'react-icons/ai'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { delay, safeAny } from '@/utils'

const { RangePicker } = DatePicker

export default function InfoTable() {
  const [dates, setDates] = useState([
    dayjs().format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ])

  return (
    <div className="p-3">
      <div className="flex justify-center gap-2">
        <RangePicker
          value={dates.map((el) => dayjs(el)) as safeAny}
          allowClear={false}
          onChange={(e: safeAny) =>
            setDates([e[0].format('YYYY-MM-DD'), e[1].format('YYYY-MM-DD')])
          }
        />
        <Button type="primary">Buscar</Button>
      </div>
      <div className="flex flex-col gap-3 my-3 w-1/2 max-w-3xl mx-auto">
        <CardElement
          data={[
            { id: 1, description: 'LOREM IPSUM', amount: 4565.6 },
            { id: 2, description: 'LOREM IPSUM', amount: 4565.6 },
            {
              id: 1,
              description: 'TOTAL',
              amount: 4565.6,
              type: 'title',
            },
          ]}
        />
        <CardElement
          data={[
            { id: 1, description: 'LOREM IPSUM', amount: 4565.6 },
            {
              id: 2,
              description: 'LOREM IPSUM INFO',
              amount: 4565.6,
              info: 'Tiene asientos desde 2023-04-01 hasta 2023-04-30, cambie las fechas para poder generar asientos en las fechas faltantes',
            },
            {
              id: 1,
              description: 'TOTAL',
              amount: 4565.6,
              type: 'title',
            },
          ]}
        />
        <CardElement
          data={[
            { id: 1, description: 'LOREM IPSUM', amount: 4565.6 },
            { id: 2, description: 'LOREM IPSUM', amount: 4565.6, state: 'T' },
            { id: 2, description: 'LOREM IPSUM', amount: 4565.6 },
            {
              id: 1,
              description: 'TOTAL',
              amount: 4565.6,
              type: 'title',
            },
          ]}
        />
      </div>
    </div>
  )
}

export const CardElement: React.FC<{
  data: {
    id: number
    description: string
    amount: number
    type?: 'title'
    state?: 'T'
    info?: string
  }[]
}> = ({ data }) => {
  const [loading, setLoading] = useState(false)
  const handleGenerate = async () => {
    try {
      setLoading(true)
      await delay(1800)
      toast.info('Asientos generados correctamente', NOTIFICATION.info)
    } catch (err: any) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Card
      size="small"
      title={
        <div className="text-right">
          <Button
            type="default"
            onClick={handleGenerate}
            loading={loading}
            disabled={data.some((el) => el.info)}
          >
            Generar asientos
          </Button>
        </div>
      }
    >
      <List
        dataSource={data}
        renderItem={(item) => {
          if (item.type == 'title') {
            return (
              <List.Item className="flex justify-between font-bold">
                <span>{item.description}</span>
                <span>{item.amount}</span>
              </List.Item>
            )
          }
          return (
            <List.Item className="flex justify-between">
              <span>
                {item.id}.- {item.description}
              </span>
              <span>{item.amount}</span>
              <GetOptionItem
                item={item}
                loading={loading}
                handleGenerate={handleGenerate}
              />
            </List.Item>
          )
        }}
      />
    </Card>
  )
}

const GetOptionItem: React.FC<{
  item: any
  loading: boolean
  handleGenerate: () => void
}> = ({ item, loading, handleGenerate }) => {
  if (item.info)
    return (
      <Popover
        trigger={'hover'}
        content={<div className="w-56">{item.info}</div>}
      >
        <div>
          <AiFillInfoCircle className="w-5 h-auto text-yellow-500 cursor-pointer" />
        </div>
      </Popover>
    )
  else if (item.state != 'T')
    return (
      <Button size="small" loading={loading} onClick={handleGenerate}>
        Generar
      </Button>
    )
  else return <AiFillCheckCircle className="w-5 h-auto text-lime-600" />
}
