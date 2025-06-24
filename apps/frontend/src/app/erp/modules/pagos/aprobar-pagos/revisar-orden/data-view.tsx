import { PATHS } from '@/const/paths'
import { IAdmRequirementWithSupplierBank } from '@types'
import { Table } from 'antd'
import { format } from 'date-fns'
import { useNavigate } from 'react-router'
import { requirement_type_doc_text } from '../../components/requirement_type_text'

export const DataView = ({
  requirements,
}: {
  requirements: IAdmRequirementWithSupplierBank[]
}) => {
  const navigate = useNavigate()

  return (
    <div>
      <Table
        pagination={false}
        size="small"
        rowKey={'id'}
        bordered={true}
        dataSource={requirements}
        columns={[
          {
            title: 'N°',
            dataIndex: 'request_code',
            render: (val, record) => {
              return (
                <span
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => {
                    navigate(
                      PATHS.erp.modulos.pagos.revisar.replace(
                        ':id',
                        record.id.toString(),
                      ),
                    )
                  }}
                >
                  {val}
                </span>
              )
            },
          },
          {
            title: 'Ruc',
            dataIndex: 'legal_number',
          },
          {
            title: 'Razón social',
            dataIndex: 'legal_name',
          },
          {
            title: 'Tipo cuenta',
            dataIndex: 'bank_account_type',
          },
          {
            title: 'Banco',
            dataIndex: 'bank_name',
          },
          {
            title: 'Nro cuenta',
            dataIndex: 'bank_account_num',
          },
          {
            title: 'Detalle de pago',
            dataIndex: 'description',
          },
          {
            title: 'Importe',
            dataIndex: 'amount',
          },
          {
            title: 'Moneda',
            dataIndex: 'money',
          },
          {
            title: 'Tipo doc',
            dataIndex: 'type_document',
            render: (val) => requirement_type_doc_text(val),
          },
          {
            title: 'Nro doc',
            dataIndex: 'num_document',
          },
          {
            title: 'Fecha emisión',
            dataIndex: 'requested_at',
            render: (val) => {
              return format(new Date(val), 'yyyy-MM-dd')
            },
          },
          {
            title: 'Correo proveedor',
          },
        ]}
      />
    </div>
  )
}
