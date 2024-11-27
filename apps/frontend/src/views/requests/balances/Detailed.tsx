import { Button, DatePicker, Select } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import {
  detailedReportSt,
  reportRequestFiltersSt,
} from '@/data/cashAccount/state'
// import * as sdk from '@/data/cashAccount/sdk'
import * as sdk from '@/data/requests/sdk'
import { cashAccountRequestSt } from '@/data/resources/state'
import { filterOption, safeAny } from '@/utils'

import { TableBalance } from '../components'

export default function DetailedBalance() {
  const filters = useRecoilValue(reportRequestFiltersSt)
  const [detailedReport, setDetailedReport] = useRecoilState(detailedReportSt)

  const handlerLoadReport = async () => {
    try {
      if (filters.cashId == null) return
      const data = await sdk.detailedReport(filters.cashId, filters.date)
      setDetailedReport(data)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  return (
    <div className="container mx-auto p-3">
      <Filters onLoadReport={handlerLoadReport} />
      {detailedReport && <TableBalance />}
    </div>
  )
}
const Filters: React.FC<{ onLoadReport: () => void }> = ({ onLoadReport }) => {
  const cashAccounts = useRecoilValue(cashAccountRequestSt)
  const [filter, setFilter] = useRecoilState(reportRequestFiltersSt)
  return (
    <div className="flex gap-2 my-4">
      <DatePicker
        value={dayjs(filter.date)}
        onChange={(e: any) => {
          setFilter({
            ...filter,
            date: e.format('YYYY-MM-DD'),
          })
        }}
        allowClear={false}
      />
      <Select
        showSearch
        placeholder="Caja"
        optionFilterProp="children"
        value={filter.cashId}
        onChange={(e) => {
          setFilter({
            ...filter,
            cashId: e,
          })
        }}
        style={{ width: 210 }}
        filterOption={filterOption as safeAny}
        options={cashAccounts.map((e) => {
          return {
            value: e.id,
            label: e.name,
          }
        })}
      />
      <Button type="primary" onClick={onLoadReport}>
        Buscar
      </Button>
    </div>
  )
}
