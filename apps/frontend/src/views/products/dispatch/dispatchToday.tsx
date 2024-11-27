import { List } from 'antd'
import dayjs from 'dayjs'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

import { PATHS } from '@/router/paths'

import { ButtonDispatchToday } from '../components/distpatch/ButtonDispatchToday'
import { useDispatchToday } from '../state/useDispatchToday'

const DispatchToday = () => {
  const date = dayjs().format('YYYY-MM-DD')
  const navigate = useNavigate()

  return (
    <div className="p-3">
      <header className="flex flex-col gap-2 justify-start">
        <p
          className="flex items-center gap-1 hover:underline cursor-pointer w-min"
          onClick={() => navigate(PATHS.products.dispatchItem)}
        >
          <IoIosArrowRoundBack />
          <span>Regresar</span>
        </p>
        <div>
          <h3 className="font-semibold text-zinc-900">
            Despachos <span className="font-normal text-base">{date}</span>
          </h3>
        </div>
      </header>
      <div className="py-2">
        <ListSucursals date={date} />
      </div>
    </div>
  )
}

const ListSucursals = ({ date }: { date: string }) => {
  const { data, isLoading, refetch } = useDispatchToday(date)
  // const socket = io(
  //   'https://pos.pizzaraul.work/skt/websocket/event/erp/erp-to-pos',
  // )

  const notify = (storeCode: string) => {
    fetch('https://pos.pizzaraul.work/skt/websocket/event/erp/erp-to-pos', {
      method: 'POST',
      body: JSON.stringify({
        message: storeCode,
      }),
    }).catch((err) => console.log(err))
  }

  return (
    <List
      className="w-96"
      loading={isLoading}
      dataSource={data}
      renderItem={(item) => {
        return (
          <List.Item>
            <span>{item.title}</span>
            {item.count > 0 ? (
              <span>Despachado</span>
            ) : (
              <ButtonDispatchToday
                date={date}
                sucursalId={item.id}
                sucursalNombre={item.title}
                onSuccess={(storeCode) => {
                  notify(storeCode)
                  refetch()
                }}
              />
            )}
          </List.Item>
        )
      }}
    />
  )
}

export default DispatchToday
