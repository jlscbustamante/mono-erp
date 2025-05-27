import { viewClient } from '@/lib/rpc'
import { AdmRequirementSelect } from '@types'
import { Button, Table } from 'antd'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import { requirement_type_doc_text } from '../../components/requirement_type_text'
import {
  AgregarRequerimiento,
  useAgregarRequerimiento,
} from './agregar-requirement'
import { useCreateOrderStore } from './state'

export const DataView = ({ initial_ids }: { initial_ids: number[] }) => {
  const { open } = useAgregarRequerimiento()

  const requirements = useCreateOrderStore((st) => st.requirements)
  const set_requirements = useCreateOrderStore((st) => st.set_requirements)

  const load_initial_requirements = async () => {
    console.log('calling apis : ids . ', initial_ids)
    const req = await viewClient.api.view.payment.get_requirements_by_ids.$get({
      query: { ids: initial_ids.join(',') },
    })
    const data = await req.json()
    if (!req.ok) {
      throw new Error(data.message)
    } else {
      const requirements_founded = data.data as AdmRequirementSelect[]
      set_requirements(requirements_founded)
    }
  }

  useEffect(() => {
    if (initial_ids.length > 0) {
      load_initial_requirements()
    }
  }, [initial_ids])

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
            title: 'N°',
            dataIndex: 'id',
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
          },
          {
            title: 'Banco',
          },
          {
            title: 'Nro cuenta',
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
            title: 'Tipo doc',
            dataIndex: 'type_document',
            render: (val) => requirement_type_doc_text(val),
          },
          {
            title: 'Nro doc',
            dataIndex: 'num_document',
          },
          {
            title: 'Fecha emsión',
            dataIndex: 'requested_at',
            render: (val) => format(new Date(val), 'yyyy-MM-dd'),
          },
          {
            title: 'Correo proveedor',
          },
        ]}
      />
    </div>
  )
}
