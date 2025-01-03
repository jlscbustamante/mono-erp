export interface ComponentFiRender {
  filValue: any
  onFilChange: (val: any) => void
  operator: string
}

export interface FilterOption<T = unknown> {
  title: string
  index: keyof T
  noAllowClear?: boolean
  hide?: boolean
  options?: string[]
  default?: unknown
  type?: 'input' | 'range' | 'select' | 'num'
  props?: Record<string, any>
  render?: (props: ComponentFiRender) => JSX.Element
}
