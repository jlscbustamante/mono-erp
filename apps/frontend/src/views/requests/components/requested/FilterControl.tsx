import { Button, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { FilterAddButton, UserFilters } from '@/components'
import { NOTIFICATION } from '@/const/notification'
import {
  countFiltersRequestedSt,
  dateSimpleFilterSt,
  filtersUserRequestedSt,
  getFilterTypesForKey,
  IRequest,
  pendingRequestsSt,
  pendingTypeFilterSt,
  requestChangesSt,
  RequestStatus,
  validFieldsOptionsPending,
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
  const [dates, setDates] = useRecoilState(dateSimpleFilterSt)
  const [userFilters, setUserFilters] = useRecoilState(filtersUserRequestedSt)
  const categories = useRecoilValue(categoriesRequestSt)
  const cashAccounts = useRecoilValue(cashAccountRequestSt)
  const costCenter = useRecoilValue(costCentersSt)
  const [loadingFilters, setLoadingFilters] = useState(false)
  const typeFilter = useRecoilValue(pendingTypeFilterSt)
  const setCountFilters = useSetRecoilState(countFiltersRequestedSt)
  const setPendingRequests = useSetRecoilState(pendingRequestsSt)
  const requestsChanges = useRecoilValue(requestChangesSt)

  const filterBase: Filters<IRequest> = {
    requested_at: [OpFilter.RangeDate, dates[0], dates[1]],
    status: [OpFilter.In, RequestStatus.Pending],
    request_type: [OpFilter.Equal, typeFilter],
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
      setLoadingFilters(true)
      const validFilterUsers = transformFilterToValid(userFilters)
      const data = await sdk.requests({ ...filterBase, ...validFilterUsers })
      countResponsesFilter({ ...filterBase, ...validFilterUsers })
      setPendingRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setLoadingFilters(false)
    }
  }

  const cleanFilters = async () => {
    try {
      setUserFilters({})
      const data = await sdk.requests({ ...filterBase })
      countResponsesFilter({ ...filterBase })
      setPendingRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  useEffect(() => {
    applyFilters()
  }, [userFilters, typeFilter, requestsChanges])

  return (
    <div className="flex items-center gap-1.5 justify-end my-6">
      <div className="flex flex-1 gap-1 items-center">
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
          getFilterTypesForKey={getFilterTypesForKey}
          items={validFieldsOptionsPending()}
        />
        <UserFilters
          userFilters={userFilters}
          setFilters={setUserFilters}
          getFilterTypesForKey={getFilterTypesForKey}
          items={validFieldsOptionsPending()}
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
            cost_center_id: costCenter.map((el) => ({
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
        loading={loadingFilters}
      />
      <Button
        type="primary"
        color="danger"
        shape="circle"
        icon={<MdOutlineCleaningServices />}
        onClick={cleanFilters}
        danger
        loading={loadingFilters}
      />
    </div>
  )
}
