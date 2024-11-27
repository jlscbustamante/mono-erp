import { Avatar, Dropdown } from 'antd'
import { AiOutlineUser } from 'react-icons/ai'
import { useRecoilState } from 'recoil'

import { ITEM } from '@/const/localStorageItems'
import { userAuthState } from '@/states/userAuthState'

export const UserAvatar = () => {
  const [user] = useRecoilState(userAuthState)
  return (
    <div className="flex items-center gap-2">
      <p>{user?.user.name}</p>
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
                  window.location.replace('/auth/login')
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
