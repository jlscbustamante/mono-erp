import { filterSelectForm } from '@/utils'
import { useSucursales } from '@/views/products/components/stock/hooks/useSucursales'
import { Button, DatePicker, Select } from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { useAsistenciaContext } from '.'

const RangePicker = DatePicker.RangePicker

export const NavAsistencia = () => {
  const query = useSucursales()
  const { store, dates, setStore, setDates, addController, isLoading } =
    useAsistenciaContext()

  const handleSearch = () => {
    addController()
  }

  useEffect(() => {
    if (query.data) {
      setStore(query.data[0].code)
    }
  }, [query.data])

  return (
    <div className="">
      <div className="flex gap-1">
        <Select
          allowClear={false}
          className="w-auto min-w-52"
          value={store}
          onChange={setStore}
          showSearch
          filterOption={filterSelectForm}
          placeholder="Tiendas"
        >
          {query.data?.map((el) => {
            return (
              <Select.Option key={el.code} value={el.code}>
                {el.name}
              </Select.Option>
            )
          })}
        </Select>
        <RangePicker
          value={[dayjs(dates[0]), dayjs(dates[1])]}
          onChange={(val: any) => {
            setDates([val[0].format('YYYY-MM-DD'), val[1].format('YYYY-MM-DD')])
          }}
          allowClear={false}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<FiSearch />}
          onClick={handleSearch}
          loading={isLoading}
        />
        <Button
          type="primary"
          color="danger"
          shape="circle"
          icon={<MdOutlineCleaningServices />}
          // onClick={() => setFilters({})}
          danger
        />
      </div>
    </div>
  )
}
