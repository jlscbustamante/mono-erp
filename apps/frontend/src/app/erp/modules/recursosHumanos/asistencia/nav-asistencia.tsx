import { ExcelExportBtn } from '@/components/excel-btn'
import { filterSelectForm } from '@/utils'
import { useSucursales } from '@/views/products/components/stock/hooks/useSucursales'
import { Button, DatePicker, Select } from 'antd'
import { Excel } from 'antd-table-saveas-excel'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useAsistenciaContext } from '.'

const RangePicker = DatePicker.RangePicker

export const NavAsistencia = () => {
  const query = useSucursales()
  const {
    store,
    data,
    dates,
    setStore,
    setDates,
    addController,
    isLoading,
    columns,
    users,
    userId,
    setUserId,
    isLoadingUsers,
  } = useAsistenciaContext()

  const handleSearch = () => {
    addController()
  }

  const handleExport = () => {
    const date = dates[0] === dates[1] ? dates[0] : `${dates[0]}-${dates[1]}`
    const excel = new Excel()
    excel
      .addSheet('Asistencia')
      .addColumns(columns as any)
      .addDataSource(data)
      .saveAs(`Asistencia-${date}.xlsx`)
  }

  useEffect(() => {
    if (query.data) {
      // setStore(query.data[0].code)
    }
  }, [query.data])

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-1">
        <Select
          allowClear={false}
          className="w-auto min-w-52"
          value={store}
          onChange={setStore}
          showSearch
          filterOption={filterSelectForm}
          placeholder="Tiendas"
          defaultValue={''}
        >
          <Select.Option value={''}>SIN TIENDA</Select.Option>
          {query.data?.map((el) => {
            return (
              <Select.Option key={el.code} value={el.code}>
                {el.name}
              </Select.Option>
            )
          })}
        </Select>
        <Select
          className="w-auto min-w-52"
          loading={isLoadingUsers}
          showSearch
          allowClear
          filterOption={filterSelectForm}
          placeholder
          onChange={setUserId}
          value={userId}
        >
          {users?.map((el) => {
            return (
              <Select.Option key={el.id} value={el.id}>
                {`${el.first_name} ${el.last_name}`}
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
      </div>
      <ExcelExportBtn onExport={handleExport} />
    </div>
  )
}
