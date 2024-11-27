import { Excel } from 'antd-table-saveas-excel'
import { useRecoilValue } from 'recoil'

import { ExcelExportBtn } from '@/components/excel-btn'
import {
  IFilteredRequest,
  pendingRequestsSt,
  pendingTypeFilterSt,
  RequestType,
  RequestTypeCategory,
} from '@/data/requests'
import { AccountFlow } from '@/data/types/accountFlow'
import { getNameRequestType } from '@/utils'

import { columnsTable } from '..'

export const ButtonExport = () => {
  const pendingRequests = useRecoilValue(pendingRequestsSt)
  const typeFilter = useRecoilValue(pendingTypeFilterSt)
  const handleExport = () => {
    if (typeFilter === RequestType.Simple) {
      handleSimpleExport(pendingRequests)
    } else if (typeFilter == RequestType.Supplier) {
      handleProviderExport(pendingRequests)
    } else if (typeFilter == RequestType.Transfer) {
      handleTransferExport(pendingRequests)
    } else if (typeFilter == RequestType.Liquidation) {
      handleLiquidationExport(pendingRequests)
    }
  }
  return (
    // <Button type="text" onClick={handleExport}>
    //   Exportar
    // </Button>
    <ExcelExportBtn onExport={handleExport} />
  )
}
const handleSimpleExport = (pendingRequests: IFilteredRequest[]) => {
  const columnsToExport = [
    columnsTable.id,
    columnsTable.request_type,
    columnsTable.requested_at,
    columnsTable.description,
    {
      title: 'Categoría',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    // columnsTable.cash,
    {
      title: 'Caja',
      dataIndex: 'cashName',
      key: 'cash',
    },
    columnsTable.requested_by,
    columnsTable.amount,
    columnsTable.amountRet,
    columnsTable.amountNet,
  ]

  const requestsByTypes = pendingRequests.reduce(
    (
      acc: { toLiquidate: IFilteredRequest[]; simple: IFilteredRequest[] },
      el: IFilteredRequest,
    ) => {
      if (el.category_move === RequestTypeCategory.Cash)
        acc.toLiquidate.push(el)
      else if (el.category_move === RequestTypeCategory.Category)
        acc.simple.push(el)
      return acc
    },
    {
      toLiquidate: [],
      simple: [],
    },
  )

  const excel = new Excel()
  excel.addSheet('simples').addRow()
  excel.addColumns([
    {
      title: 'Requerimientos Simples',
      dataIndex: '',
    },
  ])
  excel.addColumns(columnsToExport).addDataSource(
    requestsByTypes.simple.map((el) => {
      const record = Object.assign({}, el)
      const categoryName = record.category?.name ?? ''
      const cashName = record.cashAccount?.name ?? ''

      return {
        ...record,
        categoryName,
        cashName,
        request_type: getNameRequestType(record.request_type),
      }
    }),
    {
      str2Percent: true,
    },
  )
  excel.addRow()
  excel.addRow()
  excel.addColumns([
    {
      title: 'Requerimientos simples por liquidar',
      dataIndex: '',
    },
  ])
  excel
    .addColumns(
      columnsToExport.map((col) => {
        if (col.dataIndex == 'categoryName')
          return {
            title: 'Caja salida',
            dataIndex: 'categoryName',
            key: 'categoryName',
          }
        else if (col.dataIndex == 'cashName')
          return {
            title: 'Caja destino',
            dataIndex: 'cashName',
            key: 'cashName',
          }

        return col
      }),
    )
    .addDataSource(
      requestsByTypes.toLiquidate.map((el) => {
        const record = Object.assign({}, el)
        const categoryName = record.cashAccountCategory?.name ?? ''
        const cashName = record.cashAccount?.name ?? ''
        return {
          ...record,
          categoryName,
          cashName,
          request_type: getNameRequestType(record.request_type),
        }
      }),
      {
        str2Percent: true,
      },
    )
  excel.saveAs('requerimientos-pendientes-simple.xlsx')
}

const handleProviderExport = (pendingRequests: IFilteredRequest[]) => {
  const columnsToExport = [
    columnsTable.id,
    columnsTable.requested_at,
    columnsTable.legal_name,
    columnsTable.num_document,
    columnsTable.legal_number,
    columnsTable.description,
    columnsTable.cash,
    columnsTable.requested_by,
    columnsTable.amount,
    columnsTable.amountRet,
    columnsTable.amountNet,
  ]

  const excel = new Excel()
  excel.addSheet('Proveedores')
  excel
    .addColumns(columnsToExport)
    .addDataSource(pendingRequests)
    .saveAs('requerimientos-pendientes-proveedores.xlsx')
}

const handleTransferExport = (pendingRequests: IFilteredRequest[]) => {
  const columnsToExport = [
    columnsTable.id,
    columnsTable.requested_at,
    {
      title: 'Caja salida',
      dataIndex: 'cashOrigin',
      key: 'cashOrigin',
    },
    {
      title: 'Caja destino',
      dataIndex: 'cashDestiny',
      key: 'cashDestiny',
    },
    columnsTable.description,
    columnsTable.requested_by,
    columnsTable.amount,
  ]
  const excel = new Excel()
  excel
    .addSheet('Transferencias')
    .addColumns(columnsToExport)
    .addDataSource(
      pendingRequests.map((el) => {
        let cashOrigin = ''
        let cashDestiny = ''
        if (el.account_flow == AccountFlow.Input) {
          cashOrigin = el.cashAccountCategory?.name ?? ''
          cashDestiny = el.cashAccount?.name ?? ''
        } else {
          cashOrigin = el.cashAccount?.name ?? ''
          cashDestiny = el.cashAccountCategory?.name ?? ''
        }
        return {
          ...el,
          cashOrigin,
          cashDestiny,
        }
      }),
    )
  excel.saveAs('requerimientos-pendientes-transferencias.xlsx')
}

const handleLiquidationExport = (pendingRequests: IFilteredRequest[]) => {
  const columnsToExport = [
    columnsTable.id,
    columnsTable.requested_at,
    columnsTable.legal_name,
    columnsTable.num_document,
    columnsTable.legal_number,
    columnsTable.category,
    columnsTable.description,
    columnsTable.cash,
    columnsTable.requested_by,
    columnsTable.amount,
    columnsTable.amountRet,
    columnsTable.amountNet,
  ]
  const excel = new Excel()
  excel.addSheet('Liquidaciones')
  excel
    .addColumns(columnsToExport)
    .addDataSource(pendingRequests)
    .saveAs('requerimientos-pendientes-liquidaciones.xlsx')
}
