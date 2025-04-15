import { PATHS } from '@/const/paths'
import { Table } from 'antd'
import { useNavigate } from 'react-router'

export function DataView() {
  const navigate = useNavigate()
  return (
    <div>
      <Table
        size="small"
        pagination={false}
        dataSource={[
          {
            nro: '13213',
          },
        ]}
        columns={[
          {
            title: 'Nro',
            dataIndex: 'nro',
            render: (val) => {
              return (
                <span
                  className="hover:underline cursor-pointer"
                  onClick={() =>
                    navigate(PATHS.erp.modulos.pagos.aprobarPagos.revisarOrden)
                  }
                >
                  {val}
                </span>
              )
            },
          },
          {
            title: 'Fecha emision',
          },
          {
            title: 'Tipo de operación',
          },
          {
            title: 'Importe',
          },
          {
            title: 'Moneda',
          },
          {
            title: 'Empresa',
          },
          {
            title: 'Cuenta',
          },
          {
            title: 'Autoriza1',
          },
          {
            title: 'Autoriza2',
          },
          {
            title: 'Programado por',
          },
          {
            title: 'Estado',
          },
        ]}
      />
    </div>
  )
}
