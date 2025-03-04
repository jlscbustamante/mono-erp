import { cn } from '@/utils'
import { Switch } from 'antd'
import { Calendar, Logs } from 'lucide-react'
import { ViewType } from './view-type.interface'

export function SwitchView({
  view,
  onChange,
}: {
  view?: ViewType
  onChange?: (view: ViewType) => void
}) {
  return (
    <div className="flex rounded-md ml-2 gap-1">
      <Logs
        className={cn('w-5 h-auto text-slate-300', {
          'text-slate-900': view === 'list',
        })}
      />
      <Switch
        checked={view === 'calendar'}
        onChange={() => {
          if (view == 'calendar') {
            onChange?.('list')
          } else if (view == 'list') {
            onChange?.('calendar')
          }
        }}
      />
      <Calendar
        className={cn('w-5 h-auto text-slate-300', {
          'text-slate-900': view === 'calendar',
        })}
      />
    </div>
  )
}
