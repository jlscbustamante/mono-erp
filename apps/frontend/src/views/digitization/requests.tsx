import { Button, DatePicker, Drawer, Input, Modal, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useState } from 'react'
import { FaFilePdf } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/digitization/sdk'
import { admFilesSt } from '@/data/digitization/state/documents'
import { filtersDocumentSt } from '@/data/digitization/state/filterDocuments'
import { IAdmFile } from '@/data/digitization/types'
import { Filters, OpFilter } from '@/data/types/Filters'
import { openDocsUrls } from '@/utils/openDocsUrls'
import { safeAny } from '@/utils/someAny'

import { FormEditDocument } from './components/FormEditDocument'

const { RangePicker } = DatePicker

export default function RequestsDigitization() {
  const [admFiles, setAdmFiles] = useRecoilState(admFilesSt)
  const [selectedFile, setSelectedFile] = useState<IAdmFile | null>(null)
  const filtersDocument = useRecoilValue(filtersDocumentSt)
  const handlerFilter = async () => {
    const filters: Filters<IAdmFile> = {
      doc_date: [
        OpFilter.RangeDate,
        filtersDocument.doc_date[0],
        filtersDocument.doc_date[1],
      ],
    }
    if (filtersDocument.created_by)
      filters.created_by = [OpFilter.Contain, filtersDocument.created_by]
    if (filtersDocument.doc_number)
      filters.doc_number = [OpFilter.Contain, filtersDocument.doc_number]
    if (filtersDocument.doc_request)
      filters.doc_request = [OpFilter.Equal, filtersDocument.doc_request]
    const data = await sdk.filter(filters)
    setAdmFiles(data)
  }

  const handlerDelete = async (id: number) => {
    try {
      await sdk.deleteDocument(id)
      setSelectedFile(null)
      await handlerFilter()
      toast.info('Eliminado correctamente', NOTIFICATION.success)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  return (
    <div className="container mx-auto p-3">
      <FiltersRc handlerFilter={handlerFilter} />
      <Files
        admFiles={admFiles}
        setSelectedFile={setSelectedFile}
        handlerDelete={handlerDelete}
      />
      {selectedFile && (
        <Drawer
          title="Editar documento"
          open={true}
          onClose={() => setSelectedFile(null)}
        >
          <FormEditDocument
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        </Drawer>
      )}
    </div>
  )
}

const Files: React.FC<{
  admFiles: IAdmFile[]
  setSelectedFile: safeAny
  handlerDelete: safeAny
}> = ({ admFiles, setSelectedFile, handlerDelete: onDelete }) => {
  const columns: ColumnsType<IAdmFile> = [
    { title: 'Id', dataIndex: 'id', key: 'id' },
    { title: 'Tipo', dataIndex: 'doc_type', key: 'type' },
    {
      title: 'Fecha de escaneo',
      dataIndex: 'doc_date',
      key: 'date',
      render: (date: string) => {
        return date.split(' ')[0]
      },
    },
    {
      title: 'Id req.',
      dataIndex: 'doc_request',
      key: 'idRequerimiento',
    },
    {
      title: 'Detalle req.',
      dataIndex: ['requirement', 'description'],
    },
    {
      title: 'Subido por',
      dataIndex: 'created_by',
      key: 'created_by',
    },
    {
      title: <FaFilePdf className="w-4 h-auto" />,
      dataIndex: 'doc_url',
      key: 'url',
      render: (record) => {
        return (
          <FaFilePdf
            className="w-5 h-auto cursor-pointer"
            onClick={() => {
              openDocsUrls(record)
            }}
          />
        )
      },
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setSelectedFile(record)
            }}
          >
            Editar
          </a>
          <a
            onClick={() => {
              Modal.confirm({
                title: 'Eliminar documento',
                content: '¿Seguro que desea eliminar este documento?',
                onOk: () => {
                  onDelete(record.id)
                },
              })
            }}
          >
            Eliminar
          </a>
        </Space>
      ),
    },
  ]
  return (
    <Table
      rowKey={'id'}
      columns={columns}
      expandable={{
        rowExpandable: (record: IAdmFile) => !!record.doc_description,
        expandedRowRender: (record: IAdmFile) => {
          return <p style={{ margin: 0 }}>{record.doc_description}</p>
        },
      }}
      dataSource={admFiles}
      pagination={false}
    />
  )
}
const FiltersRc: React.FC<{ handlerFilter: safeAny }> = ({ handlerFilter }) => {
  const [filtersDocument, setFiltersDocument] =
    useRecoilState(filtersDocumentSt)

  return (
    <div className="flex gap-3 my-4">
      <RangePicker
        value={filtersDocument.doc_date.map((el) => dayjs(el)) as safeAny}
        onChange={(e: safeAny) => {
          setFiltersDocument({
            ...filtersDocument,
            doc_date: [e[0].format('YYYY-MM-DD'), e[1].format('YYYY-MM-DD')],
          })
        }}
        allowClear={false}
      />
      <Input
        className="w-64"
        placeholder="Creado por"
        value={filtersDocument.created_by}
        onChange={(e) => {
          setFiltersDocument({
            ...filtersDocument,
            created_by: e.target.value,
          })
        }}
      />
      <Input
        className="w-64"
        placeholder="N° Doc"
        value={filtersDocument.doc_number}
        onChange={(e) =>
          setFiltersDocument({ ...filtersDocument, doc_number: e.target.value })
        }
      />
      <Input
        className="w-64"
        placeholder="Id de requerimiento"
        value={filtersDocument.doc_request}
        onChange={(e) =>
          setFiltersDocument({
            ...filtersDocument,
            doc_request: e.target.value,
          })
        }
      />
      {/* <InputNumber placeholder="Id de requerimiento" /> */}
      <Button type="primary" onClick={handlerFilter}>
        Buscar
      </Button>
    </div>
  )
}
