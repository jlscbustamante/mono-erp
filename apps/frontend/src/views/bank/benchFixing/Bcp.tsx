import { Excel } from 'antd-table-saveas-excel'
import { BsCheckCircleFill } from 'react-icons/bs'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
  bankReconciliationsSt,
  filtersBankReconciliationSt,
} from '@/data/bank/state'
import { IBankReconciliation } from '@/data/bank/types'
import { OpFilter } from '@/data/types/Filters'
import { fCurrency, safeAny } from '@/utils'

import { FiltersComponent } from '../components/FiltersBankReconciliation'
import { TransactionsTable } from '../components/TransactionsTable'

export default function BenchFixingBcp() {
  const [userFilters, setFilters] = useRecoilState(filtersBankReconciliationSt)
  const bankReconciliation = useRecoilValue(bankReconciliationsSt)

  const columns /** : ColumnsType<IBankReconciliation> */ = [
    { title: 'Fecha', dataIndex: 'bnk_date' },
    {
      title: 'Descripción',
      dataIndex: 'bnk_reference',
      excelRender: (reference: string, record: IBankReconciliation) => {
        return reference + ', ' + record.bnk_reference
      },
      render: (reference: string, record: IBankReconciliation) => {
        return (
          <span>
            {record.bnk_operation_text} {reference ? '-' : ''}{' '}
            {record.bnk_reference}
          </span>
        )
      },
    },
    {
      title: 'Id Req',
      dataIndex: 'req_id',
    },
    {
      title: 'Monto Req',
      dataIndex: 'req_amount',
      excelRender: (value: number) => value,
      __cellType__: 'TypeNumeric',
      render: (value: number) => {
        if (!value) return null
        return fCurrency(value)
      },
    },

    {
      title: 'Monto banco',
      dataIndex: 'bnk_amount',
      render: (value: number) => fCurrency(value),
      excelRender: (value: number) => value,
      __cellType__: 'TypeNumeric',
    },
    {
      title: 'Saldo',
      dataIndex: 'bnk_balance',
      // excelRender: (value: number | null) => value,
      excelRender: (value: number) => value,
      __cellType__: 'TypeNumeric',
      render: (value: number) => fCurrency(value),
    },
    {
      title: 'Estado',
      className: 'text-center text-gray-200',
      render: (record: IBankReconciliation) => {
        const color = record.req_id ? 'text-blue-600' : ''
        return <BsCheckCircleFill className={color} />
      },
    },
  ]

  const handleExport = () => {
    const excel = new Excel()
    excel
      .addSheet('Conciliación')
      .addColumns(columns.slice(0, -1) as safeAny)
      .addDataSource(bankReconciliation)
      .saveAs('bcp-reconciliacion.xlsx')
  }

  return (
    <div className="p-3">
      <FiltersComponent
        userFilters={userFilters}
        setUserFilters={setFilters}
        baseFilters={{ bnk_name: [OpFilter.Contain, 'bcp'] }}
        onExport={handleExport}
      />
      <TransactionsTable columns={columns} />
    </div>
  )
}
