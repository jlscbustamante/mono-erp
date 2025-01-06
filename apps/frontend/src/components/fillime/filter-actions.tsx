import { Button } from 'antd'
import { Search, X } from 'lucide-react'

export const ActionFilters = ({
  search,
  clear,
  loading,
}: {
  loading?: boolean
  clear?: () => void
  search?: () => void
}) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        loading={loading}
        size="small"
        type="primary"
        shape="circle"
        icon={<Search className="w-4 h-auto" />}
        onClick={() => search?.()}
        className="flex items-center justify-center"
      />
      <Button
        size="small"
        type="primary"
        color="danger"
        shape="circle"
        icon={<X className="w-4 h-auto" />}
        onClick={() => clear?.()}
        danger
      />
    </div>
  )
}
