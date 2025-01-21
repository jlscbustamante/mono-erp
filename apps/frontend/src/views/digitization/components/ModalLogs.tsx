import { Button, List, Modal, Typography } from 'antd'

export const ModalLogs: React.FC<{
  isOpen: boolean
  onClose: () => void
  logsFail: { filename: string; messageError: string }[]
}> = ({ isOpen: logsOpen, onClose, logsFail }) => {
  const donwloadAsTxt = () => {
    const element = document.createElement('a')
    const text = logsFail.map((item) => `${item.filename}`).join('\n')
    const file = new Blob([text], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'achivos-fallidos.txt'
    document.body.appendChild(element)
    element.click()
  }
  return (
    <Modal
      open={logsOpen}
      onCancel={() => onClose()}
      footer={
        <>
          <Button type="text" onClick={() => donwloadAsTxt()}>
            Descargar lista.txt
          </Button>
          <Button type="primary" onClick={() => onClose()}>
            Aceptar
          </Button>
        </>
      }
    >
      <List
        itemLayout="vertical"
        dataSource={logsFail}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text strong mark>
              {item.filename}
            </Typography.Text>{' '}
            {item.messageError}
          </List.Item>
        )}
      />
    </Modal>
  )
}
