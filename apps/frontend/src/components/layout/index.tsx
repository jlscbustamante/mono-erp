/* eslint-disable react/display-name */
import { cn } from '@/utils'
import { LucideIcon } from 'lucide-react'
import React from 'react'
import { IconType } from 'react-icons/lib'
import { PATH_ICONS } from '../path-icons'
import { Content } from './content'
import { LayoutProvider } from './context'
import { HeaderLayout } from './header'
import { SidebarLayout } from './sidebar'

export interface MenuOption {
  type: 'option'
  label: string
  path: string
  icon: LucideIcon | IconType | null
  children?: MenuOption[]
  hide?: true
}

export interface MenuSeparator {
  type: 'separator'
}

export const gm = (
  label: string,
  path: string,
  children?: MenuOption[],
): MenuOption => ({
  label,
  path,
  icon: PATH_ICONS[path],
  children,
  type: 'option',
})
export const separator = (): MenuSeparator => {
  return {
    type: 'separator',
  }
}

export const Layout = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  let headerConfig: {
    defaultTitle: string
    className?: string
    classNameByPath?: {
      [key: string]: string
    }
  } = {
    defaultTitle: '',
  }
  let sidebarConfig: { options: (MenuSeparator | MenuOption)[] } = {
    options: [],
  }
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type == Layout.Sidebar) {
        sidebarConfig = child.props
      }
      if (child.type == Layout.Header) {
        headerConfig = child.props
      }
    }
  })

  return (
    <>
      <LayoutProvider>
        <div className={cn('h-screen overflow-hidden', className)}>
          <HeaderLayout
            {...headerConfig}
            options={sidebarConfig.options.filter((el) => el.type == 'option')}
          />
          <SidebarLayout {...sidebarConfig} />
          <div className="overflow-y-auto h-[calc(100%-60px)]">{children}</div>
        </div>
      </LayoutProvider>
    </>
  )
}

Layout.Header = (_: {
  keepDefaultTitle?: boolean
  defaultTitle: string
  className?: string
  classNameByPath?: {
    [key: string]: string
  }
}) => null
Layout.Sidebar = (_: { options: (MenuSeparator | MenuOption)[] }) => null
Layout.Content = Content

export default Layout
