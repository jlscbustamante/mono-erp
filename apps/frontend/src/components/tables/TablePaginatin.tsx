import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'

interface ITablePaginationProps<T> {
  datasource?: T[]
  columns?: ColumnsType<T>
}

export const TablePagination = <T,>(props: ITablePaginationProps<T>) => {
  return (
    <Table
      dataSource={(props.datasource as any) ?? []}
      columns={(props.columns as any) ?? []}
    />
  )
}
