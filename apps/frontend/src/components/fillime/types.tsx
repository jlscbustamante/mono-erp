export interface ComponentFiRender {
  filValue: any
  onFilChange: (val: any) => void
}

export interface FilterOption<T = unknown> {
  title: string
  index: keyof T
  noAllowClear?: boolean
  hide?: boolean
  options?: string[]
  default?: unknown
  selector?: Record<string, (props: ComponentFiRender) => void>
}
