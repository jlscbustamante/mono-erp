import { PATHS } from '@/const/paths'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { IIRequirement } from '../type'

const requirements: IIRequirement[] = [
  {
    id: 1,
    requested_at: '2023-10-01',
    supplier: 'Supplier A',
    num_doc: 'DOC001',
    detail: 'Laptop purchase',
    category: 'IT Equipment',
    costCenter: 'IT',
    created_by: 'John Doe',
    amount: 1200,
  },
  {
    id: 2,
    requested_at: '2023-10-02',
    supplier: 'Supplier B',
    num_doc: 'DOC002',
    detail: 'Office chairs',
    category: 'Furniture',
    costCenter: 'HR',
    created_by: 'Jane Smith',
    amount: 500,
  },
  {
    id: 3,
    requested_at: '2023-10-03',
    supplier: 'Supplier C',
    num_doc: 'DOC003',
    detail: 'Printer ink',
    category: 'Office Supplies',
    costCenter: 'Admin',
    created_by: 'Alice Johnson',
    amount: 150,
  },
  {
    id: 4,
    requested_at: '2023-10-04',
    supplier: 'Supplier D',
    num_doc: 'DOC004',
    detail: 'Desk lamps',
    category: 'Furniture',
    costCenter: 'HR',
    created_by: 'Bob Brown',
    amount: 200,
  },
  {
    id: 5,
    requested_at: '2023-10-05',
    supplier: 'Supplier E',
    num_doc: 'DOC005',
    detail: 'Software licenses',
    category: 'Software',
    costCenter: 'IT',
    created_by: 'Charlie Davis',
    amount: 800,
  },
  {
    id: 6,
    requested_at: '2023-10-06',
    supplier: 'Supplier F',
    num_doc: 'DOC006',
    detail: 'Network cables',
    category: 'IT Equipment',
    costCenter: 'IT',
    created_by: 'Eve White',
    amount: 100,
  },
  {
    id: 7,
    requested_at: '2023-10-07',
    supplier: 'Supplier G',
    num_doc: 'DOC007',
    detail: 'Whiteboards',
    category: 'Office Supplies',
    costCenter: 'Admin',
    created_by: 'Frank Green',
    amount: 300,
  },
  {
    id: 8,
    requested_at: '2023-10-08',
    supplier: 'Supplier H',
    num_doc: 'DOC008',
    detail: 'Projector',
    category: 'IT Equipment',
    costCenter: 'IT',
    created_by: 'Grace Black',
    amount: 600,
  },
  {
    id: 9,
    requested_at: '2023-10-09',
    supplier: 'Supplier I',
    num_doc: 'DOC009',
    detail: 'Stationery',
    category: 'Office Supplies',
    costCenter: 'Admin',
    created_by: 'Henry Blue',
    amount: 50,
  },
  {
    id: 10,
    requested_at: '2023-10-10',
    supplier: 'Supplier J',
    num_doc: 'DOC010',
    detail: 'Conference table',
    category: 'Furniture',
    costCenter: 'HR',
    created_by: 'Ivy Yellow',
    amount: 700,
  },
]
export function DataTable() {
  return (
    <div>
      <Table
        dataSource={requirements}
        size="small"
        bordered
        rowKey={(record) => record.id}
        pagination={false}
        columns={
          [
            {
              title: 'Id',
              dataIndex: 'id',
            },
            {
              title: 'Solicitado',
              dataIndex: 'requested_at',
            },
            {
              title: 'Proveedor',
              dataIndex: 'supplier',
            },
            {
              title: 'N° Doc',
              dataIndex: 'num_doc',
            },
            {
              title: 'Detalle',
              dataIndex: 'detail',
            },
            {
              title: 'Cuota',
              render: () => {
                return '2/3'
              },
            },
            {
              title: 'Registrado por',
              dataIndex: 'costCenter',
            },
            {
              title: 'Monto',
              dataIndex: 'amount',
            },
            {
              title: 'Doc',
              render: () => {
                return <FileText className="text-slate-600" size={18} />
              },
            },
            {
              title: 'Acciones',
              render: () => {
                return (
                  <Link to={PATHS.erp.modulos.requerimientos.review}>
                    Revisar
                  </Link>
                )
              },
            },
          ] satisfies ColumnsType<IIRequirement>
        }
      />
    </div>
  )
}
