import {
  Button,
  DatePicker,
  Dropdown,
  Modal,
  Progress,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useState } from 'react'
import { AiOutlineInbox } from 'react-icons/ai'
import { FiSearch } from 'react-icons/fi'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import {
  fieldsFilterPaymentFile,
  optionsFilterPaymentFile,
} from '@/data/digitization/const'
import * as sdk from '@/data/digitization/sdk'
import {
  paymentFilesBankSt,
  paymentFilesFiltersBankSt,
} from '@/data/digitization/state/paymentFiles'
import { IPaymentFile } from '@/data/digitization/types'
import { PaymentUploadtype } from '@/data/requests/types'
import { OpFilter } from '@/data/types/Filters'
import { safeAny } from '@/utils'

import { FilterComponent } from './components/FilterComponent'
import { ModalLogs } from './components/ModalLogs'

const RangePicker = DatePicker.RangePicker
export default function PaymentBank() {
  return (
    <div className="container mx-auto mt-4 p-3">
      <div className="flex justify-between gap-2">
        <Filters />
        <ActionsFilter />
        <ButtonUpload />
      </div>
      <TableFiles />
    </div>
  )
}

const ActionsFilter = () => {
  const [isLoading, setIsLoading] = useState(false)
  const setFiles = useSetRecoilState(paymentFilesBankSt)
  const [filters, setFilters] = useRecoilState(paymentFilesFiltersBankSt)

  const applyFilters = async () => {
    try {
      setIsLoading(true)
      const data = await sdk.filterPaymentFiles({
        ...filters,
        folder: [OpFilter.In, ...sdk.FoldersUpload.bank],
      })
      setFiles(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setIsLoading(false)
    }
  }
  const cleanFilters = async () => {
    try {
      const filterDate = filters.created_at!
      setIsLoading(true)
      setFilters({ created_at: filterDate })
      const data = await sdk.filterPaymentFiles({ created_at: filterDate })
      setFiles(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex items-center gap-2">
      <Button
        type="primary"
        shape="circle"
        icon={<FiSearch />}
        onClick={applyFilters}
        className="flex items-center justify-center"
        loading={isLoading}
      />
      <Button
        type="primary"
        color="danger"
        shape="circle"
        loading={isLoading}
        icon={<MdOutlineCleaningServices />}
        onClick={cleanFilters}
        // className="flex items-center justify-center bg-red-500 text-white"
        danger
      />
    </div>
  )
}

const ButtonUpload = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [percentUpload, setPercentUpload] = useState(0)
  const [typeUpload, setTypeUpload] = useState<PaymentUploadtype>(
    PaymentUploadtype.Bank,
  )
  const [logsOpen, setLogsOpen] = useState(false)
  const [logsFail, setLogsFail] = useState<
    { filename: string; messageError: string }[]
  >([])

  const handleUpload = async () => {
    try {
      setLogsFail([])
      setUploading(true)
      let countUploads = 0
      const _logsFail: safeAny = []
      for (const _file of fileList) {
        const file = _file.originFileObj
        try {
          await sdk.uploadBank(file)
        } catch (err: any) {
          _logsFail.push({ filename: _file.name, messageError: err.message })
        }
        countUploads++
        setPercentUpload(
          Number(((countUploads / fileList.length) * 100).toFixed(1)),
        )
      }
      if (_logsFail.length > 0) {
        setLogsFail(_logsFail)
        return
      }
      setFileList([])
      toast.info('Archivos subidos', NOTIFICATION.success)
    } catch (err: any) {
      toast.error(err.message, { ...NOTIFICATION.error, autoClose: false })
    } finally {
      setUploading(false)
    }
  }
  const cancelUpload = () => {
    setIsOpen(false)
    setFileList([])
    setLogsFail([])
    setTypeUpload(PaymentUploadtype.Izipay)
  }

  const props: UploadProps = {
    itemRender: (originNode, _, currFileList) => {
      if (currFileList.length > 3) return null
      return <div>{originNode}</div>
    },
    multiple: true,
    accept: '.csv,.xlsx,.xls',
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
        setFileList(fileList)
      }
    },
    beforeUpload: () => {
      return false
    },
    fileList,
  }
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setIsOpen(true)
          setTypeUpload(PaymentUploadtype.Bank)
        }}
      >
        Subir archivo
      </Button>
      <Modal
        open={isOpen}
        okButtonProps={{ loading: uploading, disabled: fileList.length === 0 }}
        okText="Subir"
        cancelText="Cancelar"
        cancelButtonProps={{ loading: uploading }}
        onOk={handleUpload}
        maskClosable={false}
        onCancel={cancelUpload}
        centered={true}
        title={<p className="text-center">Subir archivo : {typeUpload}</p>}
      >
        <div className="flex items-center justify-center my-4 flex-col">
          <Upload {...props}>
            <Button icon={<AiOutlineInbox />} type="primary">
              Agregar archivo
            </Button>
            {fileList.length > 3 && (
              <div>
                <p className="m-2">
                  {fileList.length} archivos{' '}
                  <span
                    className="link text-blue-500 cursor-pointer"
                    onClickCapture={(e) => {
                      e.stopPropagation()
                      if (!uploading) setFileList([])
                    }}
                  >
                    Eliminar todos
                  </span>
                </p>
                {uploading && <Progress percent={percentUpload} />}
              </div>
            )}
          </Upload>
          {logsFail.length > 0 && (
            <div className="mt-2">
              <p className="">
                {logsFail.length} archivos no fueron subidos,
                <span
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => {
                    setLogsOpen(true)
                  }}
                >
                  ver errores
                </span>
              </p>
            </div>
          )}
        </div>
      </Modal>
      <ModalLogs
        onClose={() => setLogsOpen(false)}
        isOpen={logsOpen}
        logsFail={logsFail}
      />
    </>
  )
}

