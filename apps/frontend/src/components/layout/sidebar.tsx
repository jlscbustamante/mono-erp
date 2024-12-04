import { cn } from '@/utils'
import { Menu } from 'antd'
import { ItemType, MenuItemType } from 'antd/es/menu/interface'
import { useMemo } from 'react'
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router'
import { MenuOption, MenuSeparator } from '.'
import { useLayout } from './context'

export const SidebarLayout = ({
  options,
}: {
  options: (MenuOption | MenuSeparator)[]
}) => {
  const { sidebarOpen: show, toggleSidebar } = useLayout()
  const location = useLocation()
  const navigate = useNavigate()

  const items: ItemType<MenuItemType>[] = useMemo(() => {
    const finalOptions: ItemType<MenuItemType>[] = options.map((el, index) => {
      if (el.type == 'option') {
        const Icon = el.icon
        if (el.children) {
          return {
            key: el.path,
            type: 'submenu',
            icon: Icon ? <Icon /> : null,
            label: el.label,
            // title: el.label,
            children: el.children.map((children) => {
              const IconChildren = children.icon
              return {
                key: children.path,
                type: 'item',
                icon: IconChildren ? <IconChildren /> : null,
                label: children.label,
                title: children.label,
              }
            }),
          } satisfies ItemType
        } else {
          return {
            key: el.path,
            type: 'item',
            icon: Icon ? <Icon /> : null,
            label: el.label,
            title: el.label,
          } satisfies ItemType
        }
      } else {
        return {
          type: 'divider',
          key: `divider-${index}`,
        } satisfies ItemType
      }
    })

    return finalOptions
  }, [options])

  const handleSelect = ({ key }: { key: string }) => {
    if (key == '__expanded') {
      toggleSidebar()
    } else {
      navigate(key)
    }
  }

  return (
    <div className="h-full overflow-y-auto  shrink-0  float-left transition-[width] ease-in-out duration-300">
      <Menu
        className={cn('h-full', {
          'w-[3.75rem]': !show,
          'w-80': show,
        })}
        mode="inline"
        selectedKeys={[location.pathname]}
        inlineCollapsed={!show}
        items={[
          ...items,
          {
            type: 'divider',
          },
          {
            type: 'item',
            label: show ? 'Ocultar' : 'Mostrar',
            title: show ? 'Ocultar' : 'Mostrar',
            key: '__expanded',
            icon: (
              <MdOutlineKeyboardDoubleArrowRight
                style={{ transform: !show ? 'scaleX(1)' : 'scaleX(-1)' }}
              />
            ),
          },
        ]}
        onClick={handleSelect}
      />
    </div>
  )
}
