import { PATHS } from '@/const/paths'
import { viewClient } from '@/lib/rpc'
import { useMutation, useQuery } from '@tanstack/react-query'
import { IRelatedRequirement, REQUIREMENT_STATUS } from '@view'
import { Button, Modal, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

export function RejectModal({
  onChange,
  open,
  id,
  requestId,
}: {
  open: boolean
  onChange: (s: boolean) => void
  id: number
  requestId: number
}) {
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: ['rq:requirement-related', id],
    gcTime: 0,
    queryFn: async () => {
      const request = await viewClient.api.view.requirement.requirementRelated[
        ':id'
      ].$get({
        param: {
          id: id.toString(),
        },
      })

      const data = await request.json()

      return data.data as IRelatedRequirement[]
    },
  })

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([
    requestId,
  ])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<IRelatedRequirement> = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: IRelatedRequirement) => ({
      disabled: record.status != REQUIREMENT_STATUS.PENDING, // Column configuration not to be checked
    }),
  }

  const rejectMt = useMutation({
    mutationFn: async (ids: number[]) => {
      const request =
        await viewClient.api.view.requirement.rejectRequirement.$post({
          json: {
            ids,
          },
        })
      const data = await request.json()
      if (!request.ok) throw new Error('No se pudo rechazar el requerimiento')
      return data
    },
    onSuccess: () => {
      onChange(false)
      navigate(PATHS.erp.modulos.requerimientos.solicitados)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return (
    <Modal
      open={open}
      onCancel={() => onChange(false)}
      title="Rechazar cuotas"
      footer={null}
    >
      <Table
        rowSelection={{ type: 'checkbox', ...rowSelection }}
        rowKey={(id) => id.id}
        size="small"
        pagination={false}
        dataSource={query.data}
        columns={
          [
            {
              title: 'Id',
              dataIndex: 'id',
            },
            {
              title: 'Descripción',
              dataIndex: 'description',
            },
            {
              title: 'Estado',
              dataIndex: 'status',
              render: (status) => {
                if (status == REQUIREMENT_STATUS.PENDING) {
                  return 'Pendiente'
                }
                if (status == REQUIREMENT_STATUS.CANCELLED) {
                  return 'Cancelado'
                }
                if (status == REQUIREMENT_STATUS.APPROVED) {
                  return 'Aprobado'
                }
              },
            },
            {
              title: 'Monto',
              dataIndex: 'value',
            },
          ] satisfies ColumnsType<IRelatedRequirement>
        }
      />
      <div className="flex justify-end mt-2">
        <Button
          type="primary"
          disabled={selectedRowKeys.length === 0}
          onClick={() => {
            rejectMt.mutate(selectedRowKeys as number[])
          }}
        >
          Rechazar
        </Button>
      </div>
    </Modal>
  )
}
