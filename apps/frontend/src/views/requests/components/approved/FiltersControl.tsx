import { Button, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { FilterAddButton, UserFilters } from '@/components'
import { NOTIFICATION } from '@/const/notification'
import {
  approvedRequestsSt,
  approvedTypeFilterSt,
  countFiltersApprovedSt,
  dateApprovedFilterSt,
  filtersUserApprovedSt,
  getFilterTypesForKey,
  IRequest,
  requestChangesSt,
  RequestStatus,
  validFieldsOptionsApproved,
} from '@/data/requests'
import * as sdk from '@/data/requests/sdk'
import {
  cashAccountRequestSt,
  categoriesRequestSt,
  costCentersSt,
} from '@/data/resources/state'
import { Filters, OpFilter } from '@/data/types/Filters'
import { safeAny } from '@/utils'

import { transformFilterToValid } from '../../utils'

const { RangePicker } = DatePicker

export const RequestsFilters = () => {
  const setApprovedRequests = useSetRecoilState(approvedRequestsSt)
  const [dates, setDates] = useRecoilState(dateApprovedFilterSt)
  const [userFilters, setUserFilters] = useRecoilState(filtersUserApprovedSt)
  const categories = useRecoilValue(categoriesRequestSt)
  const cashAccounts = useRecoilValue(cashAccountRequestSt)
  const costCenters = useRecoilValue(costCentersSt)
  const setCountFilters = useSetRecoilState(countFiltersApprovedSt)
  const typeFilter = useRecoilValue(approvedTypeFilterSt)
  const requestChanges = useRecoilValue(requestChangesSt)

  const filterBase: Filters<IRequest> = {
    approved_at: [OpFilter.RangeDate, dates[0], dates[1]],
    status: [
      OpFilter.In,
      RequestStatus.Approved,
      RequestStatus.Closed,
      RequestStatus.Registered,
    ],
    request_type: [OpFilter.Equal, typeFilter, requestChanges],
  }

  const countResponsesFilter = async (filters: Filters<IRequest>) => {
    try {
      const newFilt = Object.assign({}, filters)
      delete newFilt.request_type
      const resultNum = await sdk.countRequests(newFilt)
      setCountFilters(resultNum)
    } catch (err: any) {
      console.log('Error conteo filtros')
    }
  }

  const applyFilters = async () => {
    try {
      const validFilterUsers = transformFilterToValid(userFilters)
      const data = await sdk.requests({ ...filterBase, ...validFilterUsers })
      countResponsesFilter({ ...filterBase, ...validFilterUsers })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  const cleanFilters = async () => {
    try {
      setUserFilters({})
      const data = await sdk.requests({ ...filterBase })
      countResponsesFilter({ ...filterBase })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  useEffect(() => {
    applyFilters()
  }, [userFilters, typeFilter, requestChanges])

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
          items={validFieldsOptionsApproved()}
          getFilterTypesForKey={getFilterTypesForKey}
        />
        <UserFilters
          userFilters={userFilters}
          setFilters={setUserFilters}
          getFilterTypesForKey={getFilterTypesForKey}
          items={validFieldsOptionsApproved()}
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
            cost_center_id: costCenters.map((el) => ({
              label: el.origin,
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