const Filters = () => {
  const [filters, setFilters] = useRecoilState(paymentFilesFiltersBankSt)

  const addFilter = (key: keyof IPaymentFile) => {
    if (!filters[key]) {
      const optionsFilter = optionsFilterPaymentFile(key)
      setFilters({
        ...filters,
        [key]: [optionsFilter[0]],
      })
    }
  }

  return (
    <div className="flex flex-1 gap-1 items-center">
      <RangePicker
        value={filters.created_at!.slice(1).map((el) => dayjs(el)) as safeAny}
        onChange={(e: safeAny) => {
          setFilters({
            ...filters,
            created_at: [
              filters.created_at![0],
              e[0].format('YYYY-MM-DD'),
              e[1].format('YYYY-MM-DD'),
            ],
          })
        }}
      />
      <Dropdown
        menu={{
          items: fieldsFilterPaymentFile().map((e) => ({
            key: e.key,
            label: e.label,
            onClick: () => addFilter(e.key),
          })),
        }}
        placement="bottom"
        trigger={['click']}
      >
        <div className="border border-solid border-gray-300 rounded-md p-1 text-sm flex items-center gap-1 cursor-pointer hover:border-blue-600 hover:text-blue-600">
          <IoMdAddCircleOutline />
          <span>agregar filtro</span>
        </div>
      </Dropdown>
      {Object.keys(filters).map((keyFilter) => {
        const ky: keyof IPaymentFile = keyFilter as safeAny
        if (ky == 'created_at') return null
        return (
          <FilterComponent
            key={keyFilter}
            keyFilter={ky}
            value={filters[ky]!}
            deleteFilter={() => {
              const newObj = Object.assign({}, filters)
              delete newObj[ky]
              setFilters(newObj)
            }}
            onChangeOption={(value: [OpFilter, ...safeAny[]]) => {
              setFilters({
                ...filters,
                [ky]: value,
              })
            }}
          />
        )
      })}
    </div>
  )
}
const TableFiles = () => {
  const files = useRecoilValue(paymentFilesBankSt)
  const columns: ColumnsType<IPaymentFile> = [
    { title: 'Id', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'file_name', key: 'file_name' },
    { title: 'Folder', dataIndex: 'folder', key: 'folder' },
    { title: 'Subido por', dataIndex: 'upload_by', key: 'upload_by' },
    { title: 'Tipo de archivo', dataIndex: 'file_type', key: 'file_type' },
    { title: 'fecha de subida', dataIndex: 'created_at', key: 'created_at' },
  ]
  return (
    <Table
      className="mt-3"
      rowKey={'id'}
      pagination={false}
      columns={columns}
      dataSource={files}
    />
  )
}
