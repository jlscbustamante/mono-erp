import { Avatar, Dropdown } from 'antd'
import { AiOutlineUser } from 'react-icons/ai'

import { useSession } from '@/app/erp/use-session'
import { ITEM } from '@/const/localStorageItems'
import { PATHS } from '@/const/paths'

export const UserAvatar = () => {
  // const [user] = useRecoilState(userAuthState)
  const userName = useSession((st) => st.user.userName)
  return (
    <div className="flex items-center gap-2">
      <p>{userName}</p>
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            {
              key: '2',
              label: <span>Editar perfil</span>,
              onClick: () => {
                window.location.replace('/auth/profile')
              },
            },
            {
              key: '1',
              label: <span>Cerrar sesión</span>,
              onClick: () => {
                try {
                  localStorage.removeItem(ITEM.TOKEN)
                  localStorage.removeItem(ITEM.USER_BASIC_INFO)
                  localStorage.removeItem(ITEM.USER_PERMISSION)
                } catch (err) {
                  console.log(err)
                } finally {
                  // navigate('/auth/login')
                  window.location.replace(PATHS.erp.auth.main)
                }
                console.log('cierra todo')
              },
            },
          ],
        }}
      >
        <Avatar
          style={{ backgroundColor: '#87d068', cursor: 'pointer' }}
          icon={<AiOutlineUser />}
        />
      </Dropdown>
    </div>
  )
}
