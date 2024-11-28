import { deleteDriver } from '@/data/hex/inventory'
import { useMutation } from '@tanstack/react-query'
import { Modal, Table } from 'antd'
import { Carrier } from 'pizzadb'
import { MdDelete, MdModeEditOutline } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useFilterDrivers } from './state'
import { useUpdateDriverDrawer } from './update-driver-drawer'

export const DriverTable = () => {
  const query = useFilterDrivers()
  const { open } = useUpdateDriverDrawer()

  const deleteMt = useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => {
      query.refetch()
    },
    onError: (err) => {
      toast.error(err.message, {
        autoClose: false,
      })
    },
  })
  // return <div>{JSON.stringify(query.data?.data)}</div>

  return (
    <Table
      loading={query.isLoading}
      pagination={false}
      rowKey={(record) => record.id}
      size="small"
      dataSource={query.data?.data}
      showSorterTooltip={false}
      columns={[
        {
          title: 'Id',
          dataIndex: 'id',
          sorter: (a, b) => a.id - b.id,
        },
        {
          title: 'Compañia',
          dataIndex: 'transportName',
          sorter: (a, b) => a.transportName.localeCompare(b.transportName),
        },
        {
          title: 'RUC',
          dataIndex: 'carrierDocNumber',
          sorter: (a, b) =>
            a.carrierDocNumber?.localeCompare(b.carrierDocNumber),
        },
        {
          title: 'Conductor',
          render: (record: Carrier) =>
            `${record.driverFirstName} ${record.driverLastName}`,
          sorter: (a, b) => a.driverFirstName.localeCompare(b.driverFirstName),
        },

        // {
        //   title: 'Transporte',
        //   dataIndex: 'transportCompanyName',
        // },
        {
          title: 'Placa',
          dataIndex: 'transportPlateNumber',
        },
        {
          title: 'Tipo doc.',
          dataIndex: 'driverTypeDoc',
          sorter: (a, b) => a.driverTypeDoc.localeCompare(b.driverTypeDoc),
        },
        {
          title: 'N° doc.',
          dataIndex: 'driverDocNumber',
        },

        {
          title: 'Estado',
          dataIndex: 'status',
          render: (value) => (
            <span>{value == '1' ? 'Activo' : 'Inactivo'}</span>
          ),
        },
        {
          render: (_, record: Carrier) => {
            return (
              <div className="flex justify-evenly items-center">
                <MdModeEditOutline
                  className="w-5 h-auto cursor-pointer"
                  onClick={() => open(record)}
                />
                <MdDelete
                  className="w-5 h-auto cursor-pointer"
                  onClick={() =>
                    Modal.confirm({
                      title: 'Eliminar',
                      content: '¿Está seguro de eliminar este conductor?',
                      onOk: () => {
                        deleteMt.mutate(record.id)
                      },
                    })
                  }
                />
              </div>
            )
          },
        },
      ]}
    />
  )
}
