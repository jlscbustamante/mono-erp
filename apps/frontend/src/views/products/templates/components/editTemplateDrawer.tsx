import { Drawer } from 'antd'
import { useEffect, useState } from 'react'

import { useStoreTemplate } from '@/views/products/templates/useStore'

export const EditTemplateDrawer = () => {
  const [visible, setVisible] = useState(false)
  const storeEdit = useStoreTemplate((st) => st.editStore)
  const setStoreId = useStoreTemplate((st) => st.setStoreId)

  useEffect(() => {
    if (storeEdit) setVisible(true)
  }, [storeEdit])

  if (!storeEdit) return null

  return (
    <Drawer
      placement="bottom"
      height={'90vh'}
      open={visible}
      onClose={() => setVisible(false)}
      afterOpenChange={(val) => {
        if (!val) {
          setStoreId(undefined)
        }
      }}
      title={`Editar "${storeEdit.name}" - ${storeEdit.type}`}
    >
      <div>Content</div>
    </Drawer>
  )
}
