// import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
// import { UserAvatar } from '../user-avatar'
import { UserAvatar } from '@/components'
import { PATHS } from '@/const/paths'
import { cn } from '@/utils'
import { BiExit } from 'react-icons/bi'
import { useLocation, useNavigate } from 'react-router'
import { MenuOption } from '.'

export const HeaderLayout = ({
  className,
  defaultTitle,
  options,
  classNameByPath,
}: {
  defaultTitle: string
  className?: string
  options: MenuOption[]
  classNameByPath?: {
    [key: string]: string
  }
}) => {
  const navigate = useNavigate()
  const pathName = useLocation()
  const title = useMemo(() => {
    let title: string = defaultTitle
    for (const option of options) {
      if (option.path == pathName.pathname) {
        title = option.label
        break
      } else if (option.children) {
        for (const child of option.children) {
          if (child.path == pathName.pathname) {
            title = child.label
            break
          }
        }
      }
    }
    return title
  }, [defaultTitle, options, pathName])

  return (
    <HeaderWrapper className="sticky top-0">
      <div
        className={cn(
          'p-3 flex items-center justify-between border border-b-4 border-indigo-50 bg-slate-900 text-white',
          className,
          classNameByPath?.[pathName.pathname] ?? '',
        )}
      >
        <div className="flex items-center gap-3">
          <button
            className="rounded-full bg-white p-1 flex items-center justify-center border-0 cursor-pointer hover:bg-slate-100 transition-colors ease-in-out hover:text-slate-800"
            // onClick={() => navigate(PATHS.modules)}
            onClick={() => navigate(PATHS.erp.modulos.home)}
            style={{ transform: 'scale(-1)' }}
          >
            <BiExit className="w-5 h-auto" />
          </button>
          <p className={cn('font-semibold')}>{title}</p>
        </div>
        <UserAvatar />
      </div>
    </HeaderWrapper>
  )
}

export const HeaderWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn('h-14 relative z-50', className)}>{children}</div>
}
