import { Button, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { useRecoilState } from 'recoil'

import { dateSimpleFilterSt } from '@/data/requests/state/filters'
import { safeAny } from '@/utils/someAny'

const { RangePicker } = DatePicker

export const RequestsFilters: React.FC<{
  applyFilters: () => void
}> = ({ applyFilters }) => {
  const [dates, setDates] = useRecoilState(dateSimpleFilterSt)

  return (
    <div className="flex items-center gap-1.5 justify-end my-6">
      <div className="flex flex-1 gap-1">
        <RangePicker
          value={dates.map((el) => dayjs(el)) as safeAny}
          allowClear={false}
          onChange={(e: safeAny) => {
            setDates([e[0].format('YYYY-MM-DD'), e[1].format('YYYY-MM-DD')])
          }}
        />
      </div>
      <Button
        type="primary"
        shape="circle"
        icon={<FiSearch />}
        onClick={applyFilters}
        className="flex items-center justify-center"
      />
      <Button
        type="primary"
        color="danger"
        shape="circle"
        icon={<MdOutlineCleaningServices />}
        danger
      />
    </div>
  )
}
