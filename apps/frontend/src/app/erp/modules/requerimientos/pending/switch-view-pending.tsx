import { SwitchView } from '../components/switch-view'
import { usePendingStore } from './state'

export function SwitchViewPending() {
  const view = usePendingStore((st) => st.view)
  const setView = usePendingStore((st) => st.setView)
  return <SwitchView view={view} onChange={setView} />
}
