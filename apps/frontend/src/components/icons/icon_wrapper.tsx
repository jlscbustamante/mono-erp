import { cn } from '@/utils'
import { Button } from 'antd'
import { LoaderCircle, LucideIcon } from 'lucide-react'

export const IconWrapper = ({
  icon,
  icon_class_name,
  button_class_name,
  on_click,
  loading,
}: {
  icon: LucideIcon
  icon_class_name?: string
  button_class_name?: string
  on_click?: () => void
  loading?: boolean
}) => {
  const Icon = icon
  return (
    <Button
      onClick={on_click}
      variant="filled"
      type="text"
      size="small"
      className={button_class_name}
    >
      <LoaderCircle
        className={cn(
          'w-5 h-auto text-slate-600',
          {
            hidden: !loading,
            'animate-spin': loading,
          },
          icon_class_name,
        )}
      />
      <Icon
        className={cn(
          'w-5 h-auto',
          {
            hidden: loading,
          },
          icon_class_name,
        )}
      />
    </Button>
  )
}
