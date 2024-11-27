import { useQuery } from '@tanstack/react-query'
import { Table } from 'antd/lib'
import { MdEdit } from 'react-icons/md'
import { useNavigate } from 'react-router'

import { getTemplateBase, TemplateType } from '@/data/products/sdk'
import { PATHS } from '@/router/paths'
import { TemplateBase } from '@/views/products/templates/useStore'

import { getTemplateTypeName } from './templateTypeName'

export const TemplatesTable = () => {
  const query = useData()
  const navigate = useNavigate()

  const onEdit = (element: TemplateBase) => {
    navigate(`${PATHS.products.editTemplates}/${element.id}`)
  }

  return (
    <div>
      <Table
        rowKey={(record) => record.id}
        loading={query.isLoading}
        pagination={false}
        size="small"
        columns={[
          {
            title: 'Id',
            dataIndex: 'id',
          },
          {
            title: 'Nombre',
            dataIndex: 'name',
          },
          {
            title: 'Tipo',
            dataIndex: 'type',
            render: (type: TemplateType) => {
              return getTemplateTypeName(type)
            },
          },
          {
            title: '',
            width: 80,
            align: 'center',
            render: (record: TemplateBase) => {
              return (
                <p>
                  <MdEdit
                    className="h-auto w-5 cursor-pointer"
                    onClick={() => onEdit(record)}
                  />
                </p>
              )
            },
          },
        ]}
        dataSource={query.data}
      />
    </div>
  )
}

const useData = () => {
  const query = useQuery({
    queryKey: ['templates-inventory'],
    queryFn: getTemplateBase,
  })

  return query
}
