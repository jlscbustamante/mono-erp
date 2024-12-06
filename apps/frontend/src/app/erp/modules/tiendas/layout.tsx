import { EmptyModule } from '@/components/empty-module'
import Layout, { MenuOption, MenuSeparator, gm } from '@/components/layout'
import { appConfig } from '@/const/config'
import { PATHS } from '@/const/paths'
import { useEffect, useMemo } from 'react'
import { useOutlet } from 'react-router'
import { useSession } from '../../use-session'

//
import { useSetRecoilState } from 'recoil'

import { cashAccountStoreSt, categoriesStoreSt } from '@/data/resources/state'
// import * as sdk from '@/data/resources/sdk'
import * as sdk from '@/data/stores/sdk'

const menu: (MenuOption | MenuSeparator)[] = [
  gm('Conciliar Tiendas', PATHS.erp.modulos.tiendas.conciliar),
  gm('Conciliar medios de pago', PATHS.erp.modulos.tiendas.mediosPago),
  gm('Comprobar cajas', PATHS.erp.modulos.tiendas.comprobarCajas),
]

export const TiendasLayout = () => {
  const setCashAccounts = useSetRecoilState(cashAccountStoreSt)
  const setCategories = useSetRecoilState(categoriesStoreSt)
  const views = useSession((st) => st.user.views)

  const outlet = useOutlet()

  const authorizedViews = useMemo(
    () =>
      menu
        .map((el) => {
          if (el.type == 'separator') return el
          else {
            if (views.includes(el.path)) {
              return el
            } else {
              if (el.children) {
                const childrens = el.children.filter((child) =>
                  views.includes(child.path),
                )
                if (childrens.length > 0) {
                  return {
                    ...el,
                    children: childrens,
                  }
                } else {
                  return null
                }
              } else {
                return null
              }
            }
          }
        })
        .filter((el) => el) as (MenuOption | MenuSeparator)[],
    [views],
  )

  useEffect(() => {
    ;(async () => {
      const [cashAccounts, categories] = await Promise.all([
        sdk.cashAccount(),
        sdk.categories(),
      ])
      setCashAccounts(cashAccounts)
      setCategories(categories)
    })()
  }, [])

  return (
    <>
      <Layout>
        <Layout.Header defaultTitle="Tiendas" />
        <Layout.Sidebar
          options={appConfig.ui.fullAccess ? menu : authorizedViews}
        />
        <Layout.Content>{outlet ? outlet : <EmptyModule />}</Layout.Content>
      </Layout>
    </>
  )
}
