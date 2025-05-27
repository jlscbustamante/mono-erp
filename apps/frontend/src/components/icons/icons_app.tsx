import { Eye, Pencil, Trash } from 'lucide-react'
import { IconWrapper } from './icon_wrapper'

export const EditIcon = ({
  on_click,
  loading,
}: {
  on_click?: () => void
  loading?: boolean
}) => {
  return <IconWrapper icon={Pencil} on_click={on_click} loading={loading} />
}

export const DelteIcon = ({
  on_click,
  loading,
}: {
  on_click?: () => void
  loading?: boolean
}) => {
  return <IconWrapper icon={Trash} on_click={on_click} loading={loading} />
}

export const EyeIcon = ({
  on_click,
  loading,
}: {
  on_click?: () => void
  loading?: boolean
}) => {
  return <IconWrapper icon={Eye} on_click={on_click} loading={loading} />
}
