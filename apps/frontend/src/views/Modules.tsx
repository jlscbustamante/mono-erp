import { Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import Title from 'antd/es/typography/Title'
import { BiSolidBank, BiSolidStore } from 'react-icons/bi'
import { GiAutoRepair } from 'react-icons/gi'
import {
  MdDocumentScanner,
  MdOutlineRequestPage,
  MdOutlineSecurity,
} from 'react-icons/md'
import { VscChromeRestore, VscGraph } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'

import { useSession } from '@/app/erp/use-session'
import { UserAvatar } from '@/components/Avatar'
import { modules } from '@/const'
import { appConfig } from '@/const/config'
import { useMemo } from 'react'
import { FaUsersRays } from 'react-icons/fa6'
import { FaPizzaSlice } from 'react-icons/fa'

export const Modules = () => {
  const authorizedModules = useSession((st) => st.user.modules)
  const availableModules = useMemo(() => {
    if (appConfig.ui.fullAccess) return modules
    return modules.filter((el) => authorizedModules.includes(el.id))
  }, [authorizedModules, appConfig.ui.fullAccess])

  return (
    <div className="">
      <div className="flex justify-between mb-8 py-2 px-4 bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <img src="/Logo-0.75X.png" alt="" width={40} />
          {/* <img src={Logo} alt="" className="w-8 h-auto" /> */}
          <Title level={4} className="!text-white">
            Sistema administrativo de Pizza Raul
          </Title>
        </div>
        <UserAvatar />
      </div>
      <div className="container flex gap-4 mt-10 mx-auto flex-wrap">
        {availableModules.map((module) => (
          <ModuleItem
            title={module.title}
            module={module.module}
            route={module.route}
            key={module.module}
          />
        ))}
      </div>
    </div>
  )
}

const ModuleItem = ({
  title,
  module,
  route,
}: {
  title: string
  module: string
  route: string
}) => {
  const navigate = useNavigate()
  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={<CoverIcon module={module} />}
      onClick={() => {
        navigate(`${route}`)
      }}
    >
      <Meta title={title} className="text-center" />
    </Card>
  )
}
const CoverIcon = ({ module }: { module: string }) => {
  const widthIcon = 42
  let Icon = (
    <BiSolidStore
      style={{ width: widthIcon }}
      className="text-red-500 h-auto"
    />
  )
  switch (module) {
    case 'Caja de Tiendas':
      Icon = (
        <MdDocumentScanner
          style={{ width: widthIcon }}
          className="text-red-500 h-auto"
        />
      )
      break
    case 'Digitalización':
      Icon = (
        <VscChromeRestore
          style={{ width: widthIcon }}
          className="text-red-500 h-auto"
        />
      )
      break
    case 'Requerimientos':
      Icon = (
        <MdOutlineRequestPage
          style={{ width: widthIcon }}
          className="text-red-500 h-auto"
        />
      )
      break
    case 'Reportes':
      Icon = (
        <VscGraph
          style={{ width: widthIcon }}
          className="text-red-500 h-auto"
        />
      )
      break
    case 'Mantenimiento':
      Icon = (
        <GiAutoRepair
          style={{ width: widthIcon }}
          className="text-red-500 h-auto"
        />
      )
      break
    case 'Seguridad':
      Icon = (
        <MdOutlineSecurity
          style={{ width: widthIcon }}
          className="text-red-500 h-auto"
        />
      )
      break

    case 'Banco':
      Icon = (
        <BiSolidBank
          style={{ width: widthIcon }}
          className="text-red-500 h-auto"
        />
      )
      break
    case 'Mercaderia':
      Icon = (
        <VscChromeRestore
          style={{ width: widthIcon }}
          className="text-red-500 h-auto"
        />
      )
      break
    case 'RR.HH':
      Icon = (
        <FaUsersRays
          style={{ width: widthIcon }}
          className="text-red-500 h-auto"
        />
      )
      break
    case 'Recetas':
      Icon = (
        <FaPizzaSlice
          style={{ width: widthIcon }}
          className="text-red-500 h-auto"
        />
      )
      break
  }
  return <div className="text-center mt-8">{Icon}</div>
}
