import { Checkbox, Input, Modal } from 'antd'
import { useState } from 'react'

import { safeAny } from '@/utils'

export const CreationForm: React.FC<{
  setShowModalCreation: safeAny
  showModalCreation: boolean
}> = ({ setShowModalCreation, showModalCreation }) => {
  const [url, setUrl] = useState('')
  const [haveMobile, setHaveMobile] = useState(false)

  return (
    <Modal
      onCancel={() => {
        setShowModalCreation(false)
      }}
      title="Añadir reporte"
      okText="Añadir"
      open={showModalCreation}
      centered={true}
      onOk={() => {
        //
      }}
    >
      <Input
        placeholder="URL del reporte(power bi)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <div className="mt-3">
        <label className="flex gap-2">
          <Checkbox
            value={haveMobile}
            onChange={(e) => setHaveMobile(e.target.checked)}
          />
          Tiene diseño movil
        </label>
      </div>
    </Modal>
  )
}
