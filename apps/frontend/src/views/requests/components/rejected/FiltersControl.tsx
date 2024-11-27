import { Button, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { useRecoilState, useRecoilValue } from 'recoil'

import { FilterAddButton, UserFilters } from '@/components'
import {
  dateRejectedFilterSt,
  filtersUserRejectedSt,
  getFilterTypesForKey,
  validFieldsOptionsRejected,
} from '@/data/requests'
import {
  cashAccountRequestSt,
  categoriesRequestSt,
} from '@/data/resources/state'
import { safeAny } from '@/utils'

const { RangePicker } = DatePicker

export const RequestsFilters: React.FC<{
  applyFilters: () => void
  cleanFilters: () => void
}> = ({ applyFilters, cleanFilters }) => {
  const [dates, setDates] = useRecoilState(dateRejectedFilterSt)
  const [userFilters, setUserFilters] = useRecoilState(filtersUserRejectedSt)
  const categories = useRecoilValue(categoriesRequestSt)
  const cashAccounts = useRecoilValue(cashAccountRequestSt)

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
        <FilterAddButton
          userFilters={userFilters}
          setUserFilters={setUserFilters}
          items={validFieldsOptionsRejected()}
          getFilterTypesForKey={getFilterTypesForKey}
        />
        <UserFilters
          userFilters={userFilters}
          setFilters={setUserFilters}
          getFilterTypesForKey={getFilterTypesForKey}
          items={validFieldsOptionsRejected()}
          selections={{
            category_id: categories.map((el) => ({
              label: el.name,
              value: el.id,
            })),
            cash_id: cashAccounts.map((el) => ({
              label: el.name,
              value: el.id,
            })),
            category_id_cash: cashAccounts.map((el) => ({
              label: el.name,
              value: el.id,
            })),
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
        onClick={cleanFilters}
        danger
      />
    </div>
  )
}
