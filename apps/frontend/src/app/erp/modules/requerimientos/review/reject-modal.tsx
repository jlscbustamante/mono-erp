import { Modal } from 'antd'

export function RejectModal({
  onChange,
  open,
  id,
}: {
  open: boolean
  onChange: (s: boolean) => void
  id: number
}) {
  return (
    <Modal
      open={open}
      onCancel={() => onChange(false)}
      title="Rechazar"
      footer={null}
    >
      <p>content {id}</p>
    </Modal>
  )
}
