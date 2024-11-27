import { Table, TableColumnsType } from 'antd'
import { BiSolidFilePdf } from 'react-icons/bi'
import { useRecoilValue } from 'recoil'

import {
  availableFiltersUserSt,
  detailedMovesSt,
  endingBalanceDetailedSt,
} from '@/data/cashAccount/state'
import {
  IFilteredRequest,
  RequestTypeCategory,
  Retention,
} from '@/data/requests'
import { fCurrency, safeAny } from '@/utils'
import { fNumber } from '@/utils/formatNumber'
import { openDocsUrls } from '@/utils/openDocsUrls'

import { RequestStatusTag } from '.'

export const TableBalance = () => {
  const { inputs, outputs, initialBalance } = useRecoilValue(detailedMovesSt)
  const filtersUsers = useRecoilValue(availableFiltersUserSt)
  const endingBalance = useRecoilValue(endingBalanceDetailedSt)
  const inputsTable = generateInput(inputs)
  const outputsTable = generateOutput(outputs)
  const columns: TableColumnsType<IFilteredRequest> = [
    {
      title: 'Categoria/Caja',
      dataIndex: 'category',
      key: '11description',
      render: (value, record) => {
        if (record && record.category_move == RequestTypeCategory.Cash)
          return <p>{record.cashAccountCategory?.name}</p>
        if (value && value.name) return <p>{value.name}</p>
        else if (value) return <p>{value}</p>
        else return undefined
      },
      onCell: ((record: safeAny) => {
        if (!record.id) {
          return {
            style: {
              padding: '10px',
              fontWeight: 'bold',
            },
          }
        }
      }) as safeAny,
    },
    {
      title: <BiSolidFilePdf />,
      dataIndex: 'doc_url',
      render: (value) =>
        value ? (
          <BiSolidFilePdf
            className="w-5 h-auto cursor-pointer"
            onClick={() => {
              openDocsUrls(value)
            }}
          />
        ) : (
          ''
        ),
      key: '11doc_url',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: '11description',
    },
    {
      title: 'Solic. por',
      dataIndex: 'created_by',
      key: '11created_by',
      filters: filtersUsers.created_by.map((e) => ({ text: e, value: e })),
      onFilter: (value, record) => {
        const isDescriptive =
          record.category?.name == 'INGRESOS' ||
          record.category?.name == 'SALIDAS'
        return record.created_by == value || isDescriptive
      },
    },
    {
      title: 'Aprob. por',
      dataIndex: 'approved_by',
      key: '11approved_by',
      render: (value, record) => {
        if (record.amount && !record.id) return null
        return value
      },
      filters: filtersUsers.approved_by.map((e) => ({ text: e, value: e })),
      onFilter: (value, record) => {
        const isDescriptive =
          record.category?.name == 'INGRESOS' ||
          record.category?.name == 'SALIDAS'
        return record.approved_by == value || isDescriptive
      },
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: '11status',
      render: (value, record) => {
        if (!record.id) return null
        return <RequestStatusTag status={value} />
      },
    },
    {
      title: 'M. total',
      dataIndex: 'amount',
      key: '11amount',
      align: 'right',
      onCell: ((record: safeAny) => {
        if (!record.id && !record.category?.name) {
          return {
            style: {
              padding: '10px',
            },
          }
        }
      }) as safeAny,
      render: (value: safeAny, record: IFilteredRequest) => {
        if (!record.id && !record.category?.name)
          return <span className="font-bold text-xs">{fNumber(value)}</span>
        else if (!record.id && record.category?.name) return ''
        const realAmount =
          record.retention == Retention.Yes ? record.amount_net : record.amount
        return fNumber(realAmount)
      },
    },
  ]
  return (
    <>
      <div className="flex justify-between mb-2 p-4 bg-gray-50">
        <span>SALDO INICIAL</span>
        <span>{fCurrency(initialBalance)}</span>
      </div>

      <Table
        rowKey={(record: safeAny) =>
          record.id ?? record.category?.name ?? record.amount
        }
        columns={columns}
        dataSource={inputsTable.concat(outputsTable)}
        pagination={false}
      />
      <div className="flex justify-between p-4 bg-gray-50">
        <span>SALDO FINAL</span>
        <span>{fCurrency(endingBalance)}</span>
      </div>
    </>
  )
}

const generateInput = (inputs: IFilteredRequest[]) => {
  let objetoAgrupado = inputs.reduce((resultado: safeAny, objeto: safeAny) => {
    const { approved_by } = objeto

    // Si el grupo aún no existe, lo creamos como un array vacío
    if (!resultado[approved_by]) {
      resultado[approved_by] = []
    }

    // Agregamos el objeto actual al grupo correspondiente
    resultado[approved_by].push(objeto)

    return resultado
  }, {})
  // ordenar por monto en cada grupo
  objetoAgrupado = Object.fromEntries(
    Object.entries(objetoAgrupado).sort((a: safeAny, b: safeAny) => {
      return a[1][0].amount - b[1][0].amount
    }),
  )
  const finalArray: safeAny = [
    {
      key: 'ingre',
      category: { name: 'INGRESOS' },
    },
  ]
  for (const [key, value] of Object.entries(objetoAgrupado)) {
    const requests = value as IFilteredRequest[]
    let sum = 0
    for (const req of requests) {
      const realAmount =
        req.retention == Retention.Yes ? req.amount_net : req.amount
      sum += realAmount ?? 0
      finalArray.push({
        key: req.id,
        ...req,
      })
    }
    finalArray.push({
      key: key + '-in',
      approved_by: key,
      amount: Number(sum.toFixed(2)),
    })
  }

  return finalArray
}

const generateOutput = (inputs: IFilteredRequest[]) => {
  let objetoAgrupado = inputs.reduce((resultado: safeAny, objeto: safeAny) => {
    const { approved_by } = objeto

    // Si el grupo aún no existe, lo creamos como un array vacío
    if (!resultado[approved_by]) {
      resultado[approved_by] = []
    }

    // Agregamos el objeto actual al grupo correspondiente
    resultado[approved_by].push(objeto)

    return resultado
  }, {})
  // ordenar por monto en cada grupo
  objetoAgrupado = Object.fromEntries(
    Object.entries(objetoAgrupado).sort((a: safeAny, b: safeAny) => {
      return a[1][0].amount - b[1][0].amount
    }),
  )
  const finalArray: safeAny = [
    {
      key: 'sald',
      category: { name: 'SALIDAS' },
    },
  ]
  for (const [key, value] of Object.entries(objetoAgrupado)) {
    const requests = value as IFilteredRequest[]
    let sum = 0
    for (const req of requests) {
      const realAmount =
        req.retention == Retention.Yes ? req.amount_net : req.amount
      sum -= realAmount ?? 0
      finalArray.push({
        ...req,
        key: req.id,
        amount: req.amount * -1,
      })
    }
    finalArray.push({
      key: key + '-in',
      amount: Number(sum.toFixed(2)),
    })
  }

  return finalArray
}
