import { Menu, MenuProps } from 'antd'
import { useEffect, useState } from 'react'
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'

import { PATHS } from '@/router/paths'

export interface MenuDivider {
  type: 'divider'
}

export interface MenuConfig {
  title?: string
  twBackground?: string
  twText?: string
}

export interface MenuItemList {
  key: React.Key
  type: 'option' | 'group'
  label: React.ReactNode
  icon?: React.ReactNode
  children?: MenuItemList[]
  config?: MenuConfig
}
export type MenuList = (MenuDivider | MenuItemList)[]

type MenuItem = Required<MenuProps>['items'][number]

function getItem(option: MenuDivider | MenuItemList): MenuItem {
  if (option.type == 'divider')
    return {
      type: option.type,
    }
  let childrens: undefined | MenuItem[] = undefined
  if (option.children) childrens = option.children.map(getItem)
  return {
    key: option.key,
    icon: option.icon,
    children: childrens,
    label: option.label,
    type: option.type,
  } as MenuItem
}

export const MenuLayout: React.FC<{
  items: MenuList
  onChangeConfig?: (config?: {
    title?: string
    twBackground?: string
    twText?: string
  }) => void
}> = ({ items, onChangeConfig }) => {
  const [collapsed, setCollapsed] = useState(true)
  const _items: MenuItem[] = items.map((item) => {
    return getItem(item)
  })
  const urlPath = useLocation().pathname

  const navigate = useNavigate()

  const handleConfig = (key: string) => {
    let item: MenuItemList | undefined
    for (const i of items) {
      if (i.type == 'divider') continue
      if (i.key == key) {
        item = i
        break
      }
      if (i.children && i.children.length > 0) {
        const _item = i.children.find((i) => i.key == key)
        if (_item) {
          item = _item
          break
        }
      }
    }
    if (!item) return
    const config = item.config
    if (config && !config.title) config.title = ''
    onChangeConfig?.(config)
  }

  useEffect(() => {
    handleConfig(urlPath)
  }, [])

  return (
    <div
      style={{ width: !collapsed ? 270 : 'auto' }}
      className="requests-layout__navigation flex"
    >
      <Menu
        defaultSelectedKeys={[urlPath]}
        mode="inline"
        rootClassName="_menu-layout"
        className="relative"
        onClick={({ key }) => {
          if (key === 'exit') {
            navigate(PATHS.modules)
          } else if (key === '__expand') {
            setCollapsed(!collapsed)
          } else {
            handleConfig(key)
            navigate(key)
          }
        }}
        inlineCollapsed={collapsed}
        items={[
          ..._items,
          // getItem({
          //   type: 'option',
          //   label: 'Ir a Home',
          //   key: 'exit',
          //   icon: <RxExit style={{ transform: 'scaleX(-1)' }} />,
          // }),
          getItem({
            type: 'option',
            label: collapsed ? 'Expandir' : 'Ocultar',
            key: '__expand',
            icon: (
              <MdOutlineKeyboardDoubleArrowRight
                style={{ transform: collapsed ? 'scaleX(1)' : 'scaleX(-1)' }}
              />
            ),
          }),
        ]}
      />
    </div>
  )
}
