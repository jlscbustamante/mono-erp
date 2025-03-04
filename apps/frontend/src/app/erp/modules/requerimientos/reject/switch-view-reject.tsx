import { SwitchView } from '../components/switch-view'
import { useRejectedStore } from './state'

export function SwitchViewReject() {
  const view = useRejectedStore((st) => st.view)
  const setView = useRejectedStore((st) => st.setView)
  return <SwitchView view={view} onChange={setView} />
}
