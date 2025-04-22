import { Button, Table } from 'antd'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { requirement_type_doc_text } from '../../components/requirement_type_text'
import {
  AgregarRequerimiento,
  useAgregarRequerimiento,
} from './agregar-requirement'
import { useCreateOrderStore } from './state'

export const DataView = () => {
  const { open } = useAgregarRequerimiento()

  const requirements = useCreateOrderStore((st) => st.requirements)

  return (
    <div>
      <AgregarRequerimiento />
      <div className="flex justify-end mb-3 items-center gap-2">
        <p>Adicionar pago</p>
        <Button type="primary" size="small" onClick={open}>
          <Plus />
        </Button>
      </div>
      <Table
        rowKey={'id'}
        pagination={false}
        size="small"
        bordered={true}
        dataSource={requirements}
        columns={[
          {
            title: 'Nro',
            dataIndex: 'id',
          },
          {
            title: 'RUC DEL PROVEEDOR (11 digitos)',
            dataIndex: 'legal_number',
          },
          {
            title: 'RÁZON SOCIAL (se consideran lkos primeros 60 caracteres)',
            dataIndex: 'legal_name',
          },
          {
            title: 'TIPO DE CUENTA',
          },
          {
            title: 'CUENTA SCOTIABANK (10 digitos)',
          },
          {
            title: 'CUENTA INTERBANCARIA(CCI)',
          },
          {
            title: 'DETALLE PAGO',
            dataIndex: 'description',
          },
          {
            title: 'IMPORTE',
            dataIndex: 'amount',
          },
          {
            title: 'TIPO DE DOCUMENTO DE PAGO',
            dataIndex: 'type_document',
            render: (val) => requirement_type_doc_text(val),
          },
          {
            title: 'N° DOCUMENTO (max 20 caracteres)',
            dataIndex: 'num_document',
          },
          {
            title: 'FECHA EMISION DOCUMENTO',
            dataIndex: 'requested_at',
            render: (val) => format(new Date(val), 'yyyy-MM-dd'),
          },
          {
            title: 'CORREO ELECTRONICO',
          },
        ]}
      />
    </div>
  )
}
