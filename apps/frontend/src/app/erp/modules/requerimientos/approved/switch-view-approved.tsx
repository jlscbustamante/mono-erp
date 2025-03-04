import { SwitchView } from '../components/switch-view'
import { useApprovedStore } from './state'

export function SwitchViewApproved() {
  const view = useApprovedStore((st) => st.view)
  const setView = useApprovedStore((st) => st.setView)
  return <SwitchView view={view} onChange={setView} />
}
