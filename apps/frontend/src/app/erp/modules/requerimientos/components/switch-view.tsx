import { cn } from '@/utils'
import { Switch } from 'antd'
import { Calendar, Logs, Table } from 'lucide-react'
import { ViewType } from './view-type.interface'

export function SwitchView({
  view,
  onChange,
}: {
  view?: ViewType
  onChange?: (view: ViewType) => void
}) {
  return (
    <div className="border border-slate-200 flex items-center bg-blue-50 p-0.5 rounded-md">
      <div
        onClick={() => {
          onChange?.('list')
        }}
        className={cn('p-1.5 flex items-center justify-center', {
          'bg-white shadow-md shadow-slate-400/10 cursor-pointer rounded-md text-slate-800 border border-solid border-slate-400/50':
            view == 'calendar',
          'text-slate-300 border-transparent': view == 'list',
        })}
      >
        <Table className={cn('w-5 h-auto')} />
      </div>
      <div
        onClick={() => {
          onChange?.('calendar')
        }}
        className={cn(
          'p-1.5 flex items-center justify-center border border-solid border-slate-400/50 rounded-md',
          {
            'bg-white shadow-md shadow-slate-400/10 cursor-pointer rounded-md text-slate-800':
              view == 'list',
            'text-slate-300 border-transparent': view == 'calendar',
          },
        )}
      >
        <Calendar className={cn('w-5 h-auto')} />
      </div>
    </div>
  )

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
