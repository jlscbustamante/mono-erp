import { viewClient } from '@/lib/rpc'
import { SearchOutlined } from '@ant-design/icons'
import { AdmRequirementSelect } from '@types'
import {
  AutoComplete,
  AutoCompleteProps,
  Button,
  Divider,
  Drawer,
  Input,
  message,
} from 'antd'
import { atom, useAtom } from 'jotai'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { requirement_type_doc_text } from '../../components/requirement_type_text'
import { useCreateOrderStore } from './state'

const drawerAtom = atom(false)

export const useAgregarRequerimiento = () => {
  const [open, setOpen] = useAtom(drawerAtom)
  return {
    isOpen: open,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen((prev) => !prev),
  }
}

interface ISuplier {
  id: number
  supplier: string
  legal_number: string
}

export const AgregarRequerimiento = () => {
  const { isOpen, close } = useAgregarRequerimiento()
  const [ruc, setRuc] = useState('')
  const [razonSocial, setRazonSocial] = useState('')
  const [documentNumber, setDocumentNumber] = useState('')
  const [requirement, set_requirement] = useState<null | AdmRequirementSelect>(
    null,
  )
  const [options, set_options] = useState<AdmRequirementSelect[]>([])

  const options_autocomplete: AutoCompleteProps['options'] = useMemo(() => {
    return options.map((opt) => {
      return {
        label: `${opt.num_document} - ${opt.description?.slice(0, 20)}`,
        value: opt.num_document?.toString(),
      }
    }) satisfies AutoCompleteProps['options']
  }, [options])

  const requirements = useCreateOrderStore((st) => st.requirements)
  const set_requirements = useCreateOrderStore((st) => st.set_requirements)
  const [message_instance, context] = message.useMessage()

  const handle_search = async () => {
    set_requirement(null)
    const req = await viewClient.api.view.payment.search_requirement.$get({
      query: {
        ruc: ruc ? ruc : undefined,
        legal_name: razonSocial ? razonSocial : undefined,
        invoice_number: documentNumber ? documentNumber : undefined,
      },
    })

    const content = await req.json()
    if (!req.ok) {
      toast.error(content.message)
    }
    const selected_requirement = content.data as {
      related: AdmRequirementSelect[]
      supplier: ISuplier | null
    }
    if (selected_requirement.related.length == 0) {
      message_instance.warning('No se encontró el requerimiento')
    } else {
      if (selected_requirement.supplier) {
        setRuc(selected_requirement.supplier.legal_number)
        setRazonSocial(selected_requirement.supplier.supplier)
      }
      set_options(selected_requirement.related)
      if (documentNumber) {
        const req = selected_requirement.related.find(
          (el) => el.num_document == documentNumber,
        )
        if (req) set_requirement(req)
      }
    }
  }

  const add_requirement = () => {
    if (requirement) {
      const exists = requirements.find((req) => req.id == requirement.id)
      if (exists) {
        toast.error('El requerimiento ya fue agregado')
      } else {
        set_requirements([...requirements, requirement])
        set_requirement(null)
      }
    }
  }

  return (
    <Drawer
      onClose={close}
      open={isOpen}
      title="Agregar requerimiento para pago"
      width={450}
    >
      {context}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Ruc:</p>
          <Input
            placeholder=""
            value={ruc}
            onChange={(val) => {
              setRuc(val.target.value)
            }}
          />
          <Button
            className="rounded-full"
            htmlType="button"
            type="primary"
            shape="circle"
            onClick={handle_search}
            icon={<SearchOutlined />}
          />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Razón social:</p>
          <Input
            value={razonSocial}
            onChange={(val) => {
              setRazonSocial(val.target.value)
            }}
          />
          <Button
            className="rounded-full"
            type="primary"
            htmlType="button"
            shape="circle"
            onClick={handle_search}
            icon={<SearchOutlined />}
          />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Factura N°:</p>
          <AutoComplete
            value={documentNumber}
            onSelect={(val) => {
              const requirement = options.find((opt) => opt.num_document == val)
              if (requirement) {
                set_requirement(requirement)
              }
            }}
            onChange={(val) => {
              setDocumentNumber(val)
            }}
            options={options_autocomplete}
            className="w-full"
          />
          {/* <Input
            value={documentNumber}
            onChange={(val) => {
              setDocumentNumber(val.target.value)
            }}
          /> */}
          <Button
            className="rounded-full"
            type="primary"
            htmlType="button"
            onClick={handle_search}
            shape="circle"
            icon={<SearchOutlined />}
          />
        </div>
      </div>
      <Divider />
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Tipo documento:</p>
          <Input
            value={
              requirement?.type_document
                ? requirement_type_doc_text(requirement.type_document)
                : undefined
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">N° documento:</p>
          <Input value={requirement?.num_document ?? undefined} />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Detalle de pago:</p>
          <Input value={requirement?.description ?? undefined} />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Importe:</p>
          <Input value={requirement?.amount ?? undefined} />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Ruc:</p>
          <Input value={requirement?.legal_number ?? undefined} />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Razón social:</p>
          <Input value={requirement?.legal_name ?? undefined} />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Tipo cuenta:</p>
          <Input />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">N° cuenta:</p>
          <Input />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">CCI:</p>
          <Input />
        </div>
        <div className="flex justify-end">
          <Button
            type="primary"
            onClick={add_requirement}
            disabled={!requirement}
          >
            Agregar
          </Button>
        </div>
      </div>
    </Drawer>
  )
}
